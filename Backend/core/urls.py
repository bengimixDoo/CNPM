"""
URL configuration for core project.
"""
from django.contrib import admin
from django.urls import path, include
from .views import DashboardManagerView, DashboardResidentView, NotificationSendView, AuditLogView

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

    # Cross-Cutting APIs
    path('api/v1/dashboard/manager', DashboardManagerView.as_view(), name='dashboard_manager'),
    path('api/v1/dashboard/resident', DashboardResidentView.as_view(), name='dashboard_resident'),
    path('api/v1/notifications/send', NotificationSendView.as_view(), name='notification_send'),
    path('api/v1/audit-logs/', AuditLogView.as_view(), name='audit_logs'),
]
