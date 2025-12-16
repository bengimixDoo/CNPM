from django.db import models

class CanHo(models.Model):
    TRANG_THAI = (('TRONG', 'Trống'), ('DA_BAN', 'Đã Bán'), ('CHO_THUE', 'Cho Thuê'))
    ma_hien_thi = models.CharField(max_length=20, unique=True)
    tang = models.IntegerField()
    toa_nha = models.CharField(max_length=50)
    dien_tich = models.FloatField()
    trang_thai = models.CharField(max_length=20, choices=TRANG_THAI, default='TRONG')
    # ma_chu_so_huu link tới CuDan nhưng để string để tránh lỗi import vòng
    ma_chu_so_huu = models.ForeignKey('CuDan', on_delete=models.SET_NULL, null=True, related_name='so_huu_can_ho')

    def __str__(self):
        return self.ma_hien_thi

class CuDan(models.Model):
    TRANG_THAI_CU_TRU = (('THUONG_TRU', 'Thường Trú'), ('TAM_TRU', 'Tạm Trú'))
    ho_ten = models.CharField(max_length=100)
    ngay_sinh = models.DateField()
    so_cccd = models.CharField(max_length=20, unique=True)
    so_dien_thoai = models.CharField(max_length=15)
    email = models.EmailField(null=True, blank=True)
    ma_can_ho_dang_o = models.ForeignKey(CanHo, on_delete=models.SET_NULL, null=True, related_name='cu_dan_o')
    la_chu_ho = models.BooleanField(default=False)
    trang_thai_cu_tru = models.CharField(max_length=20, choices=TRANG_THAI_CU_TRU, default='TAM_TRU')

    def __str__(self):
        return f"{self.ho_ten} - {self.so_cccd}"

class BienDongDanCu(models.Model):
    ma_cu_dan = models.ForeignKey(CuDan, on_delete=models.CASCADE)
    loai_bien_dong = models.CharField(max_length=50) # NhapKhau, ChuyenDi
    ngay_thuc_hien = models.DateField(auto_now_add=True)
    ghi_chu = models.TextField(null=True, blank=True)