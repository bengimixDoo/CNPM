from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView
)
from drf_spectacular.utils import extend_schema, extend_schema_view
from .views import UserViewSet, MyTokenObtainPairView, NotificationViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    # Auth API (Theo Image 2)
    path('auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'), # Login Custom
    path('auth/token/refresh/', extend_schema_view(
        post=extend_schema(tags=['Auth'])
    )(TokenRefreshView).as_view(), name='token_refresh'),
    path('auth/logout/', extend_schema_view(
        post=extend_schema(tags=['Auth'])
    )(TokenBlacklistView).as_view(), name='token_blacklist'),

    # Users API
    path('', include(router.urls)),
]