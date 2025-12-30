from django.contrib import admin
from .models import DanhMucPhi, HoaDon, ChiTietHoaDon, DotDongGop, DongGop

@admin.register(DanhMucPhi)
class DanhMucPhiAdmin(admin.ModelAdmin):
    list_display = ('ten_phi', 'don_gia', 'loai_phi', 'don_vi_tinh')
    search_fields = ('ten_phi', 'loai_phi')

class ChiTietHoaDonInline(admin.TabularInline):
    model = ChiTietHoaDon
    extra = 0
    readonly_fields = ('thanh_tien',)

@admin.register(HoaDon)
class HoaDonAdmin(admin.ModelAdmin):
    list_display = ('ma_hoa_don', 'can_ho', 'thang', 'nam', 'tong_tien', 'trang_thai', 'ngay_tao')
    list_filter = ('trang_thai', 'thang', 'nam')
    search_fields = ('can_ho__ma_can_ho',)
    inlines = [ChiTietHoaDonInline]

@admin.register(ChiTietHoaDon)
class ChiTietHoaDonAdmin(admin.ModelAdmin):
    list_display = ('hoa_don', 'loai_phi', 'so_luong', 'thanh_tien')
    list_filter = ('loai_phi',)

@admin.register(DotDongGop)
class DotDongGopAdmin(admin.ModelAdmin):
    list_display = ('ten_dot', 'ngay_bat_dau', 'ngay_ket_thuc')
    search_fields = ('ten_dot',)

@admin.register(DongGop)
class DongGopAdmin(admin.ModelAdmin):
    list_display = ('can_ho', 'dot_dong_gop', 'so_tien', 'ngay_dong', 'hinh_thuc')
    list_filter = ('dot_dong_gop', 'hinh_thuc', 'ngay_dong')
    search_fields = ('can_ho__ma_can_ho', 'dot_dong_gop__ten_dot')