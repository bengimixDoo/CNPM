from django.contrib import admin
from .models import ChiSoDienNuoc, TinTuc, YeuCau, PhuongTien

@admin.register(ChiSoDienNuoc)
class ChiSoDienNuocAdmin(admin.ModelAdmin):
    list_display = ('can_ho', 'loai_dich_vu', 'thang', 'nam', 'chi_so_cu', 'chi_so_moi')
    list_filter = ('loai_dich_vu', 'thang', 'nam')

@admin.register(TinTuc)
class TinTucAdmin(admin.ModelAdmin):
    list_display = ('tieu_de', 'nguoi_dang', 'ngay_dang')
    search_fields = ('tieu_de',)

@admin.register(YeuCau)
class YeuCauAdmin(admin.ModelAdmin):
    list_display = ('tieu_de', 'cu_dan', 'trang_thai', 'ngay_gui')
    list_filter = ('trang_thai', 'ngay_gui')

@admin.register(PhuongTien)
class PhuongTienAdmin(admin.ModelAdmin):
    list_display = ('bien_so', 'can_ho', 'loai_xe')
    search_fields = ('bien_so',)
