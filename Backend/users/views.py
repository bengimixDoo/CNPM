from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema

# Import Serializers
from .serializers import (
    UserSerializer, CreateUserSerializer,
    ChangePasswordSerializer, LinkResidentSerializer,
    MyTokenObtainPairSerializer, NotificationSerializer
)
from .models import Notification

# [QUAN TRỌNG] Import đúng tên Permission mới
# IsManager đã bao gồm quyền của Admin và Manager
from .permissions import IsAdmin, IsManager, IsOwnerOrReadOnly

User = get_user_model()

# ------------------------------------------------------------------
# 1. Custom Login View (Trả về Token + Role)
# ------------------------------------------------------------------
@extend_schema(tags=['Auth'])
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# ------------------------------------------------------------------
# 2. User ViewSet (Quản lý người dùng)
# ------------------------------------------------------------------
@extend_schema(tags=['Users'])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')

    # Cấu hình Serializer động theo hành động
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateUserSerializer
        if self.action == 'change_password':
            return ChangePasswordSerializer
        if self.action == 'link_resident':
            return LinkResidentSerializer
        return UserSerializer

    # Cấu hình Permission động (Logic bảo mật)
    def get_permissions(self):
        # 1. Tạo User (Create):
        # - Nếu muốn ai cũng đăng ký được -> dùng [permissions.AllowAny()]
        # - Nếu chỉ Quản lý mới được tạo User -> dùng [IsManager()]
        if self.action == 'create':
            return [IsManager()]

            # 2. Xem danh sách (List): Chỉ Quản lý/Admin được xem hết user
        if self.action == 'list':
            return [IsManager()]

        # 3. Xem chi tiết/Sửa (Retrieve/Update): Chính chủ hoặc Quản lý
        if self.action in ['retrieve', 'update', 'partial_update']:
            return [IsOwnerOrReadOnly()]

        # 4. Xóa User (Destroy): Quản lý hoặc Admin (IsManager đã bao gồm Admin)
        if self.action == 'destroy':
            return [IsManager()]

        # 5. Link Cư dân: Chỉ Quản lý thực hiện
        if self.action == 'link_resident':
            return [IsManager()]

        # Các hành động khác (change_password, get_me): Cần đăng nhập
        return [permissions.IsAuthenticated()]

    # GET /api/users/me/
    @action(detail=False, methods=['get'], url_path='me')
    def get_me(self, request):
        """Lấy thông tin của chính user đang đăng nhập"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    # POST /api/users/change-password/
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        """Đổi mật khẩu"""
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            user = request.user
            # Kiểm tra mật khẩu cũ
            if not user.check_password(serializer.data.get("old_password")):
                return Response(
                    {"error": "Mật khẩu cũ không đúng"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Đặt mật khẩu mới
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response(
                {"message": "Đổi mật khẩu thành công"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # POST /api/users/{id}/link-resident/
    @action(detail=True, methods=['post'], url_path='link-resident')
    def link_resident(self, request, pk=None):
        """
        API dành cho Quản lý: Liên kết tài khoản User với hồ sơ Cư Dân
        """
        user = self.get_object() # Lấy user theo ID trên URL
        serializer = LinkResidentSerializer(data=request.data)

        if serializer.is_valid():
            cu_dan_id = serializer.data['cu_dan_id']

            # [SỬA LỖI] Dùng lazy import và đúng tên model CuDan (không phải Resident)
            from residents.models import CuDan

            try:
                # Tìm hồ sơ cư dân
                resident_obj = CuDan.objects.get(pk=cu_dan_id)

                # Cập nhật liên kết
                user.cu_dan = resident_obj
                user.save()

                return Response({
                    "message": "Mapping thành công",
                    "user": user.username,
                    "resident_linked": resident_obj.ho_ten,
                    "resident_id": cu_dan_id
                })
            except CuDan.DoesNotExist:
                return Response(
                    {"error": f"Không tìm thấy Cư dân có ID {cu_dan_id}"},
                    status=status.HTTP_404_NOT_FOUND
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=['Notifications'])
class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response({"message": "Đã đánh dấu đã đọc"})