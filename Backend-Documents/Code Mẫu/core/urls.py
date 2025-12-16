from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Import Views
from users.views import UserViewSet
from residents.views import CanHoViewSet, CuDanViewSet
from finance.views import HoaDonViewSet
# ... import các viewset khác

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'apartments', CanHoViewSet)
router.register(r'residents', CuDanViewSet)
router.register(r'invoices', HoaDonViewSet)
# ... register tiếp services, meters...

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth Endpoints
    path('api/v1/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App Endpoints
    path('api/v1/', include(router.urls)),
]