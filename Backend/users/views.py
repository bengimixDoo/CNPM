from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, ChangePasswordSerializer, LinkResidentSerializer
from residents.models import CuDan
from rest_framework.decorators import action

User = get_user_model()

class IsAdminUser(permissions.BasePermission):
    """
    Permission tùy chỉnh: Chỉ cho phép Admin truy cập.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'

class IsManagerOrAdmin(permissions.BasePermission):
    """
    Permission tùy chỉnh: Chỉ cho phép Admin hoặc Manager truy cập.
    """
    def has_permission(self, request, view):
        return request.user and (request.user.role == 'admin' or request.user.role == 'manager')

class UserMeView(generics.RetrieveAPIView):
    """
    Endpoint: GET /users/me/
    Mô tả: Lấy thông tin của chính user đang đăng nhập.
    Quyền: Owner (Authenticated User).
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Trả về user đang thực hiện request
        return self.request.user

class ChangePasswordView(APIView):
    """
    Endpoint: POST /users/change-password/
    Mô tả: Đổi mật khẩu.
    Input: {old_pass, new_pass}
    Quyền: Owner (Authenticated User).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Mật khẩu cũ không đúng."]}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"message": "Đổi mật khẩu thành công."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListCreateAPIView):
    """
    Endpoint: GET /users/ và POST /users/
    Mô tả: 
    - GET: Lấy danh sách user (có filter ?role=...).
    - POST: Tạo user mới.
    Quyền: Admin.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        """
        Hỗ trợ lọc theo role.
        """
        queryset = super().get_queryset()
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        return queryset

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Endpoint: PATCH /users/{id}/
    Mô tả: Xem chi tiết, khóa tài khoản (is_active=False), đổi Role.
    Quyền: Admin.
    Lưu ý: Không dùng endpoint này để đổi mật khẩu (dùng endpoint riêng hoặc admin site).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class LinkResidentView(APIView):
    """
    Endpoint: POST /users/{id}/link-resident/
    Mô tả: Liên kết tài khoản User với hồ sơ Cư dân.
    Quyền: Admin/Manager.
    """
    permission_classes = [IsManagerOrAdmin]

    def post(self, request, pk, *args, **kwargs):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        serializer = LinkResidentSerializer(data=request.data)
        if serializer.is_valid():
            cu_dan_id = serializer.validated_data['cu_dan_id']
            try:
                cu_dan = CuDan.objects.get(pk=cu_dan_id)
                user.cu_dan = cu_dan
                user.save()
                return Response({"message": f"Đã liên kết user {user.username} với cư dân {cu_dan.ho_ten}."}, status=status.HTTP_200_OK)
            except CuDan.DoesNotExist:
                 return Response({"error": "Cư dân không tồn tại."}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
