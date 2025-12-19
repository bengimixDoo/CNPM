# myapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CanHoViewSet, CanHoHistoryAPIView, CuDanViewSet

# Tạo Router
router = DefaultRouter()

# Đăng ký ViewSet, tên cơ sở là 'hokhau'
router.register(r'canho', CanHoViewSet, basename='canho')
router.register(r'cudan', CuDanViewSet, basename='cudan')

urlpatterns = [
    # Thêm tất cả các đường dẫn được tạo bởi Router
    path('', include(router.urls)),
    path('canho/history/<str:ma_can_ho>/', 
         CanHoHistoryAPIView.as_view(), 
         name='canhohistory'),
]