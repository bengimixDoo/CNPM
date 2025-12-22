from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from residents.urls import resident_router, apartment_router, history_router

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),

    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # path('api/users/', include('users.urls')),
    path('api/residents/', include(resident_router.urls)),
    path('api/apartments/', include(apartment_router.urls)),
    path('api/history/', include(history_router.urls)),
]
