from django.db import models
from simple_history.models import HistoricalRecords


class CanHo(models.Model):
    # MaCanHo: int [pk, note: "NHẬP TAY (Manual ID 101, 202...)"]
    # Mặc định, Django sẽ tự tạo một trường id tự tăng (auto-incrementing) làm PK.
    # Để sử dụng trường PK thủ công (manual PK) như yêu cầu "NHẬP TAY",
    # ta định nghĩa rõ trường này:
    MaCanHo = models.AutoField(
        primary_key=True,
        verbose_name="Mã Căn Hộ",
    )

    # SoPhong: varchar [unique]
    SoPhong = models.CharField(
        max_length=50,
        # unique=True,
        verbose_name="Số Phòng"
    )

    # Tang: int
    Tang = models.IntegerField(
        verbose_name="Tầng"
    )

    # ToaNha: varchar
    ToaNha = models.CharField(
        max_length=100,
        verbose_name="Tòa Nhà"
    )

    # DienTich: float
    # Ta sử dụng FloatField cho số thực.
    DienTich = models.FloatField(
        verbose_name="Diện Tích",
        default=500.0,
    )

    MaChuSoHuu = models.ForeignKey(
        # Trỏ đến Model 'CuDan'
        'CuDan', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='can_ho_so_huu',
        verbose_name="Chủ Sở Hữu",
    )

    # TrangThai: varchar
    # Thường nên dùng choices để giới hạn các giá trị có thể có (ví dụ: 'Đang Bán', 'Đã Bán', 'Đang Thuê').
    # Nếu không, dùng CharField bình thường.
    TRANG_THAI_CHOICES = (
        ('A', 'Trống'),
        ('B', 'Đã Bán'),
        ('C', 'Đang Thuê'),
    )
    TrangThai = models.CharField(
        max_length=10,
        choices=TRANG_THAI_CHOICES,
        verbose_name="Trạng Thái"
    )

    # NgayBanGiao: date
    NgayBanGiao = models.DateField(
        verbose_name="Ngày Bàn Giao",
        null=True,
        blank=True
    )

    history = HistoricalRecords()

    class Meta:
        # Tên bảng trong cơ sở dữ liệu nếu cần tùy chỉnh
        db_table = 'CanHo' 
        ordering = ['MaCanHo'] # Ví dụ sắp xếp
        unique_together = ('SoPhong', 'Tang', 'ToaNha')

    def __str__(self):
        return f"Phòng {self.SoPhong} - Tầng {self.Tang} - Tòa {self.ToaNha}"


class CuDan(models.Model):
    # MaCuDan: int [pk, increment, note: "TỰ TĂNG (Auto ID)"]
    MaCuDan = models.AutoField(
        primary_key=True,
        verbose_name="Mã Cư Dân",
    )

    # HoTen: varchar
    HoTen = models.CharField(
        max_length=200,
        verbose_name="Họ và Tên"
    )

    # NgaySinh: date
    NgaySinh = models.DateField(
        verbose_name="Ngày Sinh",
    )

    # SoCCCD: varchar
    SoCCCD = models.CharField(
        max_length=12,
        unique=True, # Giả sử số CCCD là duy nhất
        verbose_name="Số CCCD"
    )

    # SoDienThoai: varchar
    SoDienThoai = models.CharField(
        max_length=15,
        null=True, 
        blank=True, 
        verbose_name="Số Điện Thoại"
    )

    # Email: varchar
    Email = models.EmailField(
        max_length=254,
        null=True, 
        blank=True, 
        verbose_name="Email"
    )

    # MaCanHoDangO: int [note: "Nơi đang ở thực tế"]
    # Đây là Khóa Ngoại (Foreign Key) trỏ đến model CanHo.
    # Sử dụng 'CanHo' (dưới dạng chuỗi) nếu model CanHo nằm trong cùng tệp/ứng dụng.
    MaCanHoDangO = models.ForeignKey(
        'CanHo', 
        on_delete=models.CASCADE,
        related_name='chu_can_ho', # Tên ngược lại từ CanHo về CuDan
        verbose_name="Căn Hộ Đang Ở",
    )

    # QuanHeVoiChuHo: varchar
    QUAN_HE_CHOICES = (
        ('CH', 'Chủ Hộ'),
        ('VK', 'Vợ/Chồng'),
        ('CON', 'Con'),
        ('KHAC', 'Khác'),
    )
    QuanHeVoiChuHo = models.CharField(
        max_length=10,
        choices=QUAN_HE_CHOICES,
        default='KHAC',
        verbose_name="Quan Hệ Với Chủ Hộ"
    )

    # TrangThaiCuTru: varchar
    TRANG_THAI_CHOICES = (
        ('TT', 'Tạm Trú'),
        ('KT', 'Thường Trú'),
        # ('NK', 'Khác'),
    )
    TrangThaiCuTru = models.CharField(
        max_length=10,
        choices=TRANG_THAI_CHOICES,
        default='KT',
        verbose_name="Trạng Thái Cư Trú"
    )

    history = HistoricalRecords()
    
    class Meta:
        db_table = 'CuDan'
        ordering = ['MaCuDan']

    def __str__(self):
        return f"{self.HoTen} (Số CCCD: {self.SoCCCD})"
    

class BienDongDanCu(models.Model):
    # MaBienDong: int [pk, increment, note: "TỰ TĂNG"]
    MaBienDong = models.AutoField(
        primary_key=True,
        verbose_name="Mã Biến Động",
    )

    # MaCuDan: int (Khóa ngoại)
    MaCuDan = models.ForeignKey(
        'CuDan', 
        on_delete=models.CASCADE,  
        related_name='lich_su_bien_dong',
        verbose_name="Mã Cư Dân"
    )

    # LoaiBienDong: varchar
    # Nên dùng choices để chuẩn hóa loại biến động (ví dụ: Chuyển đi, Chuyển đến, Tạm vắng)
    LOAI_BIEN_DONG_CHOICES = (
        ('CDI', 'Chuyển đi'),
        ('CDEN', 'Chuyển đến'),
        ('TVANG', 'Tạm vắng'),
    )
    LoaiBienDong = models.CharField(
        max_length=10,
        choices=LOAI_BIEN_DONG_CHOICES,
        verbose_name="Loại Biến Động"
    )

    # TuNgay: date
    NgayBatDau = models.DateField(
        verbose_name="Ngay Bắt Đầu"
    )

    # DenNgay: date
    # Cho phép NULL/trống vì biến động có thể đang tiếp diễn (ví dụ: Tạm vắng chưa kết thúc)
    NgayKetThuc = models.DateField(
        null=True, 
        blank=True, 
        verbose_name="Ngày Kết Thúc"
    )

    # LyDo: varchar
    LyDo = models.TextField( # Dùng TextField cho lý do dài
        verbose_name="Lý Do",
        null=True,
        blank=True
    )

    history = HistoricalRecords()
    
    class Meta:
        db_table = 'BienDongDanCu'
        # Ràng buộc: Một cư dân không thể có hai biến động cùng loại chồng chéo về thời gian
        # Tuy nhiên, điều này phức tạp nên không đặt ở đây, chỉ là gợi ý.
        ordering = ['MaBienDong'] # Sắp xếp theo ngày gần nhất

    def __str__(self):
        return f"{self.MaCuDan.HoTen} - {self.LoaiBienDong}"