# app_name/views.py

from django.shortcuts import render
from django.db.models import Count
from CapNhatNhanKhau.models import NhanKhau

def thong_ke_gioi_tinh(request):
    # 1. Truy vấn: Nhóm theo GioiTinh và đếm số lượng
    thong_ke_data = NhanKhau.objects \
        .values('GioiTinh') \
        .annotate(total=Count('id')) \
        .order_by('GioiTinh')
        
    # 2. Tính tổng số nhân khẩu
    tong_so_nhan_khau = NhanKhau.objects.count()
    
    # Chuẩn bị dữ liệu hiển thị (chuyển Key DB thành Value hiển thị)
    data_list = []
    for item in thong_ke_data:
        # Sử dụng Model instance để lấy display name (giá trị hiển thị)
        # Tạm tạo một instance giả để gọi phương thức get_FOO_display()
        # Hoặc dùng dict comprehension nếu bạn biết trước choices
        
        display_name = dict(NhanKhau.GIOITINH_CHOICES).get(item['GioiTinh'], 'Lỗi')
        
        data_list.append({
            'label': display_name,
            'count': item['total']
        })

    context = {
        'tong_so': tong_so_nhan_khau,
        'thong_ke_gioi_tinh': data_list,
    }
    return render(request, 'thong_ke_gioi_tinh.html', context)
