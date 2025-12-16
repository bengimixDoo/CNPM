from django.db import models
from residents.models import CanHo

class DanhMucPhi(models.Model):
    ten_loai_phi = models.CharField(max_length=100) # Dien, Nuoc, QuanLy
    don_gia_hien_tai = models.DecimalField(max_digits=10, decimal_places=2)
    don_vi_tinh = models.CharField(max_length=20) # kwh, m3, thang

class ChiSoDienNuoc(models.Model):
    can_ho = models.ForeignKey(CanHo, on_delete=models.CASCADE)
    loai_dich_vu = models.CharField(max_length=20) # DIEN, NUOC
    thang = models.IntegerField()
    nam = models.IntegerField()
    chi_so_cu = models.IntegerField()
    chi_so_moi = models.IntegerField()
    ngay_chot = models.DateField()

    @property
    def so_tieu_thu(self):
        return self.chi_so_moi - self.chi_so_cu

class HoaDon(models.Model):
    can_ho = models.ForeignKey(CanHo, on_delete=models.CASCADE)
    thang = models.IntegerField()
    nam = models.IntegerField()
    tong_tien = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    trang_thai = models.IntegerField(default=0) # 0: Chua tra, 1: Da tra
    ngay_tao = models.DateTimeField(auto_now_add=True)
    ngay_thanh_toan = models.DateTimeField(null=True, blank=True)

class ChiTietHoaDon(models.Model):
    hoa_don = models.ForeignKey(HoaDon, on_delete=models.CASCADE, related_name='chi_tiet')
    danh_muc_phi = models.ForeignKey(DanhMucPhi, on_delete=models.SET_NULL, null=True)
    ten_phi_snapshot = models.CharField(max_length=100) # Snapshot tên
    so_luong = models.IntegerField()
    don_gia_snapshot = models.DecimalField(max_digits=10, decimal_places=2) # Snapshot giá
    thanh_tien = models.DecimalField(max_digits=12, decimal_places=2)