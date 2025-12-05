from django.db.models import Count
from django.db.models.functions import ExtractYear
from django.shortcuts import render # Import hàm trích xuất năm
from CapNhatHoKhau.models import HoKhau

def thong_ke_theo_nam(request):
    # 1. Truy vấn: Trích xuất năm từ NgayLap, nhóm theo năm và đếm
    thong_ke_nam = HoKhau.objects \
        .annotate(nam_lap=ExtractYear('NgayLap')) \
        .values('nam_lap') \
        .annotate(total=Count('MaHoKhau')) \
        .order_by('-nam_lap') # Sắp xếp giảm dần theo năm
        
    context = {
        'thong_ke_nam': thong_ke_nam
    }
    return render(request, 'thong_ke_theo_nam.html', context)