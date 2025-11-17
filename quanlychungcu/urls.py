from django.contrib import admin
from django.urls import path, include

# Import view Token tùy chỉnh
from users.views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # === SỬA LỖI Ở ĐÂY ===
    # Thay thế 'api/token/' bằng đường dẫn mà FE React đang gọi

    path('api/v1/auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # (Chúng ta cũng đổi 'refresh' cho đồng bộ)
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # (Chúng ta sẽ bật lại 'api.urls' sau khi login thành công)
    # path('api/', include('api.urls')),
]