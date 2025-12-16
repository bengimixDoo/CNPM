from django.db import models
from users.models import User
from residents.models import CuDan

class YeuCau(models.Model):
    TRANG_THAI = (('MOI', 'Mới'), ('DANG_XU_LY', 'Đang xử lý'), ('HOAN_THANH', 'Hoàn thành'))
    cu_dan = models.ForeignKey(CuDan, on_delete=models.CASCADE)
    tieu_de = models.CharField(max_length=200)
    noi_dung = models.TextField()
    trang_thai = models.CharField(max_length=20, choices=TRANG_THAI, default='MOI')
    phan_hoi_bql = models.TextField(null=True, blank=True)
    ngay_gui = models.DateTimeField(auto_now_add=True)

class TinTuc(models.Model):
    tieu_de = models.CharField(max_length=200)
    noi_dung = models.TextField()
    nguoi_dang = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    ngay_dang = models.DateTimeField(auto_now_add=True)