from django.db import models

from CapNhatHoKhau.models import HoKhau

class NhanKhau(models.Model):

    # Create your models here.
    GIOITINH_CHOICES = (
        ('NAM', 'Nam'),
        ('NU', 'Nữ'),
        ('KXD', 'Không xác định'),
    )
    # Foreign Key & một phần của Primary Key kép
    MaHoKhau = models.ForeignKey(
        HoKhau, 
        on_delete=models.CASCADE,  # Xóa NhanKhau khi HoKhau bị xóa
        db_column='MaHoKhau',      # Đảm bảo tên cột trong DB là 'MaHoKhau'
    )
    
    # Một phần còn lại của Primary Key kép
    SoCCCD = models.CharField(max_length=15)
    
    HoTen = models.CharField(max_length=30)
    Tuoi = models.IntegerField(null=True, blank=True)
    GioiTinh = models.CharField(
        max_length=5, 
        choices=GIOITINH_CHOICES, # Gán danh sách lựa chọn
        default='NAM',           # Đặt giá trị mặc định phải khớp với key ('NAM')
    )
    SoDT = models.CharField(max_length=10, null=True, blank=True)
    QuanHe = models.CharField(max_length=30, null=True, blank=True)
    
    # Dùng BooleanField (True/False) thay cho INT(11) (0/1) trong Django 
    # để dễ quản lý trạng thái, nhưng tôi vẫn dùng IntegerField để sát với ảnh nhất.
    TamVang = models.IntegerField(default=0)
    TamTru = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "Nhân Khẩu"
        # Khai báo Primary Key kép (Composite Primary Key)
        unique_together = (('MaHoKhau', 'SoCCCD'),) 
        
    def __str__(self):
        return f"CCCD: {self.SoCCCD} - Name: {self.HoTen} ({self.MaHoKhau})"