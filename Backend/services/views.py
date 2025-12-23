from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

# Import Permissions
from users.permissions import IsAccountant, IsManager

# Import Models
from .models import PhuongTien, ChiSoDienNuoc, TinTuc, YeuCau, DichVu
# Import Serializers
from .serializers import (
    PhuongTienSerializer, ChiSoDienNuocSerializer, TinTucSerializer,
    CuDanYeuCauSerializer, QuanLyYeuCauSerializer, DichVuSerializer
)

# --- HÀM HỖ TRỢ LẤY CĂN HỘ CHUẨN XÁC ---
def get_user_can_ho(user):
    # Kiểm tra xem User có hồ sơ Cư Dân không
    if hasattr(user, 'cu_dan') and user.cu_dan:
        # [QUAN TRỌNG] Lấy đúng trường 'can_ho_dang_o' từ model CuDan
        return user.cu_dan.can_ho_dang_o
    return None

# ----------------------------------------------------------------------
# 1. VIEWSET DỊCH VỤ (BẢNG GIÁ)
# ----------------------------------------------------------------------
class DichVuViewSet(viewsets.ModelViewSet):
    queryset = DichVu.objects.all().order_by('ma_dich_vu')
    serializer_class = DichVuSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManager()]
        return [IsAuthenticated()]


# ----------------------------------------------------------------------
# 2. VIEWSET CHỈ SỐ ĐIỆN NƯỚC (ĐÃ SỬA LOGIC LỌC)
# ----------------------------------------------------------------------
class ChiSoDienNuocViewSet(viewsets.ModelViewSet):
    serializer_class = ChiSoDienNuocSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Kế toán / Quản lý / Admin: Xem hết
        if user.role in ['KE_TOAN', 'QUAN_LY', 'ADMIN'] or user.is_superuser:
            return ChiSoDienNuoc.objects.all().order_by('-nam', '-thang')

        # Cư dân: Chỉ xem hóa đơn của căn hộ mình đang ở
        can_ho = get_user_can_ho(user)

        if can_ho:
            # So sánh trường 'can_ho' trong bảng ChiSoDienNuoc với căn hộ của user
            return ChiSoDienNuoc.objects.filter(can_ho=can_ho).order_by('-nam', '-thang')

        # Nếu không tìm thấy căn hộ -> Trả về rỗng
        return ChiSoDienNuoc.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAccountant()]
        return [IsAuthenticated()]


# ----------------------------------------------------------------------
# 3. VIEWSET PHƯƠNG TIỆN (XE CỘ)
# ----------------------------------------------------------------------
class PhuongTienViewSet(viewsets.ModelViewSet):
    serializer_class = PhuongTienSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role in ['KE_TOAN', 'QUAN_LY', 'ADMIN']:
            return PhuongTien.objects.all().order_by('ma_xe')

        # Cư dân: Chỉ xem xe của nhà mình
        can_ho = get_user_can_ho(user)
        if can_ho:
            return PhuongTien.objects.filter(can_ho=can_ho)

        return PhuongTien.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'CU_DAN':
            can_ho = get_user_can_ho(user)
            if not can_ho:
                raise PermissionDenied("Bạn chưa được gán vào Căn hộ nào, không thể đăng ký xe.")
            serializer.save(can_ho=can_ho)
        else:
            serializer.save()


# ----------------------------------------------------------------------
# 4. VIEWSET TIN TỨC
# ----------------------------------------------------------------------
class TinTucViewSet(viewsets.ModelViewSet):
    queryset = TinTuc.objects.all().order_by('-ngay_dang')
    serializer_class = TinTucSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManager()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(nguoi_dang=self.request.user)


# ----------------------------------------------------------------------
# 5. VIEWSET YÊU CẦU (PHẢN ÁNH)
# ----------------------------------------------------------------------
class YeuCauViewSet(viewsets.ModelViewSet):
    queryset = YeuCau.objects.all().order_by('-ngay_gui')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.user.role in ['QUAN_LY', 'KE_TOAN', 'ADMIN']:
            return QuanLyYeuCauSerializer
        return CuDanYeuCauSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['QUAN_LY', 'KE_TOAN', 'ADMIN']:
            return YeuCau.objects.all().order_by('-ngay_gui')

        if user.role == 'CU_DAN' and hasattr(user, 'cu_dan'):
            return YeuCau.objects.filter(cu_dan=user.cu_dan).order_by('-ngay_gui')

        return YeuCau.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role == 'CU_DAN':
            if not hasattr(self.request.user, 'cu_dan'):
                raise PermissionDenied("Tài khoản chưa liên kết với hồ sơ Cư dân.")
            serializer.save(cu_dan=self.request.user.cu_dan)
        else:
            serializer.save()