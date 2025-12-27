from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

# Import routers của residents (Giữ nguyên phần cũ của bạn)
from residents.urls import resident_router, apartment_router, history_router


urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Swagger / OpenAPI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema')),

    # API V1
    path('api/v1/', include([
        # 1. Users & Auth
        path('', include('users.urls')),
        
        # 2. Residents
        path('', include('residents.urls')),
        
        # 3. Finance
        path('', include('finance.urls')),
        
        # 4. Services
        path('', include('services.urls')),
    ])),
]