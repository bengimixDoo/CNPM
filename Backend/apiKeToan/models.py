from django.db import models

from apiQuanLy.models import CanHo, CuDan

# Create your models here.

class PhuongTien(models.Model):
    # MaXe: int [pk, increment, note: "TỰ TĂNG"]
    MaXe = models.AutoField(
        primary_key=True,
        verbose_name="Mã Xe",
        help_text="ID TỰ TĂNG (Khóa chính)"
    )

    # MaCanHo: int (Khóa ngoại)
    # Căn hộ đăng ký phương tiện (dù chủ sở hữu là ai)
    MaCanHo = models.ForeignKey(
        'apiQuanLy.CanHo', 
        on_delete=models.CASCADE, # Nếu Căn Hộ bị xóa, phương tiện đăng ký tại đó phải bị xóa khỏi danh sách
        related_name='can_ho_dang_ky_phuong_tien',
        verbose_name="Căn Hộ Đăng Ký"
    )

    # MaCuDan: int (Khóa ngoại)
    # Chủ sở hữu/người sử dụng phương tiện
    MaCuDan = models.ForeignKey(
        'apiQuanLy.CuDan', 
        on_delete=models.SET_NULL, # Nếu Cư Dân bị xóa, giữ lại phương tiện nhưng để trống chủ sở hữu
        null=True, 
        blank=True,
        related_name='chu_so_huu_phuong_tien',
        verbose_name="Chủ Sở Hữu"
    )

    # BienSo: varchar
    BienSo = models.CharField(
        max_length=20,
        unique=True, # Biển số xe là duy nhất trong hệ thống
        verbose_name="Biển Số Xe"
    )

    # LoaiXe: varchar
    LOAI_XE_CHOICES = (
        ('XM', 'Xe Máy'),
        ('OTO', 'Ô Tô'),
        ('XD', 'Xe Đạp/Xe Điện'),
        ('KHAC', 'Khác'),
    )
    LoaiXe = models.CharField(
        max_length=10,
        choices=LOAI_XE_CHOICES,
        default='KHAC',
        verbose_name="Loại Xe"
    )

    # MauXe: varchar
    MauXe = models.CharField(
        max_length=50,
        verbose_name="Màu Xe",
        null=True, 
        blank=True
    )
    
    class Meta:
        db_table = 'PhuongTien'
        ordering = ['MaXe']
        # Ràng buộc phức hợp (Nếu cần): Một người không thể đăng ký nhiều phương tiện cùng loại (ít dùng)
        # constraints = [
        #     models.UniqueConstraint(fields=['MaCanHo', 'BienSo'], name='unique_bienso_per_canho')
        # ]

    def __str__(self):
        return self.MaXe
    
class ChiSoDienNuoc(models.Model):
    # MaChiSo: int [pk, increment, note: "TỰ TĂNG"]
    MaChiSo = models.AutoField(
        primary_key=True,
        verbose_name="Mã Chỉ Số",
    )

    # MaCanHo: int (Khóa ngoại)
    MaCanHo = models.ForeignKey(
        'apiQuanLy.CanHo', 
        on_delete=models.CASCADE, # Nếu Căn Hộ bị xóa, chỉ số tiêu thụ lịch sử cũng không còn cần thiết
        related_name='chi_so_dien_nuoc',
        verbose_name="Mã Căn Hộ"
    )

    # LoaiDichVu: varchar
    LOAI_DV_CHOICES = (
        ('DIEN', 'Điện'),
        ('NUOC', 'Nước'),
        ('GAS', 'Gas'),
        ('KHAC', 'Khác'),
    )
    LoaiDichVu = models.CharField(
        max_length=10,
        choices=LOAI_DV_CHOICES,
        default='KHAC',
        verbose_name="Loại Dịch Vụ"
    )

    # Thang: int (1-12)
    Thang = models.IntegerField(
        verbose_name="Tháng"
    )

    # Nam: int
    Nam = models.IntegerField(
        verbose_name="Năm"
    )

    # ChiSoCu: int
    ChiSoCu = models.IntegerField(
        verbose_name="Chỉ Số Cũ"
    )

    # ChiSoMoi: int
    ChiSoMoi = models.IntegerField(
        verbose_name="Chỉ Số Mới"
    )
    
    class Meta:
        db_table = 'ChiSoDienNuoc'
        ordering = ['MaChiSo']

        # Ràng buộc phức hợp: Đảm bảo chỉ có một bản ghi chỉ số cho một loại dịch vụ, một căn hộ trong một tháng/năm cụ thể.
        constraints = [
            models.UniqueConstraint(
                fields=['MaCanHo', 'LoaiDichVu', 'Thang', 'Nam'], 
                name='unique_chi_so_thang_nam'
            )
        ]

    def __str__(self):
        return self.MaChiSo

    @property
    def luong_tieu_thu(self):
        return self.ChiSoMoi - self.ChiSoCu
    

class DanhMucPhi(models.Model):
    MaLoaiPhi = models.IntegerField(
        primary_key=True,
        verbose_name="Mã Loại Phí",
    )

    # TenLoaiPhi: varchar
    TenLoaiPhi = models.CharField(
        max_length=150,
        verbose_name="Tên Loại Phí"
    )

    # DonGia: decimal
    # Sử dụng DecimalField cho tiền tệ để tránh lỗi làm tròn của float.
    DonGia = models.DecimalField(
        max_digits=15, # Tổng số chữ số
        decimal_places=2, # Số chữ số thập phân
        verbose_name="Đơn Giá"
    )

    DON_VI_TINH_CHOICES = (
        ('VND', 'Đồng (VNĐ)'),
        ('DO', 'Đô la Mỹ (USD)'),
        ('EU', 'Euro (EUR)'),
        ('KHAC', 'Khác'),
    )
    
    # DonViTinh: varchar được thay bằng CharField với choices
    DonViTinh = models.CharField(
        max_length=10,
        choices=DON_VI_TINH_CHOICES,
        default='VND', # Giá trị mặc định phổ biến
        verbose_name="Đơn Vị Tính"
    )

    # KyThuPhi: varchar
    # Xác định chu kỳ thu phí để dễ dàng quản lý
    KY_THU_CHOICES = (
        ('THANG', 'Theo Tháng'),
        ('QUY', 'Theo Quý'),
        ('NAM', 'Theo Năm'),
        ('KHAC', 'Khác'),
    )
    KyThuPhi = models.CharField(
        max_length=10,
        choices=KY_THU_CHOICES,
        default='THANG',
        verbose_name="Kỳ Thu Phí"
    )
    
    class Meta:
        db_table = 'DanhMucPhi'
        ordering = ['MaLoaiPhi']

    def __str__(self):
        return self.MaLoaiPhi + " - " + self.TenLoaiPhi
    


class HoaDon(models.Model):
    # MaHoaDon: int [pk, increment, note: "TỰ TĂNG"]
    MaHoaDon = models.AutoField(
        primary_key=True,
        verbose_name="Mã Hóa Đơn",
    )

    # MaCanHo: int (Khóa ngoại)
    MaCanHo = models.ForeignKey(
        'apiQuanLy.CanHo', 
        on_delete=models.CASCADE, # Nếu Căn Hộ bị xóa, các hóa đơn liên quan cũng nên bị xóa
        related_name='hoa_don',
        verbose_name="Mã Căn Hộ"
    )

    # Thang: int & Nam: int
    Thang = models.IntegerField(verbose_name="Tháng")
    Nam = models.IntegerField(verbose_name="Năm")

    # TongTien: decimal
    # Sử dụng DecimalField cho tiền tệ
    TongTien = models.DecimalField(
        max_digits=15, 
        decimal_places=2,
        default=0, # Mặc định là 0 khi hóa đơn mới được tạo
        verbose_name="Tổng Tiền"
    )

    # TrangThai: int
    # Chuyển thành CharField/choices để dễ quản lý hơn so với IntegerField đơn thuần
    TRANG_THAI_CHOICES = (
        (0, 'Chưa Thanh Toán'),
        (1, 'Đã Thanh Toán'),
        (2, 'Đã Hủy'),
    )
    TrangThai = models.IntegerField(
        choices=TRANG_THAI_CHOICES,
        default=0,
        verbose_name="Trạng Thái Thanh Toán"
    )
    
    # NgayTao: int
    # Giả định đây là Ngày Tạo hóa đơn (sử dụng DateField hoặc DateTimeField là tốt nhất)
    NgayTao = models.DateField(
        auto_now_add=True, # Tự động đặt ngày khi đối tượng được tạo lần đầu
        verbose_name="Ngày Tạo Hóa Đơn"
    )

    # NgayThanhToan: datetime
    NgayThanhToan = models.DateTimeField(
        null=True, 
        blank=True,
        verbose_name="Ngày Giờ Thanh Toán"
    )
    
    # NguoiDongTien: varchar
    NguoiDongTien = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        verbose_name="Người Đóng Tiền"
    )
    
    class Meta:
        db_table = 'HoaDon'
        ordering = ['MaHoaDon']

        # Ràng buộc phức hợp: Đảm bảo chỉ có một hóa đơn cho một căn hộ trong một tháng/năm cụ thể.
        constraints = [
            models.UniqueConstraint(
                fields=['MaCanHo', 'Thang', 'Nam'], 
                name='unique_hoa_don_thang_nam'
            )
        ]

    def __str__(self):
        return self.MaHoaDon
    

class ChiTietHoaDon(models.Model):
    # MaChiTiet: int [pk, increment, note: "TỰ TĂNG"]
    MaChiTiet = models.AutoField(
        primary_key=True,
        verbose_name="Mã Chi Tiết",
    )

    # MaHoaDon: int (Khóa ngoại)
    MaHoaDon = models.ForeignKey(
        'HoaDon', 
        on_delete=models.CASCADE, # Nếu Hóa Đơn bị xóa, chi tiết hóa đơn cũng bị xóa
        related_name='chi_tiet',
        verbose_name="Mã Hóa Đơn"
    )

    # MaLoaiPhi: int (Khóa ngoại)
    MaLoaiPhi = models.ForeignKey(
        'DanhMucPhi', 
        on_delete=models.PROTECT, # QUAN TRỌNG: Không cho phép xóa Danh Mục Phí nếu nó đã được sử dụng trong hóa đơn
        related_name='chi_tiet_hoa_don',
        verbose_name="Mã Loại Phí"
    )

    # SoLuong: int
    # Đại diện cho lượng tiêu thụ (số kWh, số m2, số chiếc xe,...)
    SoLuong = models.IntegerField(
        verbose_name="Số Lượng",
        default=1
    )

    # ThanhTien: decimal
    # Thành tiền của khoản mục này (Số lượng * Đơn giá)
    ThanhTien = models.DecimalField(
        max_digits=15,
        decimal_places=2, 
        default=0,
        verbose_name="Thành Tiền"
    )
    def save(self, *args, **kwargs):
        # 1. Lấy Đơn Giá từ DanhMucPhi
        # Đảm bảo MaLoaiPhi đã được chọn
        if self.MaLoaiPhi:
            don_gia = self.MaLoaiPhi.DonGia
            
            # 2. Tính Thành Tiền = Đơn Giá * Số Lượng
            self.ThanhTien = don_gia * self.SoLuong
        
        # 3. Gọi phương thức save() gốc
        super().save(*args, **kwargs)

    # GhiChu: varchar
    GhiChu = models.CharField(
        max_length=255,
        null=True, 
        blank=True,
        verbose_name="Ghi Chú"
    )


    
    class Meta:
        db_table = 'ChiTietHoaDon'
        ordering = ['MaHoaDon', 'MaLoaiPhi']
        
        # Ràng buộc: Một loại phí chỉ được xuất hiện một lần trong cùng một hóa đơn
        constraints = [
            models.UniqueConstraint(
                fields=['MaHoaDon', 'MaLoaiPhi'], 
                name='unique_loai_phi_in_hoa_don'
            )
        ]

    def __str__(self):
        return self.MaChiTiet + " - " + self.MaHoaDon