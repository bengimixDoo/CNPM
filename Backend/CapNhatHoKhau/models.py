from django.db import models
from datetime import date

# Create your models here.

class HoKhau(models.Model):
    # Khóa Chính (Primary Key): Django tự động tạo một trường 'id' IntegerField làm PK. 
    # Nếu bạn muốn sử dụng MaHoKhau làm PK, bạn cần thêm primary_key=True.
    MaHoKhau = models.CharField(max_length=10, primary_key=True)
    
    DiaChi = models.CharField(max_length=30)
    NgayLap = models.DateField(default=date.today)
    NgayChuyenDi = models.DateField(null=True, blank=True)
    LyDoChuyenDi = models.CharField(max_length=255, null=True, blank=True)
    
    # Kiểu dữ liệu Float trong DB thường dùng DecimalField trong Django cho độ chính xác cao hơn, 
    # nhưng tôi dùng FloatField theo yêu cầu "FLOAT" trong ảnh
    DienTichHo = models.FloatField(default=0.0) 
    
    SoXeMay = models.IntegerField(default=0)
    SoOto = models.IntegerField(default=0)
    SoXeDap = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "Hộ Khẩu"
        
    def __str__(self):
        return f"Mã HK: {self.MaHoKhau} - Địa chỉ: {self.DiaChi}"



