from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import ChiSoDienNuoc, TinTuc, YeuCau, PhuongTien
from .serializers import (
    ChiSoDienNuocSerializer, TinTucSerializer, 
    YeuCauSerializer, PhuongTienSerializer
)

class IsManagerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.role == 'manager' or request.user.role == 'admin')

class IsOwner(permissions.BasePermission):
    """
    Quyền: Chỉ chủ sở hữu (cư dân) mới có quyền tạo Yêu cầu.
    """
    def has_permission(self, request, view):
        # Logic check role resident or owner
        return request.user and request.user.is_authenticated

class UtilityReadingViewSet(viewsets.ModelViewSet):
    """
    Quản lý Chỉ số điện nước.
    """
    queryset = ChiSoDienNuoc.objects.all()
    serializer_class = ChiSoDienNuocSerializer
    permission_classes = [IsManagerOrAdmin]

    @decorators.action(detail=False, methods=['post'], url_path='batch-upload')
    def batch_upload(self, request):
        """
        Upload nhiều chỉ số cùng lúc (JSON List).
        Input: List of objects.
        """
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": f"Đã nhập {len(serializer.data)} chỉ số."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VehicleViewSet(viewsets.ModelViewSet):
    """
    Quản lý Xe cộ.
    """
    queryset = PhuongTien.objects.all()
    serializer_class = PhuongTienSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
             return [IsManagerOrAdmin()]
        return [permissions.IsAuthenticated()]

class SupportTicketViewSet(viewsets.ModelViewSet):
    """
    Quản lý Yêu cầu hỗ trợ.
    - Create: Cư dân (Owner).
    - Update: Manager (Phản hồi status).
    """
    queryset = YeuCau.objects.all()
    serializer_class = YeuCauSerializer

    def perform_create(self, serializer):
        # Tự động gán cư dân dựa trên user đang login
        # Lưu ý: User phải đã link với CuDan
        if hasattr(self.request.user, 'cu_dan') and self.request.user.cu_dan:
            serializer.save(cu_dan=self.request.user.cu_dan)
        else:
            raise serializers.ValidationError("User này chưa liên kết với hồ sơ Cư dân.")

    def get_queryset(self):
        """
        Resident chỉ thấy của mình. Manager thấy hết.
        """
        user = self.request.user
        if user.role == 'manager' or user.role == 'admin':
            return YeuCau.objects.all()
        # Nếu là resident, filter theo cu_dan_id
        if hasattr(user, 'cu_dan') and user.cu_dan:
            return YeuCau.objects.filter(cu_dan=user.cu_dan)
        return YeuCau.objects.none()

class NewsViewSet(viewsets.ModelViewSet):
    """
    Quản lý Tin tức.
    """
    queryset = TinTuc.objects.all().order_by('-ngay_dang')
    serializer_class = TinTucSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsManagerOrAdmin()]
        return [permissions.AllowAny()] # Public readings? Or Authenticated
    
    def perform_create(self, serializer):
        serializer.save(nguoi_dang=self.request.user)
