from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CanHoViewSet, CuDanViewSet, BienDongDanCuViewSet,
    CanHoHistoryView, CuDanHistoryView, BienDongDanCuHistoryView
)

# ----------------------------------------------------------------
# 1. KHỞI TẠO CÁC ROUTER RIÊNG BIỆT
# (Để core/urls.py có thể import từng cái nếu cần)
# ----------------------------------------------------------------

# Router cho Cư Dân
resident_router = DefaultRouter()
resident_router.register(r'', CuDanViewSet, basename='residents')

# Router cho Căn Hộ
apartment_router = DefaultRouter()
apartment_router.register(r'', CanHoViewSet, basename='apartments')

# Router cho Biến Động Dân Cư (History chung)
history_router = DefaultRouter()
history_router.register(r'', BienDongDanCuViewSet, basename='history')

# ----------------------------------------------------------------
# 2. ĐỊNH NGHĨA URL PATTERNS
# ----------------------------------------------------------------
urlpatterns = [
    # --- A. Các API từ Router (CRUD chính) ---

    # URL: /api/.../residents/ (Danh sách cư dân)
    path('residents/', include(resident_router.urls)),

    # URL: /api/.../apartments/ (Danh sách căn hộ)
    path('apartments/', include(apartment_router.urls)),

    # URL: /api/.../history/ (Danh sách biến động)
    path('history/', include(history_router.urls)),

    # --- B. Các API Xem Log Lịch Sử (Generic Views thủ công) ---
    # Những view này không thuộc Router nên phải khai báo path riêng

    # Xem lịch sử sửa đổi của 1 Căn hộ
    # URL: /api/.../apartments/CH101/log/
    path('apartments/<str:ma_can_ho>/log/', CanHoHistoryView.as_view(), name='canho-log'),

    # Xem lịch sử sửa đổi của 1 Cư dân
    # URL: /api/.../residents/CD001/log/
    path('residents/<str:ma_cu_dan>/log/', CuDanHistoryView.as_view(), name='cudan-log'),

    # Xem chi tiết lịch sử 1 lần biến động
    # URL: /api/.../history/1/log/
    path('history/<int:ma_bien_dong>/log/', BienDongDanCuHistoryView.as_view(), name='biendong-log'),
]