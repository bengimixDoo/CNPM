from rest_framework import serializers
from django.contrib.auth import get_user_model
from residents.models import CuDan

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer cho đối tượng User.
    Chuyển đổi thông tin User sang JSON và ngược lại.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'cu_dan', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        """
        Tạo mới User (được băm mật khẩu).
        """
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer dùng cho việc đổi mật khẩu.
    Yêu cầu mật khẩu cũ và mật khẩu mới.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class LinkResidentSerializer(serializers.Serializer):
    """
    Serializer để liên kết tài khoản User với hồ sơ Cư dân (CuDan).
    """
    cu_dan_id = serializers.IntegerField(required=True)

    def validate_cu_dan_id(self, value):
        """
        Kiểm tra xem Cư dân có tồn tại không.
        """
        if not CuDan.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Cư dân với ID này không tồn tại.")
        return value
