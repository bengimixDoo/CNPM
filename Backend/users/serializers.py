# Mở file: users/serializers.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Thêm thông tin tùy chỉnh vào token (JSON)
        token['username'] = user.username
        #token['hoten'] = user.hoten
        return token