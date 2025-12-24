from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PhuongTienViewSet,
    YeuCauViewSet,
    TinTucViewSet,
    DichVuViewSet,       # [QUAN TRỌNG] Phải import cái này
    ChiSoDienNuocViewSet # [QUAN TRỌNG] Phải import cái này
)

# Router cũ của bạn
vehicle_router = DefaultRouter()
vehicle_router.register(r'', PhuongTienViewSet, basename='vehicle')

request_router = DefaultRouter()
request_router.register(r'', YeuCauViewSet, basename='support-tickets')

news_router = DefaultRouter()
news_router.register(r'', TinTucViewSet, basename='news')

# [MỚI] Router Bảng giá (Quản lý sửa, Kế toán xem)
pricing_router = DefaultRouter()
pricing_router.register(r'', DichVuViewSet, basename='pricing')

# [MỚI] Router Chỉ số điện nước (Kế toán nhập)
utility_router = DefaultRouter()
utility_router.register(r'', ChiSoDienNuocViewSet, basename='utilities')

urlpatterns = [
    path('vehicles/', include(vehicle_router.urls)),
    path('support-tickets/', include(request_router.urls)),
    path('news/', include(news_router.urls)),

    # [MỚI] Đăng ký đường dẫn mới
    path('pricing/', include(pricing_router.urls)),   # api/services/pricing/
    path('utilities/', include(utility_router.urls)), # api/services/utilities/
]