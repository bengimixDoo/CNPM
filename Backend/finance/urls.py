from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FeeCategoryViewSet, InvoiceViewSet, RevenueStatsView, UtilityReadingViewSet

router = DefaultRouter()
router.register(r'fee-categories', FeeCategoryViewSet, basename='fee-category')
router.register(r'utility-readings', UtilityReadingViewSet, basename='utility-reading')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'analytics', RevenueStatsView, basename='analytics')

urlpatterns = [
    path('', include(router.urls)),
]
