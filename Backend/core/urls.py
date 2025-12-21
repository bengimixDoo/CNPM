"""
URL configuration for core project.
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema')),

    # Users App
    path('api/', include('users.urls')),
    
    # Residents App
    path('api/', include('residents.urls')),
    
    # Finance App
    path('api/', include('finance.urls')),
    
    # Services App
    path('api/', include('services.urls')),

    # Dashboard & Cross-Cutting APIs
    path('api/', include('dashboard.urls')),
]
