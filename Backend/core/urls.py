from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
# Import routers của residents (Giữ nguyên phần cũ của bạn)
from residents.urls import resident_router, apartment_router, history_router

# [LƯU Ý] Không cần import vehicle_router, request_router... từ services nữa
# Vì chúng ta sẽ include toàn bộ file services.urls

urlpatterns = [
    path('admin/', admin.site.urls),

    # 1. Users & Auth
    path('api/users/', include('users.urls')),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 2. Residents (Giữ nguyên cấu trúc cũ bạn đang chạy)
    path('api/residents/', include(resident_router.urls)),
    path('api/apartments/', include(apartment_router.urls)),
    path('api/history/', include(history_router.urls)),

    # 3. Services [SỬA LẠI CHỖ NÀY]
    # Dùng include('services.urls') để gom tất cả (pricing, utilities, vehicles...)
    # vào đường dẫn /api/services/...
    path('api/services/', include('services.urls')),
]