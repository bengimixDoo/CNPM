# Mở file: users/views.py

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

# @api_view(['POST'])
# def check_password(request):
#     """
#     API để frontend gửi username + password và kiểm tra.
#     """
#     username = request.data.get('username')
#     password = request.data.get('password')

#     # authenticate sẽ kiểm tra username + password
#     user = authenticate(username=username, password=password)

#     if user:
#         return Response({"valid": True, "message": "Password đúng"})
#     else:
#         return Response({"valid": False, "message": "Password sai"})
    
class MyTokenObtainPairView(TokenObtainPairView):
    """
    Sử dụng serializer tùy chỉnh của chúng ta
    """
    serializer_class = MyTokenObtainPairSerializer
    
