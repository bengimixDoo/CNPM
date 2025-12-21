from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CanHoViewSet, CuDanViewSet

router = DefaultRouter()
router.register(r'apartments', CanHoViewSet, basename='apartment')
router.register(r'residents', CuDanViewSet, basename='resident')

urlpatterns = [
    path('', include(router.urls)),
]
