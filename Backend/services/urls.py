from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UtilityReadingViewSet, VehicleViewSet, 
    SupportTicketViewSet, NewsViewSet
)

router = DefaultRouter()
router.register(r'utility-readings', UtilityReadingViewSet, basename='utility-reading')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'support-tickets', SupportTicketViewSet, basename='support-ticket')
router.register(r'news', NewsViewSet, basename='news')

urlpatterns = [
    path('', include(router.urls)),
]
