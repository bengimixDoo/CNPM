from rest_framework import viewsets, status
from django_filters.rest_framework import DjangoFilterBackend
from .models import CanHo
from .serializers import CanHoHistorySerializer, CanHoSerializer
from .filters import CanHoFilter 
from rest_framework.decorators import action
from django.db.models import Count 
from datetime import datetime
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q, Sum, Avg
from django.db.models.functions import ExtractYear, ExtractMonth

class CanHoViewSet(viewsets.ModelViewSet):
    queryset = CanHo.objects.all().order_by('MaCanHo')
    serializer_class = CanHoSerializer

    # 1. Đặt Filter Backend
    filter_backends = [DjangoFilterBackend] 
    
    # 2. Khai báo FilterSet class sẽ được sử dụng
    filterset_class = CanHoFilter

    # permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='thongke')
    def thong_ke_toan_dien(self, request):
        queryset = self.get_queryset()

        # 1. Thống kê tổng quan sử dụng Aggregate (Tối ưu 1 câu query)
        tong_quan = queryset.aggregate(
            tong_so_can_ho=Count('MaCanHo'),
            so_can_trong=Count('MaCanHo', filter=Q(TrangThai__icontains='A')),
            so_da_ban=Count('MaCanHo', filter=Q(TrangThai__icontains='B')),
            so_da_thue=Count('MaCanHo', filter=Q(TrangThai__icontains='C')),
            # tong_dien_tich=Sum('DienTich'),
            dien_tich_trung_binh=Avg('DienTich'),
        )

        # 2. Thống kê chi tiết theo Tòa nhà
        theo_toa = (
            queryset.values('ToaNha')
            .annotate(so_luong=Count('MaCanHo'))
            .order_by('-so_luong')
        )

        # 3. Thống kê theo Tầng
        theo_tang = (
            queryset.values('Tang')
            .annotate(so_luong=Count('MaCanHo'))
            .order_by('Tang')
        )

        # 4. Thống kê theo thời gian bàn giao (Theo Năm)
        # Giúp bạn thấy tốc độ phát triển/bàn giao dự án
        theo_thoi_gian = (
            queryset.annotate(nam_ban_giao=ExtractYear('NgayBanGiao'))
            .values('nam_ban_giao')
            .annotate(so_luong=Count('MaCanHo'))
            .order_by('nam_ban_giao')
        )

        # Xây dựng dữ liệu trả về trực tiếp
        data_response = {
            "thông_số_chung": tong_quan,
            "phân_bổ_tòa_nhà": {item['ToaNha']: item['so_luong'] for item in theo_toa},
            "mật_độ_tầng": {f"Tầng {item['Tang']}": item['so_luong'] for item in theo_tang},
            "tiến_độ_bàn_giao": {
                str(item['nam_ban_giao'] if item['nam_ban_giao'] else "Chưa bàn giao"): item['so_luong'] 
                for item in theo_thoi_gian
            }
        }

        return Response(data_response, status=status.HTTP_200_OK)
    
class CanHoHistoryAPIView(generics.ListAPIView):
    serializer_class = CanHoHistorySerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Lấy MaHoKhau từ URL
        ma_can_ho = self.kwargs['ma_can_ho'] 
        # Trả về tất cả các phiên bản lịch sử của đối tượng đó
        return CanHo.history.filter(MaCanHo=ma_can_ho).order_by('-history_date')
    
from .models import CuDan
from .serializers import CuDanSerializer, CuDanHistorySerializer
from .filters import CuDanFilter

class CuDanViewSet(viewsets.ModelViewSet):
    queryset = CuDan.objects.all().order_by('MaCuDan')
    serializer_class = CuDanSerializer

    # 1. Đặt Filter Backend
    filter_backends = [DjangoFilterBackend] 
    
    # 2. Khai báo FilterSet class sẽ được sử dụng
    filterset_class = CuDanFilter

class CuDanHistoryAPIView(generics.ListAPIView):
    serializer_class = CuDanHistorySerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Lấy MaCuDan từ URL
        ma_cu_dan = self.kwargs['ma_cu_dan'] 
        # Trả về tất cả các phiên bản lịch sử của đối tượng đó
        return CuDan.history.filter(MaCuDan=ma_cu_dan).order_by('-history_date')