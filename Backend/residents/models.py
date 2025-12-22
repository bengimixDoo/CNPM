from django.db import models
from simple_history.models import HistoricalRecords
from datetime import date


class CanHo(models.Model):
    ma_can_ho = models.AutoField(primary_key=True)
    # ma_hien_thi = models.CharField(max_length=20, unique=True) # e.g. A101
    phong = models.CharField(max_length=20)  # SoPhong
    tang = models.IntegerField()
    toa_nha = models.CharField(max_length=50) # Block A, B...
    dien_tich = models.FloatField(default=500.0)
    chu_so_huu = models.ForeignKey('CuDan', on_delete=models.SET_NULL, null=True, blank=True, related_name='so_huu_can_ho')
    TRANG_THAI_CHOICES = (
        ('E', "Trống"),
        ('S', "Đã bán"),
        ('H', "Đang thuê"),
    )
    trang_thai = models.CharField(max_length=50, choices=TRANG_THAI_CHOICES, default='E') # Trong, DaBan, ChoThue...

    history = HistoricalRecords(user_model='users.User')


    class Meta:
        db_table = 'CanHo' 
        ordering = ['ma_can_ho'] # Ví dụ sắp xếp
        unique_together = ('phong', 'tang', 'toa_nha')  # Đảm bảo không có căn hộ trùng lặp

    def __str__(self):
        return f"Phòng: {self.phong} - Tầng: {self.tang} - Tòa: {self.toa_nha}"

class CuDan(models.Model):
    ma_cu_dan = models.AutoField(primary_key=True)
    ho_ten = models.CharField(max_length=100)
    GIOI_TINH_CHOICES = (
        ('M', 'Nam'),
        ('F', 'Nữ'),
    )
    gioi_tinh = models.CharField(max_length=10, choices=GIOI_TINH_CHOICES)
    ngay_sinh = models.DateField()
    so_cccd = models.CharField(max_length=20, unique=True)
    so_dien_thoai = models.CharField(max_length=15)
    can_ho_dang_o = models.ForeignKey(CanHo, on_delete=models.SET_NULL, null=True, blank=True, related_name='cu_dan_hien_tai')
    la_chu_ho = models.BooleanField(default=False)

    TRANG_THAI_CHOICES = (
        ('TT', 'Tạm Trú'),
        ('TH', 'Thường Trú'),
        ('TV', 'Tạm Vắng'),
        ('OUT', 'Đã Chuyển Đi'),
    )
    trang_thai_cu_tru = models.CharField(max_length=50, choices=TRANG_THAI_CHOICES, default='TT') # ThuongTru, TamTru, TamVang

    history = HistoricalRecords(user_model='users.User')

    class Meta:
        db_table = 'CuDan'
        ordering = ['ma_cu_dan']

    def __str__(self):
        return f"{self.ho_ten} - {self.so_cccd}"

class BienDongDanCu(models.Model):
    ma_bien_dong = models.AutoField(primary_key=True)
    cu_dan = models.ForeignKey(CuDan, on_delete=models.CASCADE, related_name='bien_dong_cu_dan')
    can_ho = models.ForeignKey(CanHo, on_delete=models.CASCADE, related_name='bien_dong_can_ho')
    TRANG_THAI_CHOICES = (
        ('TH', 'Thường trú'),
        ('TT', 'Tạm trú'),
        ('TV', 'Tạm Vắng'),
        ('OUT', 'Chuyển Đi'),
    )
    loai_bien_dong = models.CharField(max_length=50, choices=TRANG_THAI_CHOICES) # ChuyenDen, ChuyenDi, TamVang...
    ngay_thuc_hien = models.DateField(default=date.today)

    history = HistoricalRecords(user_model='users.User')
    
    class Meta:
        db_table = 'BienDongDanCu'
        # Ràng buộc: Một cư dân không thể có hai biến động cùng loại chồng chéo về thời gian
        # Tuy nhiên, điều này phức tạp nên không đặt ở đây, chỉ là gợi ý.
        ordering = ['ma_bien_dong'] # Sắp xếp theo ngày gần nhất

    def __str__(self):
        return f"{self.cu_dan.ho_ten} - {self.loai_bien_dong}"
