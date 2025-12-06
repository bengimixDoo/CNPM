from django.db import models

# Data model 
class HoKhau(models.Model):
    mahokhau = models.CharField(db_column='mahokhau', primary_key=True, max_length=10)
    diachi = models.CharField(db_column='diachi', max_length=30)
    ngaylap = models.DateField(db_column='ngaylap', null=True)
    ngaychuyendi = models.DateField(db_column='ngaychuyendi', null=True)
    lydochuyendi = models.CharField(db_column='lydochuyendi', max_length=255, null=True)
    dientichho = models.FloatField(db_column='dientichho', null=True)
    soxemay = models.IntegerField(db_column='soxemay', null=True)
    sooto = models.IntegerField(db_column='sooto', null=True)
    soxedap = models.IntegerField(db_column='soxedap', null=True)
    
    def __str__(self):
        return f"HoKhau {self.mahokhau} - {self.diachi}"

    class Meta:
        db_table = 'hokhau'
        managed = False
	
class NhanKhau(models.Model):
    mahokhau = models.CharField(db_column='mahokhau', max_length=10)
    socccd = models.CharField(db_column='socccd', primary_key=True, max_length=15)
    hoten = models.CharField(db_column='hoten', max_length=50)
    tuoi = models.IntegerField(db_column='tuoi', null=True)
    gioitinh = models.CharField(db_column='gioitinh', max_length=10, null=True)
    sodt = models.CharField(db_column='sodt', max_length=15, null=True)
    quanhe = models.CharField(db_column='quanhe', max_length=20, null=True)
    tamvang = models.IntegerField(db_column='tamvang', null=True)
    tamtru = models.IntegerField(db_column='tamtru', null=True)
    
    class Meta:
        db_table = 'nhankhau'


# ---- Additional models mapped from your SQL schema ----


# class Users(models.Model):
#     username = models.CharField(db_column='username', primary_key=True, max_length=30)
#     password = models.CharField(db_column='password', max_length=100)
#     hoten = models.CharField(db_column='hoten', max_length=100)
#     email = models.CharField(db_column='email', unique=True, max_length=100)
#     sodt = models.CharField(db_column='sodt', max_length=20, null=True)
#     diachi = models.CharField(db_column='diachi', max_length=255, null=True)
#     tuoi = models.IntegerField(db_column='tuoi', null=True)

#     class Meta:
#         db_table = 'users'
#         managed = False


class PhiSinhHoat(models.Model):
    ho_khau = models.OneToOneField(HoKhau, db_column='mahokhau', primary_key=True, on_delete=models.CASCADE)
    nam = models.IntegerField(db_column='nam')
    thang1 = models.FloatField(db_column='thang1', default=0)
    thang2 = models.FloatField(db_column='thang2', default=0)
    thang3 = models.FloatField(db_column='thang3', default=0)
    thang4 = models.FloatField(db_column='thang4', default=0)
    thang5 = models.FloatField(db_column='thang5', default=0)
    thang6 = models.FloatField(db_column='thang6', default=0)
    thang7 = models.FloatField(db_column='thang7', default=0)
    thang8 = models.FloatField(db_column='thang8', default=0)
    thang9 = models.FloatField(db_column='thang9', default=0)
    thang10 = models.FloatField(db_column='thang10', default=0)
    thang11 = models.FloatField(db_column='thang11', default=0)
    thang12 = models.FloatField(db_column='thang12', default=0)

    class Meta:
        db_table = 'phisinhhoat'
        managed = False


class PhiGuiXe(models.Model):
    ho_khau = models.OneToOneField(HoKhau, db_column='mahokhau', primary_key=True, on_delete=models.CASCADE)
    gia_xemay = models.FloatField(db_column='giaxemay', default=0)
    gia_oto = models.FloatField(db_column='giaoto', default=0)
    gia_xedap = models.FloatField(db_column='giaxedap', default=0)
    tien_nop_moi_thang = models.FloatField(db_column='tiennopmoithang', default=0)
    nam = models.IntegerField(db_column='nam')
    thang1 = models.FloatField(db_column='thang1', default=0)
    thang2 = models.FloatField(db_column='thang2', default=0)
    thang3 = models.FloatField(db_column='thang3', default=0)
    thang4 = models.FloatField(db_column='thang4', default=0)
    thang5 = models.FloatField(db_column='thang5', default=0)
    thang6 = models.FloatField(db_column='thang6', default=0)
    thang7 = models.FloatField(db_column='thang7', default=0)
    thang8 = models.FloatField(db_column='thang8', default=0)
    thang9 = models.FloatField(db_column='thang9', default=0)
    thang10 = models.FloatField(db_column='thang10', default=0)
    thang11 = models.FloatField(db_column='thang11', default=0)
    thang12 = models.FloatField(db_column='thang12', default=0)

    class Meta:
        db_table = 'phiguixe'
        managed = False


class PhiDichVu(models.Model):
    ho_khau = models.OneToOneField(HoKhau, db_column='mahokhau', primary_key=True, on_delete=models.CASCADE)
    nam = models.IntegerField(db_column='nam')
    giaphi = models.FloatField(db_column='giaphi', default=0)
    tien_nop_moi_thang = models.FloatField(db_column='tiennopmoithang', default=0)
    thang1 = models.FloatField(db_column='thang1', default=0)
    thang2 = models.FloatField(db_column='thang2', default=0)
    thang3 = models.FloatField(db_column='thang3', default=0)
    thang4 = models.FloatField(db_column='thang4', default=0)
    thang5 = models.FloatField(db_column='thang5', default=0)
    thang6 = models.FloatField(db_column='thang6', default=0)
    thang7 = models.FloatField(db_column='thang7', default=0)
    thang8 = models.FloatField(db_column='thang8', default=0)
    thang9 = models.FloatField(db_column='thang9', default=0)
    thang10 = models.FloatField(db_column='thang10', default=0)
    thang11 = models.FloatField(db_column='thang11', default=0)
    thang12 = models.FloatField(db_column='thang12', default=0)

    class Meta:
        db_table = 'phidichvu'
        managed = False


class ThanhToan(models.Model):
    ho_khau = models.OneToOneField(HoKhau, db_column='mahokhau', primary_key=True, on_delete=models.CASCADE)
    so_tien_thanh_toan = models.FloatField(db_column='sotienthanhtoan')
    ngay_thanh_toan = models.DateTimeField(db_column='ngaythanhtoan')

    class Meta:
        db_table = 'thanhtoan'
        managed = False


class CapNhatSinhHoat(models.Model):
    ho_khau = models.OneToOneField(HoKhau, db_column='mahokhau', primary_key=True, on_delete=models.CASCADE)
    tien_dien = models.FloatField(db_column='tiendien', default=0)
    tien_nuoc = models.FloatField(db_column='tiennuoc', default=0)
    tien_internet = models.FloatField(db_column='tieninternet', default=0)
    ngay_cap_nhat = models.DateTimeField(db_column='ngaycapnhat')

    class Meta:
        db_table = 'capnhatsinhhoat'
        managed = False


class TamTru(models.Model):
    socccd = models.CharField(db_column='socccd', primary_key=True, max_length=15)
    ly_do = models.CharField(db_column='lydo', max_length=100, null=True)
    tu_ngay = models.DateField(db_column='tungay')
    den_ngay = models.DateField(db_column='denngay', null=True)

    class Meta:
        db_table = 'tamtru'
        managed = False


class TamVang(models.Model):
    socccd = models.CharField(db_column='socccd', primary_key=True, max_length=15)
    noi_tam_tru = models.CharField(db_column='noitamtru', max_length=500, null=True)
    tu_ngay = models.DateField(db_column='tungay')
    den_ngay = models.DateField(db_column='denngay', null=True)

    class Meta:
        db_table = 'tamvang'
        managed = False


class PhiQuanLy(models.Model):
    ho_khau = models.OneToOneField(HoKhau, db_column='mahokhau', primary_key=True, on_delete=models.CASCADE)
    giaphi = models.FloatField(db_column='giaphi', default=0)
    tien_nop_moi_thang = models.FloatField(db_column='tiennopmoithang', default=0)
    nam = models.IntegerField(db_column='nam')
    thang1 = models.FloatField(db_column='thang1', default=0)
    thang2 = models.FloatField(db_column='thang2', default=0)
    thang3 = models.FloatField(db_column='thang3', default=0)
    thang4 = models.FloatField(db_column='thang4', default=0)
    thang5 = models.FloatField(db_column='thang5', default=0)
    thang6 = models.FloatField(db_column='thang6', default=0)
    thang7 = models.FloatField(db_column='thang7', default=0)
    thang8 = models.FloatField(db_column='thang8', default=0)
    thang9 = models.FloatField(db_column='thang9', default=0)
    thang10 = models.FloatField(db_column='thang10', default=0)
    thang11 = models.FloatField(db_column='thang11', default=0)
    thang12 = models.FloatField(db_column='thang12', default=0)

    class Meta:
        db_table = 'phiquanly'
        managed = False


class PhiDongGop(models.Model):
    # NOTE: original SQL used composite PK (MaHoKhau, TenPhi).
    # For ORM convenience we treat TenPhi as the primary key here (assumption: TenPhi unique),
    # adjust if your DB uses a different constraint.
    ten_phi = models.CharField(db_column='tenphi', primary_key=True, max_length=30)
    mahokhau = models.CharField(db_column='mahokhau', max_length=10, null=True)
    sotien = models.FloatField(db_column='sotien', default=0)
    ngay_dong_gop = models.DateTimeField(db_column='ngaydonggop')

    class Meta:
        db_table = 'phidonggop'
        managed = False


class DSChiPhiDongGop(models.Model):
    ten_phi = models.CharField(db_column='tenphi', primary_key=True, max_length=30)
    so_tien_goi_y = models.FloatField(db_column='sotiengoiy', default=0)

    class Meta:
        db_table = 'dschiphidonggop'
        managed = False
    
    