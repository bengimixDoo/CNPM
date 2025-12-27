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
    DotDongGopSerializer, DongGopSerializer, BatchGenerateSerializer
)
from users.permissions import IsManager, IsAccountant, IsOwnerOrReadOnly

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
        # Chỉ Manager/Accountant được tạo hóa đơn
        if request.user.role not in ['QUAN_LY', 'KE_TOAN', 'ADMIN']:
             return Response({"error": "Bạn không có quyền thực hiện thao tác này."}, status=status.HTTP_403_FORBIDDEN)
             
        # Logic tạo hóa đơn hàng loạt (Placeholder)
        return Response({"message": "Invoices generated successfully"}, status=status.HTTP_201_CREATED)

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