# Mở file: users/admin.py
# (Xóa hết code cũ và dán code này vào)

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# from .models import CustomUser

# @admin.register(CustomUser)
# class CustomUserAdmin(UserAdmin):
#     """
#     Tùy chỉnh hiển thị cho CustomUser.
#     (Đã XÓA 'hoten' và các trường cũ không tồn tại để đồng bộ)
#     """

#     # Thêm 'role' vào danh sách các trường khi tạo/sửa user
#     fieldsets = UserAdmin.fieldsets + (
#         ('Phân Quyền Tùy Chỉnh', {'fields': ('role',)}),
#     )

#     # Thêm 'role' vào các trường hiển thị trong danh sách
#     # (Đã XÓA 'hoten' khỏi đây)
#     list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'role')

#     # Thêm 'role' vào bộ lọc
#     list_filter = UserAdmin.list_filter + ('role',)

#     # Thêm 'role' vào các trường khi thêm user
#     add_fieldsets = UserAdmin.add_fieldsets + (
#         ('Phân Quyền Tùy Chỉnh', {'fields': ('role',)}),
#     )