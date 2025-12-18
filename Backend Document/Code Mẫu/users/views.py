from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

class IsAdminOrManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['ADMIN', 'QUAN_LY'] or request.user.is_superuser

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create': 
            return [IsAdminOrManager()] # Chỉ Admin/QL được tạo user
        if self.action in ['me', 'change_password']:
            return [permissions.IsAuthenticated()]
        return [IsAdminOrManager()]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)