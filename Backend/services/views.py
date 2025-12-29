from rest_framework import viewsets
from .models import PhuongTien, ChiSoDienNuoc, TinTuc, YeuCau, DichVu
from .serializers import PhuongTienSerializer, ChiSoDienNuocSerializer, TinTucSerializer
# from .serializers import  YeuCauSerializer
from .serializers import CuDanYeuCauSerializer, QuanLyYeuCauSerializer, DichVuSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from users.permissions import IsManager, IsResident, IsOwnerOrReadOnly, IsAccountant
from rest_framework.exceptions import PermissionDenied
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

@extend_schema(
    tags=['Services - Vehicles'],
    parameters=[OpenApiParameter("ma_xe", OpenApiTypes.INT, OpenApiParameter.PATH)]
)
class PhuongTienViewSet(viewsets.ModelViewSet):
    lookup_field = 'ma_xe'
    serializer_class = PhuongTienSerializer

    def get_permissions(self):
        """
        - CUD (Tạo, Sửa, Xóa): Chỉ Quản lý (IsManager)
        - R (Xem): Quản lý, Kế toán và Cư dân (IsManager | IsAccountant | IsOwnerOrReadOnly)
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsManager]
        else:
            # list và retrieve
            permission_classes = [IsManager | IsAccountant | IsOwnerOrReadOnly]
            
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return PhuongTien.objects.none()

        # 1. Quản lý, Kế toán, Admin: Xem tất cả xe trong tòa nhà
        if user.role in ['QUAN_LY', 'KE_TOAN', 'ADMIN'] or user.is_superuser:
            return PhuongTien.objects.all().select_related('can_ho')

        # 2. Cư dân: Chỉ xem xe thuộc căn hộ đang ở
        if user.role == 'CU_DAN':
            cu_dan_profile = getattr(user, 'cu_dan', None)
            if cu_dan_profile and cu_dan_profile.can_ho_dang_o:
                return PhuongTien.objects.filter(can_ho=cu_dan_profile.can_ho_dang_o)
            return PhuongTien.objects.none()

        return PhuongTien.objects.none()

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
@extend_schema(tags=['Services - Pricing'])
class DichVuViewSet(viewsets.ModelViewSet):
    queryset = DichVu.objects.all().order_by('ma_dich_vu')
    serializer_class = DichVuSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManager()]
        return [IsAuthenticated()]

# ----------------------------------------------------------------------
# 2. VIEWSET CHỈ SỐ ĐIỆN NƯỚC (ĐÃ SỬA LOGIC LỌC)
# ----------------------------------------------------------------------
@extend_schema(
    tags=['Services - Utility Readings'],
    parameters=[OpenApiParameter("ma_chi_so", OpenApiTypes.INT, OpenApiParameter.PATH)]
)
class ChiSoDienNuocViewSet(viewsets.ModelViewSet):
    lookup_field = 'ma_chi_so'
    serializer_class = ChiSoDienNuocSerializer

    def get_permissions(self):
        """
        - Tạo, Sửa, Xóa: Chỉ Quản lý/Admin (IsManager)
        - Xem (List, Retrieve): Quản lý, Kế toán và Cư dân (IsAuthenticated + get_queryset)
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsManager]
        else:
            # Mọi user đã đăng nhập đều có thể vào lớp View này, 
            # nhưng xem được gì sẽ do get_queryset quyết định
            permission_classes = [IsManager | IsAccountant | IsOwnerOrReadOnly]
            
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return ChiSoDienNuoc.objects.none()
        # 1. Quản lý, Kế toán, Admin: Xem toàn bộ
        if user.role in ['QUAN_LY', 'KE_TOAN', 'ADMIN'] or user.is_superuser:
            return ChiSoDienNuoc.objects.all().order_by('-nam', '-thang')

        # 2. Cư dân: Xem theo căn hộ đang ở (can_ho_dang_o)
        if user.role == 'CU_DAN':
            # Kiểm tra xem user có hồ sơ cư dân và có đang ở căn hộ nào không
            cu_dan_profile = getattr(user, 'cu_dan', None)
            
            if cu_dan_profile and cu_dan_profile.can_ho_dang_o:
                # Lọc chỉ số điện nước có trường 'can_ho' khớp với 'can_ho_dang_o' của cư dân
                return ChiSoDienNuoc.objects.filter(
                    can_ho=cu_dan_profile.can_ho_dang_o
                ).order_by('-nam', '-thang')
            
            # Nếu là cư dân nhưng chưa được gán căn hộ đang ở
            return ChiSoDienNuoc.objects.none()

        # 3. Các đối tượng khác
        return ChiSoDienNuoc.objects.none()

@extend_schema(tags=['Services - News'])
class TinTucViewSet(viewsets.ModelViewSet):
    queryset = TinTuc.objects.all().order_by('-ma_tin')
    serializer_class = TinTucSerializer

    def get_permissions(self):
        """
        - Tạo, Sửa, Xóa: Dành cho Manager và Accountant (dùng IsAccountant)
        - Xem (List, Retrieve): Dành cho tất cả User đã đăng nhập (bao gồm Cư dân)
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Lớp IsAccountant của bạn đã bao gồm role: ['KE_TOAN', 'QUAN_LY', 'ADMIN']
            permission_classes = [IsAccountant | IsManager]
        else:
            # Action 'list' và 'retrieve' (Xem tin tức)
            permission_classes = [IsAuthenticated]
            
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(nguoi_dang=self.request.user)


# ----------------------------------------------------------------------
# 5. VIEWSET YÊU CẦU (PHẢN ÁNH)
# ----------------------------------------------------------------------
@extend_schema(
    tags=['Services - Support Tickets'],
    parameters=[OpenApiParameter("ma_yeu_cau", OpenApiTypes.INT, OpenApiParameter.PATH)]
)
class YeuCauViewSet(viewsets.ModelViewSet):
    lookup_field = 'ma_yeu_cau'
    def get_serializer_class(self):
        # Trả về Serializer tương ứng với vai trò
        if self.request.user.is_authenticated and self.request.user.role == 'CU_DAN':
            return CuDanYeuCauSerializer
        return QuanLyYeuCauSerializer
    
    def get_permissions(self):
        """
        Phân quyền theo hành động (Action)
        """
        if self.action == 'create':
            # Chỉ Cư dân mới được tạo mới
            permission_classes = [IsResident]
        elif self.action in ['update', 'partial_update']:
            # Cư dân sửa của mình (để hủy), Manager sửa mọi thứ (để phản hồi)
            permission_classes = [IsOwnerOrReadOnly]
        elif self.action in ['list', 'retrieve']:
            # Chỉ Cư dân và Manager được xem. Kế toán sẽ bị chặn ở đây.
            permission_classes = [IsResident | IsManager] 
        else:
            # Các hành động khác (như xóa): Chỉ Admin
            permission_classes = [IsAdminUser]
            
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return YeuCau.objects.none()
        if user.role in ['QUAN_LY', 'KE_TOAN', 'ADMIN']:
            return YeuCau.objects.all().order_by('-ngay_gui')

        if user.role == 'CU_DAN' and hasattr(user, 'cu_dan'):
            return YeuCau.objects.filter(cu_dan=user.cu_dan).order_by('-ngay_gui')

        return YeuCau.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'CU_DAN':
            # 1. Lấy hồ sơ cư dân của user đang đăng nhập
            cu_dan_profile = getattr(user, 'cu_dan', None)

            # 2. Kiểm tra sự tồn tại của hồ sơ
            if not cu_dan_profile:
                raise PermissionDenied({
                    "Tài khoản của bạn chưa được liên kết với hồ sơ cư dân."
                })

            # 3. RÀNG BUỘC: Kiểm tra mã căn hộ đang ở
            if cu_dan_profile.can_ho_dang_o is None:
                raise PermissionDenied({
                    "Bạn chưa được gán vào căn hộ nào. Vui lòng liên hệ Ban quản lý để cập nhật thông tin trước khi gửi yêu cầu."
                })

            # 4. Nếu thỏa mãn, tiến hành lưu yêu cầu
            serializer.save(cu_dan=cu_dan_profile)