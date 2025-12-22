from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CanHoViewSet, CuDanViewSet, BienDongDanCuViewSet
from .views import CanHoHistoryView, CuDanHistoryView, BienDongDanCuHistoryView

resident_router = DefaultRouter()
# Để r'' vì tiền tố 'residents/' sẽ được khai báo ở urlpatterns
resident_router.register(r'', CuDanViewSet, basename='residents')

# --- Router cho Căn hộ ---
apartment_router = DefaultRouter()
# Để r'' vì tiền tố 'apartments/' sẽ được khai báo ở urlpatterns
apartment_router.register(r'', CanHoViewSet, basename='apartments')
# router.register(r'biendong', BienDongDanCuViewSet, basename='biendong')

history_router = DefaultRouter()
history_router.register(r'', BienDongDanCuViewSet, basename='history')

urlpatterns = [
    # Gắn router cư dân vào miền /residents/
    path('residents/', include(resident_router.urls)),
    
    # Gắn router căn hộ vào miền /apartments/
    path('apartments/', include(apartment_router.urls)),
    # path('canho/history/<str:ma_can_ho>/', 
    #      CanHoHistoryView.as_view(), 
    #      name='canhohistory'),
    path('history/', include(history_router.urls)),
]