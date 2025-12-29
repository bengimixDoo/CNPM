from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FeeCategoryViewSet, UtilityReadingViewSet, InvoiceViewSet, RevenueStatsView,
    DotDongGopViewSet, DongGopViewSet, MonthlyExpenseViewSet
)

router = DefaultRouter()
router.register(r'fees', FeeCategoryViewSet, basename='fees')
router.register(r'readings', UtilityReadingViewSet, basename='readings')
router.register(r'invoices', InvoiceViewSet, basename='invoices')
router.register(r'revenue-stats', RevenueStatsView, basename='revenue-stats')
router.register(r'fundraising-drives', DotDongGopViewSet, basename='fundraising-drives')
router.register(r'donations', DongGopViewSet, basename='donations')
router.register(r'monthly-expenses', MonthlyExpenseViewSet, basename='monthly-expenses')

urlpatterns = [
    path('', include(router.urls)),
]