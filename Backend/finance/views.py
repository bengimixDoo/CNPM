from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.utils import timezone
from rest_framework import serializers

from .models import DanhMucPhi, HoaDon, ChiTietHoaDon, DotDongGop, DongGop
from services.models import ChiSoDienNuoc
from .serializers import (
    FeeCategorySerializer, InvoiceSerializer, FinanceChiSoDienNuocSerializer,
    RevenueStatsSerializer, RevenueStatsResponseSerializer,
    DotDongGopSerializer, DongGopSerializer, BatchGenerateSerializer,
    MonthlyExpenseSerializer
)
from users.permissions import IsManager, IsAccountant, IsOwnerOrReadOnly
from users.models import Notification

@extend_schema(tags=['Finance - Fees'])
class FeeCategoryViewSet(viewsets.ModelViewSet):
    queryset = DanhMucPhi.objects.all()
    serializer_class = FeeCategorySerializer
    permission_classes = [IsManager | IsAccountant]

@extend_schema(tags=['Finance - Utilities'])
class UtilityReadingViewSet(viewsets.ModelViewSet):
    queryset = ChiSoDienNuoc.objects.all()
    serializer_class = FinanceChiSoDienNuocSerializer
    permission_classes = [IsManager | IsAccountant]

@extend_schema(tags=['Finance - Invoices'])
class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = HoaDon.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        # Phân quyền dữ liệu
        if user.role == 'CU_DAN' and hasattr(user, 'cu_dan'):
            can_ho = user.cu_dan.can_ho_dang_o
            if can_ho:
                queryset = queryset.filter(can_ho=can_ho)
            else:
                queryset = queryset.none()
        elif user.role not in ['QUAN_LY', 'KE_TOAN', 'ADMIN']:
             queryset = queryset.none()

        # Filter params
        status_param = self.request.query_params.get('status')
        month = self.request.query_params.get('month')
        if status_param is not None:
             queryset = queryset.filter(trang_thai=status_param)
        if month:
            queryset = queryset.filter(thang=month)
        return queryset

    @action(detail=False, methods=['post'], url_path='generate')
    def generate_invoices(self, request):
        """
        Tạo hóa đơn hàng loạt cho khoản thu.
        Input: {
            "ma_phi": 1,
            "thang": 12,
            "nam": 2025,
            "apartment_ids": [1, 2, 3] hoặc "all"
        }
        """
        if request.user.role not in ['QUAN_LY', 'KE_TOAN', 'ADMIN']:
             return Response({"error": "Bạn không có quyền thực hiện thao tác này."}, status=status.HTTP_403_FORBIDDEN)
        
        ma_phi = request.data.get('ma_phi')
        thang = request.data.get('thang')
        nam = request.data.get('nam')
        apartment_selection = request.data.get('apartment_ids', 'all')
        
        if not ma_phi or not thang or not nam:
            return Response({"error": "Thiếu thông tin ma_phi, thang, hoặc nam."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            fee = DanhMucPhi.objects.get(ma_phi=ma_phi)
        except DanhMucPhi.DoesNotExist:
            return Response({"error": "Khoản phí không tồn tại."}, status=status.HTTP_404_NOT_FOUND)
        
        # Lấy danh sách căn hộ
        from residents.models import CanHo
        if apartment_selection == 'all':
            apartments = CanHo.objects.exclude(trang_thai='E')  # Tất cả trừ Empty
        else:
            apartments = CanHo.objects.filter(ma_can_ho__in=apartment_selection)
        
        created_count = 0
        for apt in apartments:
            # Kiểm tra xem đã có hóa đơn cho căn hộ này trong kỳ này chưa
            existing = HoaDon.objects.filter(
                can_ho=apt,
                thang=thang,
                nam=nam
            ).first()
            
            if existing:
                # Nếu đã có, thêm chi tiết vào hóa đơn hiện tại
                chi_tiet, created = ChiTietHoaDon.objects.get_or_create(
                    hoa_don=existing,
                    loai_phi=fee,
                    defaults={
                        'ten_phi_snapshot': fee.ten_phi,
                        'so_luong': 1,
                        'dong_gia_snapshot': fee.don_gia,
                        'thanh_tien': fee.don_gia
                    }
                )
                if not created:
                    # Nếu chi tiết đã tồn tại, cập nhật số lượng
                    chi_tiet.so_luong += 1
                    chi_tiet.thanh_tien = chi_tiet.so_luong * chi_tiet.dong_gia_snapshot
                    chi_tiet.save()
                
                # Cập nhật tổng tiền hóa đơn
                existing.tong_tien = sum(ct.thanh_tien for ct in existing.chi_tiet.all())
                existing.save()
            else:
                # Tạo hóa đơn mới
                invoice = HoaDon.objects.create(
                    can_ho=apt,
                    thang=thang,
                    nam=nam,
                    tong_tien=fee.don_gia,
                    trang_thai=0  # Chưa thanh toán
                )
                
                # Tạo chi tiết hóa đơn
                ChiTietHoaDon.objects.create(
                    hoa_don=invoice,
                    loai_phi=fee,
                    ten_phi_snapshot=fee.ten_phi,
                    so_luong=1,
                    dong_gia_snapshot=fee.don_gia,
                    thanh_tien=fee.don_gia
                )
                
                created_count += 1
        
        return Response({
            "message": f"Đã tạo {created_count} hóa đơn mới cho {len(apartments)} căn hộ.",
            "created": created_count,
            "total_apartments": len(apartments)
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='confirm-payment')
    def confirm_payment(self, request, pk=None):
        """
        Xác nhận thanh toán.
        - Admin/Kế toán: Xác nhận đã nhận tiền.
        - Cư dân: Xác nhận đã chuyển khoản/thanh toán (Self-confirm).
        """
        invoice = self.get_object()
        if invoice.trang_thai == 1:
             return Response({"message": "Hóa đơn này đã được thanh toán trước đó."}, status=status.HTTP_200_OK)
        
        # Nếu là cư dân, kiểm tra xem có phải hóa đơn của mình không (đã filter ở get_queryset nhưng check lại cho chắc)
        if request.user.role == 'CU_DAN':
             if not hasattr(request.user, 'cu_dan') or invoice.can_ho != request.user.cu_dan.can_ho_dang_o:
                 return Response({"error": "Bạn không có quyền xác nhận hóa đơn này."}, status=status.HTTP_403_FORBIDDEN)

        invoice.trang_thai = 1 # Đã thanh toán
        invoice.ngay_thanh_toan = timezone.now()
        invoice.save()
        
        actor = "Cư dân" if request.user.role == 'CU_DAN' else "Quản lý"
        return Response({"message": f"Xác nhận thanh toán thành công bởi {actor}."})

    @action(detail=True, methods=['post'], url_path='send-to-resident')
    def send_to_resident(self, request, pk=None):
        """Tạo thông báo in-app cho cư dân để họ mở giao diện và thanh toán."""
        if request.user.role not in ['QUAN_LY', 'KE_TOAN', 'ADMIN']:
            return Response({"error": "Bạn không có quyền thực hiện thao tác này."}, status=status.HTTP_403_FORBIDDEN)

        invoice = self.get_object()
        owner = getattr(invoice.can_ho, 'chu_so_huu', None)
        resident_user = getattr(owner, 'user_account', None) if owner else None

        if not owner or not resident_user:
            return Response({"error": "Căn hộ chưa gắn với tài khoản cư dân để gửi hóa đơn."}, status=status.HTTP_400_BAD_REQUEST)
        payment_url = request.data.get('payment_url') or f"/invoices/{invoice.ma_hoa_don}"
        Notification.objects.create(
            user=resident_user,
            title=f"Hóa đơn {invoice.thang}/{invoice.nam}",
            message=f"Tổng tiền {invoice.tong_tien}. Bấm để xem chi tiết và thanh toán.",
            target_type="INVOICE",
            target_id=invoice.ma_hoa_don,
        )

        return Response({"message": "Đã tạo thông báo hóa đơn cho cư dân.", "payment_url": payment_url})

@extend_schema(tags=['Finance - Analytics'])
class RevenueStatsView(viewsets.ViewSet):
    permission_classes = [IsManager | IsAccountant]
    
    @extend_schema(
        responses=RevenueStatsResponseSerializer,
        parameters=[
            OpenApiParameter("start_date", OpenApiTypes.DATE),
            OpenApiParameter("end_date", OpenApiTypes.DATE),
        ]
    )
    def list(self, request):
        # Logic thống kê doanh thu (Placeholder)
        return Response({"thang": "12/2025", "phat_sinh": 1000000, "thuc_thu": 800000})

@extend_schema(tags=['Finance - Fundraising Drives'])
class DotDongGopViewSet(viewsets.ModelViewSet):
    queryset = DotDongGop.objects.all().order_by('-ngay_bat_dau')
    serializer_class = DotDongGopSerializer
    permission_classes = [IsManager | IsAccountant] # Chỉ quản lý/kế toán tạo đợt

    @action(detail=True, methods=['get'])
    def thong_ke(self, request, pk=None):
        dot = self.get_object()
        stats = dot.danh_sach_dong_gop.aggregate(
            total_amount=Sum('so_tien'),
            count=Count('ma_dong_gop')
        )
        return Response(stats)

    @action(detail=True, methods=['post'], url_path='launch')
    def launch(self, request, pk=None):
        """
        Phát động đợt quyên góp: Tạo phiếu đóng góp (Chờ xác nhận) cho tất cả căn hộ đang có người ở.
        Input: { "so_tien_goi_y": 100000 } (Optional)
        """
        dot = self.get_object()
        so_tien = request.data.get('so_tien_goi_y', 0)
        
        # Lấy tất cả căn hộ đã bán hoặc đang thuê
        from residents.models import CanHo
        apartments = CanHo.objects.exclude(trang_thai='E')
        
        count = 0
        for apt in apartments:
            # Chỉ tạo nếu chưa có
            if not DongGop.objects.filter(dot_dong_gop=dot, can_ho=apt).exists():
                DongGop.objects.create(
                    dot_dong_gop=dot,
                    can_ho=apt,
                    so_tien=so_tien,
                    trang_thai='CHO_XAC_NHAN'
                )
                count += 1
        
        return Response({"message": f"Đã phát động quyên góp tới {count} căn hộ."})

@extend_schema(tags=['Finance - Donations'])
class DongGopViewSet(viewsets.ModelViewSet):
    queryset = DongGop.objects.all().order_by('-ngay_dong')
    serializer_class = DongGopSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['QUAN_LY', 'KE_TOAN', 'ADMIN']:
            return DongGop.objects.all()
        if user.role == 'CU_DAN' and hasattr(user, 'cu_dan'):
            can_ho = user.cu_dan.can_ho_dang_o
            if can_ho:
                return DongGop.objects.filter(can_ho=can_ho)
        return DongGop.objects.none()

    def perform_create(self, serializer):
        # Chỉ Admin/Quản lý mới được tạo khoản đóng góp (gửi yêu cầu)
        user = self.request.user
        if user.role not in ['QUAN_LY', 'KE_TOAN', 'ADMIN']:
             raise serializers.ValidationError("Chỉ Ban quản trị mới được tạo khoản đóng góp.")
        
        serializer.save(trang_thai='CHO_XAC_NHAN')

    @action(detail=True, methods=['post'], url_path='respond')
    def respond(self, request, pk=None):
        """
        Cư dân phản hồi: Xác nhận đóng góp hoặc Từ chối.
        Input: { "decision": "agree" | "reject", "so_tien": 200000 (Optional override) }
        """
        dong_gop = self.get_object()
        
        # Check quyền: Chỉ cư dân của căn hộ đó mới được phản hồi
        if request.user.role == 'CU_DAN':
             if not hasattr(request.user, 'cu_dan') or dong_gop.can_ho != request.user.cu_dan.can_ho_dang_o:
                 return Response({"error": "Bạn không có quyền phản hồi khoản này."}, status=status.HTTP_403_FORBIDDEN)
        
        decision = request.data.get('decision')
        if decision == 'agree':
            dong_gop.trang_thai = 'DA_DONG_GOP'
            
            # Allow updating amount if provided
            new_amount = request.data.get('so_tien')
            if new_amount:
                dong_gop.so_tien = new_amount
                
            dong_gop.save()
            return Response({"message": "Đã xác nhận đóng góp."})
        elif decision == 'reject':
            dong_gop.trang_thai = 'TU_CHOI'
            dong_gop.save()
            return Response({"message": "Đã từ chối đóng góp."})
        else:
            return Response({"error": "Lựa chọn không hợp lệ (agree/reject)."}, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['Finance - Analytics'])
class MonthlyExpenseViewSet(viewsets.ViewSet):
    permission_classes = [IsManager | IsAccountant]

    @extend_schema(
        responses=MonthlyExpenseSerializer(many=True),
        parameters=[
            OpenApiParameter("month", OpenApiTypes.INT, required=True, description="Tháng (1-12)"),
            OpenApiParameter("year", OpenApiTypes.INT, required=True, description="Năm (e.g. 2025)"),
        ]
    )
    def list(self, request):
        """
        Lấy danh sách tổng chi phí theo từng tháng của từng căn hộ.
        """
        month = request.query_params.get('month')
        year = request.query_params.get('year')

        if not month or not year:
            return Response({"error": "Vui lòng cung cấp tham số month và year."}, status=status.HTTP_400_BAD_REQUEST)

        # Lấy tất cả hóa đơn trong tháng/năm đó
        invoices = HoaDon.objects.filter(thang=month, nam=year).select_related('can_ho', 'can_ho__chu_so_huu')
        
        results = []
        for invoice in invoices:
            chu_so_huu_name = "Chưa có chủ sở hữu"
            if invoice.can_ho.chu_so_huu:
                chu_so_huu_name = invoice.can_ho.chu_so_huu.ho_ten
            
            results.append({
                "ma_can_ho": invoice.can_ho.ma_can_ho,
                "chu_ho": chu_so_huu_name,
                "thang": invoice.thang,
                "nam": invoice.nam,
                "tong_tien": invoice.tong_tien,
                "trang_thai": invoice.trang_thai
            })
            
        return Response(results)