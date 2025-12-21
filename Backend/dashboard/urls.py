from django.urls import path
from .views import DashboardManagerView, DashboardResidentView, NotificationSendView, AuditLogView

urlpatterns = [
    path('v1/dashboard/manager', DashboardManagerView.as_view(), name='dashboard_manager'),
    path('v1/dashboard/resident', DashboardResidentView.as_view(), name='dashboard_resident'),
    path('v1/notifications/send', NotificationSendView.as_view(), name='notification_send'),
    path('v1/audit-logs/', AuditLogView.as_view(), name='audit_logs'),
]
