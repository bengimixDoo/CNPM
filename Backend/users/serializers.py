from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Notification
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

# --- 1. Custom JWT Login Response (Theo ảnh 3) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom lại response khi login:
    Trả về thêm role và cu_dan_id để Frontend điều hướng ngay lập tức.
    """
    def validate(self, attrs):
        data = super().validate(attrs)

        # Thêm thông tin vào response body
        data['role'] = self.user.role
        data['cu_dan_id'] = self.user.cu_dan.id if self.user.cu_dan else None
        data['username'] = self.user.username

        return data

# --- 2. User Serializers ---
class UserSerializer(serializers.ModelSerializer):
    """Dùng cho GET /users/me/ và List Users"""
    cu_dan_id = serializers.IntegerField(source='cu_dan.id', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'cu_dan_id', 'is_active', 'date_joined', 'first_name', 'last_name']
        read_only_fields = ['id', 'date_joined', 'role']

class CreateUserSerializer(serializers.ModelSerializer):
    """Dùng cho Admin tạo User mới"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ChangePasswordSerializer(serializers.Serializer):
    """Validate input đổi mật khẩu"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

class LinkResidentSerializer(serializers.Serializer):
    """Validate input mapping cư dân"""
    cu_dan_id = serializers.IntegerField(required=True)


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'target_type', 'target_id', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']