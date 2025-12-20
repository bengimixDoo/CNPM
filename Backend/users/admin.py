# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    # 1. Hiển thị thêm cột Role và Cư dân ra danh sách ngoài
    list_display = ['username', 'role', 'cu_dan', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active']

    # 2. Cho phép sửa Role và Cư dân trong form chi tiết
    # (Thêm fieldsets tùy chỉnh vào form mặc định của Django)
    fieldsets = UserAdmin.fieldsets + (
        ('Thông tin bổ sung (Dự án CNPM)', {'fields': ('role', 'cu_dan')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'cu_dan')}),
    )