# myapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HoKhauHistoryAPIView, HoKhauViewSet

# Tạo Router
router = DefaultRouter()

# Đăng ký ViewSet, tên cơ sở là 'hokhau'
router.register(r'hokhau', HoKhauViewSet) 

urlpatterns = [
    # Thêm tất cả các đường dẫn được tạo bởi Router
    path('', include(router.urls)),
    path('hokhau/history/<str:ma_ho_khau>/', 
         HoKhauHistoryAPIView.as_view(), 
         name='hokhauhistory'),
]