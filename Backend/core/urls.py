from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

# Import routers của residents (Giữ nguyên phần cũ của bạn)
from residents.urls import resident_router, apartment_router, history_router

# [LƯU Ý] Không cần import vehicle_router, request_router... từ services nữa
# Vì chúng ta sẽ include toàn bộ file services.urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema')),

    # 1. Users & Auth
    path('api/', include('users.urls')),

    # 2. Residents (Giữ nguyên cấu trúc cũ bạn đang chạy)
    path('api/residents/', include(resident_router.urls)),
    path('api/apartments/', include(apartment_router.urls)),
    path('api/history/', include(history_router.urls)),

    # Finance App
    path('api/', include('finance.urls')),

    # 3. Services [SỬA LẠI CHỖ NÀY]
    # Dùng include('services.urls') để gom tất cả (pricing, utilities, vehicles...)
    # vào đường dẫn /api/services/...
    path('api/services/', include('services.urls')),

    # Dashboard & Cross-Cutting APIs
    path('api/', include('dashboard.urls')),
]