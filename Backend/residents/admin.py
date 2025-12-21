from django.contrib import admin
from .models import CanHo, CuDan, BienDongDanCu

@admin.register(CanHo)
class CanHoAdmin(admin.ModelAdmin):
    list_display = ('phong', 'toa_nha', 'tang', 'dien_tich', 'trang_thai')
    search_fields = ('phong', 'toa_nha', 'tang')
    list_filter = ('toa_nha', 'trang_thai')

@admin.register(CuDan)
class CuDanAdmin(admin.ModelAdmin):
    list_display = ('ho_ten', 'so_cccd', 'so_dien_thoai', 'can_ho_dang_o', 'trang_thai_cu_tru')
    search_fields = ('ho_ten', 'so_cccd', 'so_dien_thoai')
    list_filter = ('trang_thai_cu_tru', 'la_chu_ho')

@admin.register(BienDongDanCu)
class BienDongDanCuAdmin(admin.ModelAdmin):
    list_display = ('cu_dan', 'loai_bien_dong', 'ngay_thuc_hien')
    list_filter = ('loai_bien_dong', 'ngay_thuc_hien')
