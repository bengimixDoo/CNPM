from django.db import models
from datetime import date
from django.core.exceptions import ValidationError
from simple_history.models import HistoricalRecords

class ChiSoDienNuoc(models.Model):
    ma_chi_so = models.AutoField(primary_key=True)
    can_ho = models.ForeignKey('residents.CanHo', on_delete=models.CASCADE, related_name='chi_so_dien_nuoc')
    LOAI_DICH_VU_CHOICES = [
        ('E', 'Điện'),
        ('W', 'Nước'),
    ]
    loai_dich_vu = models.CharField(max_length=20, choices=LOAI_DICH_VU_CHOICES) # Dien, Nuoc
    thang = models.IntegerField()
    nam = models.IntegerField()
    chi_so_cu = models.IntegerField()
    chi_so_moi = models.IntegerField()
    ngay_chot = models.DateField()

    history = HistoricalRecords(user_model='users.User')

    def __str__(self):
        return f"{self.get_loai_dich_vu_display()} - {self.can_ho} - {self.thang}/{self.nam}"

class TinTuc(models.Model):
    ma_tin = models.AutoField(primary_key=True)
    tieu_de = models.CharField(max_length=200)
    noi_dung = models.TextField()
    nguoi_dang = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    ngay_dang = models.DateTimeField(auto_now_add=True)

    history = HistoricalRecords(user_model='users.User')

    def __str__(self):
        return self.tieu_de

class YeuCau(models.Model):
    ma_yeu_cau = models.AutoField(primary_key=True)
    cu_dan = models.ForeignKey('residents.CuDan', on_delete=models.CASCADE, related_name='yeu_cau')
    tieu_de = models.CharField(max_length=200)
    noi_dung = models.TextField()
    TRANG_THAI_CHOICES = [
        ('W', 'Chờ Xử Lý'),
        ('P', 'Đang Xử Lý'),
        ('A', 'Đã Xử Lý'),
        ('C', 'Đã Hủy'),
    ]
    trang_thai = models.CharField(max_length=50, choices=TRANG_THAI_CHOICES, default='W') # ChoXuLy, DangXuLy, DaXuLy
    phan_hoi_bql = models.TextField(blank=True, null=True)
    ngay_gui = models.DateTimeField(auto_now_add=True)

    history = HistoricalRecords(user_model='users.User')

    def __str__(self):
        return self.tieu_de

class PhuongTien(models.Model):
    ma_xe = models.AutoField(primary_key=True)
    can_ho = models.ForeignKey('residents.CanHo', on_delete=models.CASCADE, related_name='phuong_tien')
    bien_so = models.CharField(max_length=20, unique=True, blank=True, null=True)
    LOAI_XE_CHOICES = [
        ('C', 'Ô tô'),
        ('M', 'Xe máy'),
        ('B', 'Xe đạp'),
        ('O', 'Khác'),
    ]
    loai_xe = models.CharField(max_length=50, choices=LOAI_XE_CHOICES) # Oto, Xemay...
    ngay_dang_ky = models.DateField(default=date.today)
    dang_hoat_dong = models.BooleanField(default=True)

    history = HistoricalRecords(user_model='users.User')


    def clean(self):
        super().clean()
        # Kiểm tra nếu là Ô tô (C) hoặc Xe máy (M) mà biển số để trống
        if self.loai_xe in ['C', 'M'] and not self.bien_so:
            raise ValidationError({
                'bien_so': f"Loại xe '{self.get_loai_xe_display()}' bắt buộc phải có biển số."
            })

    def save(self, *args, **kwargs):
        # Gọi full_clean để đảm bảo hàm clean() luôn được chạy 
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_loai_xe_display()} - {self.bien_so if self.bien_so else 'Không biển'} - {self.chu_so_huu.ho_ten}"
