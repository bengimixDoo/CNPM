from rest_framework import viewsets
from .models import PhuongTien, ChiSoDienNuoc, TinTuc, YeuCau
from .serializers import PhuongTienSerializer, ChiSoDienNuocSerializer, TinTucSerializer
# from .serializers import  YeuCauSerializer
from .serializers import CuDanYeuCauSerializer, QuanLyYeuCauSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

class PhuongTienViewSet(viewsets.ModelViewSet):
    queryset = PhuongTien.objects.all().order_by('ma_xe')
    serializer_class = PhuongTienSerializer

class ChiSoDienNuocViewSet(viewsets.ModelViewSet):
    queryset = ChiSoDienNuoc.objects.all().order_by('ma_chi_so')
    serializer_class = ChiSoDienNuocSerializer

class TinTucViewSet(viewsets.ModelViewSet):
    queryset = TinTuc.objects.all().order_by('ma_tin')
    serializer_class = TinTucSerializer

    def perform_create(self, serializer):
        # Tự động gán người đăng là tài khoản đang thực hiện thao tác
        serializer.save(nguoi_dang=self.request.user)

# Chỉ được tạo khi có user.role == 'CU_DAN', cư dân có quyền xem các yêu cầu của mình và chỉnh trạng thái sang Hủy.
# Quản lý được xem toàn bộ yêu cầu, có quyền chỉnh sửa.
class YeuCauViewSet(viewsets.ModelViewSet):
    queryset = YeuCau.objects.all().order_by('ma_yeu_cau')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        # Trả về Serializer tương ứng với vai trò
        if self.request.user.role == 'QUAN_LY':
            return QuanLyYeuCauSerializer
        return CuDanYeuCauSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CU_DAN':
            return YeuCau.objects.filter(cu_dan=user.cu_dan)
        return YeuCau.objects.all()

    def perform_create(self, serializer):
        # Tự động gán cư dân khi tạo
        serializer.save(cu_dan=self.request.user.cu_dan)