from django.db import models

class DanhMucPhi(models.Model):
    ma_loai_phi = models.AutoField(primary_key=True)
    ten_loai_phi = models.CharField(max_length=100)
    dong_gia_hien_tai = models.DecimalField(max_digits=10, decimal_places=2)
    don_vi_tinh = models.CharField(max_length=50) # m3, kwh, thang...

    def __str__(self):
        return self.ten_loai_phi

class HoaDon(models.Model):
    ma_hoa_don = models.AutoField(primary_key=True)
    can_ho = models.ForeignKey('residents.CanHo', on_delete=models.CASCADE, related_name='hoa_don')
    thang = models.IntegerField()
    nam = models.IntegerField()
    tong_tien = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    trang_thai = models.IntegerField(default=0) # 0: Chua thanh toan, 1: Da thanh toan
    ngay_thanh_toan = models.DateTimeField(null=True, blank=True)
    ngay_tao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Hoa don {self.thang}/{self.nam} - {self.can_ho}"

class ChiTietHoaDon(models.Model):
    ma_chi_tiet = models.AutoField(primary_key=True)
    hoa_don = models.ForeignKey(HoaDon, on_delete=models.CASCADE, related_name='chi_tiet')
    loai_phi = models.ForeignKey(DanhMucPhi, on_delete=models.PROTECT)
    ten_phi_snapshot = models.CharField(max_length=100) # Snapshot name at time of creation
    so_luong = models.IntegerField()
    dong_gia_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    thanh_tien = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.hoa_don} - {self.loai_phi}"