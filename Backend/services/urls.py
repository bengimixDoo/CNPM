from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PhuongTienViewSet, YeuCauViewSet, TinTucViewSet

# Khai báo router
vehicle_router = DefaultRouter()
vehicle_router.register(r'', PhuongTienViewSet, basename='vehicle')

request_router = DefaultRouter()
request_router.register(r'', YeuCauViewSet, basename='support-tickets')

news_router = DefaultRouter()
news_router.register(r'', TinTucViewSet, basename='news')


urlpatterns = [
    path('vehicles/', include(vehicle_router.urls)),
    path('support-tickets/', include(request_router.urls)),
    path('news/', include(news_router.urls)),
]