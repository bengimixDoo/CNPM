from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

# Import Permissions
from users.permissions import IsAccountant, IsManager

# Import Models & Serializers
from .models import KhoanThu, HoaDon  # Giả sử bạn có model KhoanThu (Fee) và HoaDon (Bill/Payment)
from .serializers import KhoanThuSerializer, HoaDonSerializer

# -----------------------------------------------------------
# 1. QUẢN LÝ CÁC KHOẢN THU (Phí dịch vụ, Phí gửi xe,...)
# -----------------------------------------------------------
class KhoanThuViewSet(viewsets.ModelViewSet):
    """
    Danh mục các loại phí (Ví dụ: Phí quản lý 5k/m2, Phí gửi xe 100k/tháng)
    - Kế toán/Quản lý: Được Thêm/Sửa/Xóa.
    - Cư dân: Chỉ được Xem để biết giá.
    """
    queryset = KhoanThu.objects.all()
    serializer_class = KhoanThuSerializer
    permission_classes = [IsAuthenticated] # Ai cũng vào được, nhưng sẽ chặn sửa ở dưới

    def get_permissions(self):
        # Nếu là hành động Sửa/Xóa/Thêm -> Chỉ Kế toán/Quản lý
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAccountant()]
        # Nếu chỉ xem (list/retrieve) -> Ai đã đăng nhập cũng xem được
        return [IsAuthenticated()]


# -----------------------------------------------------------
# 2. QUẢN LÝ HÓA ĐƠN / THANH TOÁN
# -----------------------------------------------------------
class HoaDonViewSet(viewsets.ModelViewSet):
    """
    Hóa đơn thanh toán của từng căn hộ.
    """
    serializer_class = HoaDonSerializer
    permission_classes = [IsAuthenticated] # Mặc định phải đăng nhập

    def get_queryset(self):
        """
        Phân quyền dữ liệu:
        - Kế toán/Quản lý: Xem hết để kiểm soát thu chi.
        - Cư dân: Chỉ xem hóa đơn của căn hộ mình đang ở.
        """
        user = self.request.user

        # 1. Nhóm quản lý: Xem tất cả
        if user.role in ['ADMIN', 'QUAN_LY', 'KE_TOAN'] or user.is_superuser:
            return HoaDon.objects.all().order_by('-ngay_tao')

        # 2. Nhóm cư dân: Chỉ xem hóa đơn gắn với căn hộ của mình
        if hasattr(user, 'cu_dan') and user.cu_dan:
            # Giả sử model HoaDon có field 'can_ho'
            # Lấy danh sách căn hộ mà cư dân này đang ở
            ds_can_ho = user.cu_dan.ds_can_ho.all() # Hoặc logic tương tự tùy model của bạn

            # Cách đơn giản nhất nếu HoaDon có field 'cu_dan':
            # return HoaDon.objects.filter(cu_dan=user.cu_dan)

            # Nếu HoaDon gắn với CanHo:
            # Tìm căn hộ mà user này đang là đại diện hoặc thành viên
            return HoaDon.objects.filter(can_ho__cu_dan_hien_tai=user.cu_dan).distinct().order_by('-ngay_tao')

        return HoaDon.objects.none()

    def get_permissions(self):
        """
        Phân quyền hành động:
        - Cư dân: Chỉ được Xem (GET). Không được tự tạo hóa đơn hay xóa hóa đơn.
        - Kế toán: Được làm tất cả (Tạo hóa đơn thu tiền, xác nhận đã đóng tiền).
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAccountant()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # Khi Kế toán tạo hóa đơn, tự động lưu người tạo là user đang đăng nhập
        serializer.save(nguoi_tao=self.request.user)

    # API mở rộng: Thống kê doanh thu (Chỉ Kế toán xem)
    @action(detail=False, methods=['get'], url_path='thongke', permission_classes=[IsAccountant])
    def thong_ke_doanh_thu(self, request):
        # Logic thống kê tổng tiền
        # Ví dụ: Tong tien da thu thang nay...
        return Response({"message": "API Thống kê doanh thu (Chưa implement)"})