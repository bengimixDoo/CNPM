from rest_framework import viewsets, status
from django.db.models import Count, Q
from .models import CanHo, CuDan, BienDongDanCu
from .serializers import CanHoSerializer, CuDanSerializer, BienDongDanCuSerializer
from .serializers import CanHoHistorySerializer, CuDanHistorySerializer, BienDongDanCuHistorySerializer
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.response import Response


# Create your views here.
class CanHoViewSet(viewsets.ModelViewSet):
    queryset = CanHo.objects.all().order_by('ma_can_ho')
    serializer_class = CanHoSerializer

    @action(detail=False, methods=['get'], url_path='thongke')
    def thong_ke(self, request):
        """
        Endpoint: GET /api/canho/thongke/
        """
        queryset = self.get_queryset()

        # 1. Thống kê tổng quát toàn bộ hệ thống
        thong_ke_tong_quat = queryset.aggregate(
            tong_so_can_ho=Count('ma_can_ho'),
            so_can_trong_E=Count('ma_can_ho', filter=Q(trang_thai='E')),
            so_da_ban_S=Count('ma_can_ho', filter=Q(trang_thai='S')),
            so_dang_thue_H=Count('ma_can_ho', filter=Q(trang_thai='H'))
        )
        # 2. Thống kê chi tiết theo từng Tòa nhà (Bao gồm trạng thái trong mỗi tòa)
        # Sử dụng values('toa_nha') để Group By
        thong_ke_theo_toa = (
            queryset.values('toa_nha')
            .annotate(
                tong_so=Count('ma_can_ho'),
                trong_E=Count('ma_can_ho', filter=Q(trang_thai='E')),
                da_ban_S=Count('ma_can_ho', filter=Q(trang_thai='S')),
                dang_thue_H=Count('ma_can_ho', filter=Q(trang_thai='H'))
            )
            .order_by('toa_nha')
        )

        # Cấu trúc lại dữ liệu để trả về JSON sạch đẹp
        data_response = {
            "tong_quan": thong_ke_tong_quat,
            "chi_tiet": {
                item['toa_nha']: {
                    "tong_can": item['tong_so'],
                    "trong": item['trong_E'],
                    "da_ban": item['da_ban_S'],
                    "dang_thue": item['dang_thue_H']
                } for item in thong_ke_theo_toa
            }
        }
        return Response(data_response, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'], url_path='thongke')
    def thong_ke_chi_tiet_can_ho(self, request, pk=None):
        """
        Endpoint: GET /api/canho/{id}/thongke/
        """
        # Lấy đối tượng căn hộ cụ thể, nếu không có sẽ trả về 404
        can_ho = self.get_object()

        # Thực hiện thống kê tập hợp trên liên kết ngược 'cu_dan_hien_tai'
        # (related_name bạn đã đặt trong model CuDan)
        stats = can_ho.cu_dan_hien_tai.aggregate(
            tong_nguoi=Count('ma_cu_dan'),
            tam_vang=Count('ma_cu_dan', filter=Q(trang_thai_cu_tru='TV')),
            tam_tru=Count('ma_cu_dan', filter=Q(trang_thai_cu_tru='TT')),
            thuong_tru=Count('ma_cu_dan', filter=Q(trang_thai_cu_tru='TH'))
        )

        data = {
            "thong_tin_can_ho": {
                "ma_can_ho": can_ho.ma_can_ho,
                "phong": can_ho.phong,
                "tang": can_ho.tang,
                "toa_nha": can_ho.toa_nha,
                "trang_thai_hien_tai": can_ho.get_trang_thai_display(), # Trả về "Trống", "Đã bán"...
            },
            "thong_ke_nhan_khau": {
                "tong_so_nguoi_dang_o": stats['tong_nguoi'],
                "so_nguoi_tam_tru": stats['tam_tru'],
                "so_nguoi_thuong_tru": stats['thuong_tru'],
                "so_nguoi_tam_vang": stats['tam_vang'],
            }
        }

        return Response(data, status=status.HTTP_200_OK)

class CanHoHistoryView(generics.ListAPIView):
    serializer_class = CanHoHistorySerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Lấy MaHoKhau từ URL
        ma_can_ho = self.kwargs['ma_can_ho'] 
        # Trả về tất cả các phiên bản lịch sử của đối tượng đó
        return CanHo.history.filter(MaCanHo=ma_can_ho).order_by('-history_date')

class CuDanViewSet(viewsets.ModelViewSet):
    queryset = CuDan.objects.all().order_by('ma_cu_dan')
    serializer_class = CuDanSerializer

class CuDanHistoryView(generics.ListAPIView):
    serializer_class = CuDanHistorySerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Lấy MaCuDan từ URL
        ma_cu_dan = self.kwargs['ma_cu_dan'] 
        # Trả về tất cả các phiên bản lịch sử của đối tượng đó
        return CuDan.history.filter(MaCuDan=ma_cu_dan).order_by('-history_date')
    
class BienDongDanCuViewSet(viewsets.ModelViewSet):
    queryset = BienDongDanCu.objects.all().order_by('ma_bien_dong')
    serializer_class = BienDongDanCuSerializer

class BienDongDanCuHistoryView(generics.ListAPIView):
    serializer_class = BienDongDanCuHistorySerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Lấy MaBienDong từ URL
        ma_bien_dong = self.kwargs['ma_bien_dong'] 
        # Trả về tất cả các phiên bản lịch sử của đối tượng đó
        return BienDongDanCu.history.filter(MaBienDong=ma_bien_dong).order_by('-history_date')