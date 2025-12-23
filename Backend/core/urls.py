from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from residents.urls import resident_router, apartment_router, history_router
from services.urls import vehicle_router, request_router, news_router
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(title="API", default_version='v1'),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),

    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # path('api/users/', include('users.urls')),
    path('api/residents/', include(resident_router.urls)),
    path('api/apartments/', include(apartment_router.urls)),
    path('api/history/', include(history_router.urls)),

    path('api/vehicles/', include(vehicle_router.urls)),
    path('api/support-tickets/', include(request_router.urls)),
    path('api/news/', include(news_router.urls)),


    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),

    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
         name='schema-redoc'),
]
