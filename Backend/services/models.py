from django.db import models

class ChiSoDienNuoc(models.Model):
    ma_chi_so = models.AutoField(primary_key=True)
    can_ho = models.ForeignKey('residents.CanHo', on_delete=models.CASCADE, related_name='chi_so_dien_nuoc')
    loai_dich_vu = models.CharField(max_length=20) # Dien, Nuoc
    thang = models.IntegerField()
    nam = models.IntegerField()
    chi_so_cu = models.IntegerField()
    chi_so_moi = models.IntegerField()
    ngay_chot = models.DateField()

    def __str__(self):
        return f"{self.loai_dich_vu} - {self.can_ho} - {self.thang}/{self.nam}"

class TinTuc(models.Model):
    ma_tin = models.AutoField(primary_key=True)
    tieu_de = models.CharField(max_length=200)
    noi_dung = models.TextField()
    nguoi_dang = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    ngay_dang = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.tieu_de

class YeuCau(models.Model):
    ma_yeu_cau = models.AutoField(primary_key=True)
    cu_dan = models.ForeignKey('residents.CuDan', on_delete=models.CASCADE, related_name='yeu_cau')
    tieu_de = models.CharField(max_length=200)
    noi_dung = models.TextField()
    trang_thai = models.CharField(max_length=50, default='ChoXuLy') # ChoXuLy, DangXuLy, DaXuLy
    phan_hoi_bql = models.TextField(blank=True, null=True)
    ngay_gui = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.tieu_de

class PhuongTien(models.Model):
    ma_xe = models.AutoField(primary_key=True)
    can_ho = models.ForeignKey('residents.CanHo', on_delete=models.CASCADE, related_name='phuong_tien')
    bien_so = models.CharField(max_length=20, unique=True)
    loai_xe = models.CharField(max_length=50) # Oto, Xemay...

    def __str__(self):
        return self.bien_so
