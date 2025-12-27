from django.contrib import admin
from .models import DanhMucPhi, HoaDon, ChiTietHoaDon

@admin.register(DanhMucPhi)
class DanhMucPhiAdmin(admin.ModelAdmin):
    list_display = ('ten_loai_phi', 'dong_gia_hien_tai', 'don_vi_tinh')

class ChiTietHoaDonInline(admin.TabularInline):
    model = ChiTietHoaDon
    extra = 1

@admin.register(HoaDon)
class HoaDonAdmin(admin.ModelAdmin):
    list_display = ('ma_hoa_don', 'can_ho', 'thang', 'nam', 'tong_tien', 'trang_thai')
    list_filter = ('thang', 'nam', 'trang_thai')
    inlines = [ChiTietHoaDonInline]