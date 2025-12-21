from django.db import models

class CanHo(models.Model):
    ma_can_ho = models.AutoField(primary_key=True)
    ma_hien_thi = models.CharField(max_length=20, unique=True) # e.g. A101
    tang = models.IntegerField()
    toa_nha = models.CharField(max_length=50) # Block A, B...
    dien_tich = models.FloatField()
    # chu_so_huu = models.ForeignKey('CuDan', on_delete=models.SET_NULL, null=True, blank=True, related_name='so_huu_can_ho')
    trang_thai = models.CharField(max_length=50, default='Trong') # Trong, DaBan, ChoThue...

    def __str__(self):
        return self.ma_hien_thi

class CuDan(models.Model):
    ma_cu_dan = models.AutoField(primary_key=True)
    ho_ten = models.CharField(max_length=100)
    ngay_sinh = models.DateField()
    so_cccd = models.CharField(max_length=20, unique=True)
    so_dien_thoai = models.CharField(max_length=15)
    can_ho_dang_o = models.ForeignKey(CanHo, on_delete=models.SET_NULL, null=True, blank=True, related_name='cu_dan_hien_tai')
    la_chu_ho = models.BooleanField(default=False)
    trang_thai_cu_tru = models.CharField(max_length=50, default='TamTru') # ThuongTru, TamTru, TamVang

    def __str__(self):
        return self.ho_ten

class BienDongDanCu(models.Model):
    ma_bien_dong = models.AutoField(primary_key=True)
    cu_dan = models.ForeignKey(CuDan, on_delete=models.CASCADE, related_name='bien_dong')
    can_ho = models.ForeignKey(CanHo, on_delete=models.SET_NULL, null=True, blank=True, related_name='lich_su_bien_dong')
    loai_bien_dong = models.CharField(max_length=50) # ChuyenDen, ChuyenDi, TamVang...
    ngay_thuc_hien = models.DateField()

    def __str__(self):
        return f"{self.cu_dan.ho_ten} - {self.loai_bien_dong}"
