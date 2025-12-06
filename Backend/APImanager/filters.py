import django_filters
from .models import HoKhau

class HoKhauFilter(django_filters.FilterSet):
    # 1. Lọc Địa Chỉ (DiaChi) theo kiểu "chứa chuỗi" (icontains)
    # Tên tham số URL sẽ là ?DiaChi=...
    DiaChi = django_filters.CharFilter(
        field_name='DiaChi', 
        lookup_expr='icontains' # icontains: tìm kiếm chứa chuỗi, không phân biệt hoa thường
    )

    # 2. Lọc Lý Do Chuyển Đi (LyDoChuyenDi) theo kiểu "chứa chuỗi"
    LyDoChuyenDi = django_filters.CharFilter(
        field_name='LyDoChuyenDi', 
        lookup_expr='icontains'
    )

    # 3. Lọc Mã Hộ Khẩu (MaHoKhau) theo kiểu "khớp chính xác" (exact)
    MaHoKhau = django_filters.CharFilter(
        field_name='MaHoKhau', 
        lookup_expr='exact' 
    )
    
    # 4. (Ví dụ bổ sung) Lọc các Hộ Khẩu được lập TỪ một ngày cụ thể trở đi
    NgayLap = django_filters.DateFilter(
        field_name='NgayLap',
        lookup_expr='gte' # gte: greater than or equal (lớn hơn hoặc bằng)
    )

    class Meta:
        model = HoKhau
        # Danh sách các trường được sử dụng trong FilterSet
        fields = ['DiaChi', 'LyDoChuyenDi', 'MaHoKhau', 'NgayLap']