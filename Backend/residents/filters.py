import django_filters
from .models import CanHo, CuDan

# class CanHoFilter(django_filters.FilterSet):

#     # SoPhong = django_filters.NumberFilter(
#     #     label='Số Phòng',
#     #     field_name='SoPhong',
#     #     lookup_expr='icontains'
#     # )

#     Tang = django_filters.NumberFilter(
#         label='Tầng',
#         field_name='Tang',
#         lookup_expr='exact'
#     )

#     ToaNha = django_filters.CharFilter(
#         label='Tòa Nhà',
#         field_name='ToaNha',
#         lookup_expr='icontains'
        
#     )

#     DienTich_min = django_filters.NumberFilter(
#         label='Diện Tích Tối Thiểu',
#         field_name='DienTich',
#         lookup_expr='gte',  # Greater than or equal
#         # verbose_name='Diện Tích Tối Thiểu'
#     )

#     DienTich_max = django_filters.NumberFilter(
#         label='Diện Tích Tối Đa',
#         field_name='DienTich',
#         lookup_expr='lte',  # Less than or equal
#         # verbose_name='Diện Tích Tối Đa'
#     )

#     TrangThai = django_filters.CharFilter(
#         label='Trạng Thái',
#         field_name='TrangThai',
#         lookup_expr='exact',
#         # verbose_name='Trạng Thái'
#     )

#     NgayBanGiao_min = django_filters.DateFilter(
#         label='Ngày Bàn Giao Min',
#         field_name='NgayBanGiao',
#         lookup_expr='gte',  # Greater than or equal
#         # verbose_name='Ngày Bàn Giao Bắt Đầu'
#     )
#     NgayBanGiao_max = django_filters.DateFilter(
#         label='Ngày Bàn Giao Max',
#         field_name='NgayBanGiao',
#         lookup_expr='lte',  # Less than or equal
#         # verbose_name='Ngày Bàn Giao Kết Thúc'
#     )

#     # 1. Tìm kiếm theo Họ Tên chủ sở hữu
#     chu_so_huu_ho_ten = django_filters.CharFilter(
#         field_name='MaChuSoHuu__HoTen',
#         lookup_expr='icontains', # Sử dụng icontains để tìm kiếm không phân biệt chữ hoa/chữ thường
#         label='Họ Tên Chủ Sở Hữu'
#     )
    
#     # 2. Tìm kiếm theo Số CCCD chủ sở hữu
#     chu_so_huu_cccd = django_filters.CharFilter(
#         field_name='MaChuSoHuu__SoCCCD',
#         lookup_expr='icontains',
#         label='Số CCCD Chủ Sở Hữu'
#     )
    
#     # 3. Tìm kiếm theo Ngày sinh chủ sở hữu
#     # Nếu bạn muốn tìm chính xác ngày sinh:
#     chu_so_huu_ngay_sinh = django_filters.DateFilter(
#         field_name='MaChuSoHuu__NgaySinh',
#         label='Ngày Sinh Chủ Sở Hữu'
#     )
    

#     class Meta:
#         model = CanHo
#         fields = ['SoPhong', 'Tang', 'ToaNha', 'TrangThai', 'chu_so_huu_ho_ten', 'chu_so_huu_cccd', 'chu_so_huu_ngay_sinh', 
#                   'DienTich_min', 'DienTich_max', 'NgayBanGiao_min', 'NgayBanGiao_max']
        

# class CuDanFilter(django_filters.FilterSet):

#     HoTen = django_filters.CharFilter(
#         label='Họ Tên',
#         field_name='HoTen',
#         lookup_expr='icontains'
#     )

#     SoCCCD = django_filters.CharFilter(
#         label='Số CCCD',
#         field_name='SoCCCD',
#         lookup_expr='exact'
#     )

#     NgaySinh = django_filters.DateFilter(
#         label='Ngày Sinh',
#         field_name='NgaySinh',
#     )

#     SoDienThoai = django_filters.CharFilter(
#         label='Số Điện Thoại',
#         field_name='SoDienThoai',
#         lookup_expr='icontains'
#     )

#     Email = django_filters.CharFilter(
#         label='Email',
#         field_name='Email',
#         lookup_expr='icontains'
#     )

#     # 1. Lọc theo Số Phòng Căn Hộ Đang Ở (MaCanHoDangO__SoPhong)
#     so_phong = django_filters.CharFilter(
#         field_name='MaCanHoDangO__SoPhong',
#         label='Số Phòng Đang Ở'
#     )
    
#     # 2. Lọc theo Tầng Căn Hộ Đang Ở (MaCanHoDangO__Tang)
#     tang = django_filters.NumberFilter(
#         field_name='MaCanHoDangO__Tang',
#         label='Tầng Đang Ở'
#         # Mặc định lookup_expr là 'exact' (bằng)
#     )
    
#     # 3. Lọc theo Tòa Nhà Căn Hộ Đang Ở (MaCanHoDangO__ToaNha)
#     toa_nha = django_filters.CharFilter(
#         field_name='MaCanHoDangO__ToaNha',
#         label='Tòa Nhà Đang'
#     )
    

#     class Meta:
#         model = CuDan
#         fields = ['HoTen', 'SoCCCD', 'NgaySinh', 'SoDienThoai', 'Email', 'so_phong', 'tang', 'toa_nha']