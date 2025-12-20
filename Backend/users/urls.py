from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView
)
from .views import UserViewSet, MyTokenObtainPairView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Auth API (Theo Image 2)
    path('auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'), # Login Custom
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),

    # Users API
    path('', include(router.urls)),
]