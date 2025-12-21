from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView, # Cần thêm rest_framework_simplejwt.token_blacklist vào INSTALLED_APPS
)
from .views import (
    UserMeView,
    ChangePasswordView,
    UserListView,
    UserDetailView,
    LinkResidentView
)

"""
Định nghĩa các URL cho Users App.
"""
urlpatterns = [
    # Auth Endpoints (theo mô tả API)

    # /auth/token/ -> Login
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # /auth/token/refresh/ -> Refresh Token
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # /auth/logout/ -> Logout (Blacklist Token)
    # Lưu ý: Client cần gửi Refresh token để blacklist
    path('auth/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),

    # User Info & Actions
    path('users/me/', UserMeView.as_view(), name='user_me'),
    path('users/change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # User Management (Admin)
    path('users/', UserListView.as_view(), name='user_list_create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    path('users/<int:pk>/link-resident/', LinkResidentView.as_view(), name='link_resident'),
]
