from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from .serializers import (
    UserSerializer, CreateUserSerializer,
    ChangePasswordSerializer, LinkResidentSerializer,
    MyTokenObtainPairSerializer
)
from .permissions import IsAdmin, IsAdminOrManager

User = get_user_model()

# 1. Custom Login View
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# 2. User ViewSet (CRUD + Custom Actions)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    # Cấu hình Serializer động
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateUserSerializer
        if self.action == 'change_password':
            return ChangePasswordSerializer
        if self.action == 'link_resident':
            return LinkResidentSerializer
        return UserSerializer

    # Cấu hình Permission động (Theo bảng API)
    def get_permissions(self):
        # Admin: Tạo, Xóa, List, Khóa tài khoản (partial_update)
        if self.action in ['create', 'destroy', 'list', 'partial_update']:
            return [permissions.IsAuthenticated(), IsAdmin()]

        # Admin/Manager: Link cư dân
        if self.action == 'link_resident':
            return [permissions.IsAuthenticated(), IsAdminOrManager()]

        # Authenticated User: Xem profile, Đổi pass
        return [permissions.IsAuthenticated()]

    # GET /users/me/
    @action(detail=False, methods=['get'], url_path='me')
    def get_me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    # POST /users/change-password/
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"error": "Mật khẩu cũ không đúng"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"message": "Đổi mật khẩu thành công"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # POST /users/{id}/link-resident/
    @action(detail=True, methods=['post'], url_path='link-resident')
    def link_resident(self, request, pk=None):
        user = self.get_object() # Lấy user theo ID trên URL
        serializer = LinkResidentSerializer(data=request.data)

        if serializer.is_valid():
            cu_dan_id = serializer.data['cu_dan_id']
            # Lazy import để tránh circular import nếu file models chưa load xong
            from residents.models import Resident
            try:
                resident = Resident.objects.get(pk=cu_dan_id)
                user.cu_dan = resident
                user.save()
                return Response({
                    "message": "Mapping thành công",
                    "user": user.username,
                    "resident_id": cu_dan_id
                })
            except Resident.DoesNotExist:
                return Response({"error": "Không tìm thấy Cư dân ID này"}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)