"""
URL configuration for core project.
"""
from django.contrib import admin
from django.urls import path, include
urlpatterns = [
    path('admin/', admin.site.urls),

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
