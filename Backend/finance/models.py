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

class DotDongGop(models.Model):
    ma_dot = models.AutoField(primary_key=True)
    ten_dot = models.CharField(max_length=200)
    ngay_bat_dau = models.DateField()
    ngay_ket_thuc = models.DateField()
    mo_ta = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.ten_dot

class DongGop(models.Model):
    HINH_THUC_CHOICES = [
        ('TM', 'Tiền mặt'),
        ('CK', 'Chuyển khoản'),
    ]
    
    ma_dong_gop = models.AutoField(primary_key=True)
    dot_dong_gop = models.ForeignKey(DotDongGop, on_delete=models.CASCADE, related_name='danh_sach_dong_gop')
    can_ho = models.ForeignKey('residents.CanHo', on_delete=models.CASCADE, related_name='lich_su_dong_gop')
    so_tien = models.DecimalField(max_digits=12, decimal_places=2)
    ngay_dong = models.DateTimeField(auto_now_add=True)
    hinh_thuc = models.CharField(max_length=2, choices=HINH_THUC_CHOICES, default='TM')
    
    TRANG_THAI_CHOICES = [
        ('CHO_XAC_NHAN', 'Chờ xác nhận'),
        ('DA_DONG_GOP', 'Đã đóng góp'),
        ('TU_CHOI', 'Từ chối'),
    ]
    trang_thai = models.CharField(max_length=20, choices=TRANG_THAI_CHOICES, default='CHO_XAC_NHAN')
    
    def __str__(self):
        return f"{self.can_ho} - {self.dot_dong_gop} - {self.so_tien}"