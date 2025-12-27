from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .models import DanhMucPhi, HoaDon, ChiTietHoaDon
from .serializers import DanhMucPhiSerializer, HoaDonSerializer, BatchGenerateSerializer, ChiSoDienNuocSerializer
from residents.models import CanHo
from services.models import ChiSoDienNuoc, PhuongTien
from django.db import transaction
from django.utils import timezone

class IsManagerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.role == 'manager' or request.user.role == 'admin')

@extend_schema(tags=['Finance - Fees'])
class FeeCategoryViewSet(viewsets.ModelViewSet):
    """
    Quản lý danh mục phí.
    """
    queryset = DanhMucPhi.objects.all()
    serializer_class = DanhMucPhiSerializer
    permission_classes = [IsManagerOrAdmin] # Chỉ Manager được chỉnh sửa phí
    
@extend_schema(tags=['Finance - Utilities'])
class UtilityReadingViewSet(viewsets.ModelViewSet):
    """
    Quản lý Chỉ số điện nước.
    """
    queryset = ChiSoDienNuoc.objects.all()
    serializer_class = ChiSoDienNuocSerializer
    permission_classes = [IsManagerOrAdmin]

    @decorators.action(detail=False, methods=['post'], url_path='batch')
    def batch(self, request):
        """
        Upload nhiều chỉ số cùng lúc (JSON List).
        Input: List of objects.
        """
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": f"Đã nhập {len(serializer.data)} chỉ số."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['Finance - Invoices'])
class InvoiceViewSet(viewsets.ModelViewSet):
    """
    Quản lý Hóa đơn.
    Core Logic nằm ở batch_generate.
    """
    queryset = HoaDon.objects.all()
    serializer_class = HoaDonSerializer

    def get_queryset(self):
        """
        Filter theo status, month.
        """
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status')
        month = self.request.query_params.get('month')
        if status_param is not None:
             queryset = queryset.filter(trang_thai=status_param)
        if month:
            queryset = queryset.filter(thang=month)
        return queryset

    @decorators.action(detail=False, methods=['post'], url_path='batch-generate')
    def batch_generate(self, request):
        """
        Tạo hóa đơn hàng loạt cho tháng/năm chỉ định.
        Logic:
        1. Lấy tất cả căn hộ.
        2. Với mỗi căn hộ:
           - Tính tiền điện/nước (dựa vào ChiSoDienNuoc tháng đó).
           - Tính phí quản lý (cố định hoặc theo diện tích).
           - Tính phí gửi xe (đếm số xe của căn hộ).
           - Tổng hợp -> Lưu HoaDon + ChiTietHoaDon.
        """
        serializer = BatchGenerateSerializer(data=request.data)
        if serializer.is_valid():
            thang = serializer.validated_data['thang']
            nam = serializer.validated_data['nam']
            
            # Lấy định mức giá
            try:
                gia_dien = DanhMucPhi.objects.filter(ten_loai_phi__icontains='Dien').first()
                gia_nuoc = DanhMucPhi.objects.filter(ten_loai_phi__icontains='Nuoc').first()
                gia_quan_ly = DanhMucPhi.objects.filter(ten_loai_phi__icontains='QuanLy').first()
                gia_gui_xe = DanhMucPhi.objects.filter(ten_loai_phi__icontains='GuiXe').first()

                if not all([gia_dien, gia_nuoc, gia_quan_ly, gia_gui_xe]):
                     return Response({"error": "Chưa cấu hình đầy đủ bảng giá (Điện, Nước, Quản lý, Gửi xe)."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"Lỗi cấu hình phí: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

            generated_count = 0
            
            with transaction.atomic():
                # Loop tất cả căn hộ
                for apt in CanHo.objects.all():
                    # Chỉ tạo nếu chưa có hóa đơn tháng đó
                    if HoaDon.objects.filter(can_ho=apt, thang=thang, nam=nam).exists():
                        continue 
                    
                    total_amount = 0
                    details = []

                    # 1. Điện Nước
                    readings = ChiSoDienNuoc.objects.filter(can_ho=apt, thang=thang, nam=nam)
                    for reading in readings:
                        tieu_thu = reading.chi_so_moi - reading.chi_so_cu
                        if tieu_thu < 0: tieu_thu = 0 # Check logic
                        
                        price_obj = gia_dien if reading.loai_dich_vu == 'Dien' else gia_nuoc
                        cost = tieu_thu * price_obj.dong_gia_hien_tai
                        
                        details.append({
                            'loai_phi': price_obj,
                            'ten_phi_snapshot': f"Tiền {reading.loai_dich_vu} (T{thang})",
                            'so_luong': tieu_thu,
                            'dong_gia_snapshot': price_obj.dong_gia_hien_tai,
                            'thanh_tien': cost
                        })
                        total_amount += cost
                    
                    # 2. Phí Quản lý (Ví dụ tính theo diện tích)
                    ql_cost = apt.dien_tich * gia_quan_ly.dong_gia_hien_tai
                    details.append({
                        'loai_phi': gia_quan_ly,
                        'ten_phi_snapshot': f"Phí Quản lý ({apt.dien_tich}m2)",
                        'so_luong': int(apt.dien_tich),
                        'dong_gia_snapshot': gia_quan_ly.dong_gia_hien_tai,
                        'thanh_tien': ql_cost
                    })
                    total_amount += ql_cost

                    # 3. Phí Xe
                    xe_count = PhuongTien.objects.filter(can_ho=apt).count()
                    if xe_count > 0:
                        xe_cost = xe_count * gia_gui_xe.dong_gia_hien_tai
                        details.append({
                            'loai_phi': gia_gui_xe,
                            'ten_phi_snapshot': f"Phí Gửi xe ({xe_count} xe)",
                            'so_luong': xe_count,
                            'dong_gia_snapshot': gia_gui_xe.dong_gia_hien_tai,
                            'thanh_tien': xe_cost
                        })
                        total_amount += xe_cost
                    
                    # Lưu Hóa đơn
                    invoice = HoaDon.objects.create(
                        can_ho=apt,
                        thang=thang,
                        nam=nam,
                        tong_tien=total_amount,
                        trang_thai=0 # Chưa thanh toán
                    )
                    
                    # Lưu Chi tiết
                    for d in details:
                        ChiTietHoaDon.objects.create(
                            hoa_don=invoice,
                            loai_phi=d['loai_phi'],
                            ten_phi_snapshot=d['ten_phi_snapshot'],
                            so_luong=d['so_luong'],
                            dong_gia_snapshot=d['dong_gia_snapshot'],
                            thanh_tien=d['thanh_tien']
                        )
                    
                    generated_count += 1

            return Response({"message": f"Đã tạo {generated_count} hóa đơn cho tháng {thang}/{nam}."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(detail=True, methods=['post'], url_path='confirm-payment')
    def confirm_payment(self, request, pk=None):
        """
        Xác nhận thanh toán.
        """
        invoice = self.get_object()
        if invoice.trang_thai == 1:
             return Response({"message": "Hóa đơn này đã được thanh toán trước đó."}, status=status.HTTP_200_OK)
        
        invoice.trang_thai = 1 # Đã thanh toán
        invoice.ngay_thanh_toan = timezone.now()
        invoice.save()
        return Response({"message": "Xác nhận thanh toán thành công."})

@extend_schema(tags=['Finance - Analytics'])
class RevenueStatsView(viewsets.ViewSet):
    """
    Endpoint: GET /analytics/monthly-revenue/
    Mô tả: Báo cáo doanh thu theo tháng/năm.
    Quyền: Manager/Admin.
    """
    permission_classes = [IsManagerOrAdmin]

    @decorators.action(detail=False, methods=['get'], url_path='monthly-revenue')
    def monthly_revenue(self, request):
        """
        Input: ?year=2023
        Output: List doanh thu 12 tháng.
        """
        year = request.query_params.get('year')
        if not year:
            year = timezone.now().year
        
        data = []
        for month in range(1, 13):
            invoices = HoaDon.objects.filter(nam=year, thang=month)
            total_revenue = sum(inv.tong_tien for inv in invoices) # Tổng phát sinh
            collected_revenue = sum(inv.tong_tien for inv in invoices if inv.trang_thai == 1) # Thực thu
            
            data.append({
                "thang": month,
                "phat_sinh": total_revenue,
                "thuc_thu": collected_revenue
            })
        
        return Response({"nam": year, "data": data})