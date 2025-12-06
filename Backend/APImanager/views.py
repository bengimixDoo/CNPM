from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import HoKhau
from .serializers import HoKhauHistorySerializer, HoKhauSerializer
from .filters import HoKhauFilter 
from rest_framework.decorators import action
from django.db.models import Count 
from datetime import datetime
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

class HoKhauViewSet(viewsets.ModelViewSet):
    queryset = HoKhau.objects.all().order_by('MaHoKhau')
    serializer_class = HoKhauSerializer

    # 1. Đặt Filter Backend
    filter_backends = [DjangoFilterBackend] 
    
    # 2. Khai báo FilterSet class sẽ được sử dụng
    filterset_class = HoKhauFilter

    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def thongke(self, request):      
        # ----------------------------------------------------
        # 1. Tổng số Hộ Khẩu
        # ----------------------------------------------------
        tong_so_ho_khau = self.queryset.count()
        
        # ----------------------------------------------------
        # 2. Thống kê theo Nhóm Địa chỉ (Nhóm theo DiaChi)
        # ----------------------------------------------------
        # Sử dụng .values() để nhóm theo 'DiaChi' và .annotate(Count) để đếm số lượng
        thong_ke_dia_chi = (
            self.queryset
            .values('DiaChi') 
            .annotate(so_luong=Count('DiaChi'))
            .order_by('-so_luong') # Sắp xếp theo số lượng giảm dần
        )
        
        results = {
            "TongSoHoKhau": tong_so_ho_khau,
            "ThongKeTheoDiaChi": list(thong_ke_dia_chi),
        }
        
        # ----------------------------------------------------
        # Thống kê theo Ngày Lập
        # ----------------------------------------------------
        
        # Tham số để đếm số hộ lập từ ngày X
        pointDate = request.query_params.get('Point')
        
        # Tham số để đếm số hộ trong khoảng date X - Y
        startDate = request.query_params.get('Start')
        endDate = request.query_params.get('End')

        # Thống kê từ ngày X
        if pointDate:
            try:
                ngay_lap_from = datetime.strptime(pointDate, '%Y-%m-%d').date()
                so_ho_lap_tu_ngay_X = self.queryset.filter(NgayLap__gte=ngay_lap_from).count()
                results["SoHoLapTuNgay"] = so_ho_lap_tu_ngay_X
            except ValueError:
                return Response({"error": "Ngày phải ở định dạng YYYY-MM-DD."}, status=400)

        # Thống kê trong khoảng X đến Y
        if startDate and endDate:
            try:
                ngay_lap_start = datetime.strptime(startDate, '%Y-%m-%d').date()
                ngay_lap_end = datetime.strptime(endDate, '%Y-%m-%d').date()
                
                so_ho_trong_khoang_thoi_gian = self.queryset.filter(
                    NgayLap__range=(ngay_lap_start, ngay_lap_end)
                ).count()
                results["SoHoLapTrongKhoang"] = so_ho_trong_khoang_thoi_gian
            except ValueError:
                return Response({"error": "Ngày ở định dạng YYYY-MM-DD."}, status=400)
                
        return Response(results)
    
class HoKhauHistoryAPIView(generics.ListAPIView):
    serializer_class = HoKhauHistorySerializer

    def get_queryset(self):
        # Lấy MaHoKhau từ URL
        ma_ho_khau = self.kwargs['ma_ho_khau'] 
        # Trả về tất cả các phiên bản lịch sử của đối tượng đó
        return HoKhau.history.filter(MaHoKhau=ma_ho_khau).order_by('-history_date')