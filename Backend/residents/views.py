from rest_framework import viewsets, status
from django.db.models import Count, Q
from .models import CanHo, CuDan, BienDongDanCu
from .serializers import CanHoSerializer, CuDanSerializer, BienDongDanCuSerializer
from .serializers import CanHoHistorySerializer, CuDanHistorySerializer, BienDongDanCuHistorySerializer
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


# Create your views here.
class CanHoViewSet(viewsets.ModelViewSet):
    queryset = CanHo.objects.all().order_by('ma_can_ho')
    serializer_class = CanHoSerializer
    # permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='thongke')
    def thong_ke(self, request):
        """
        Endpoint: GET /api/apartments/thongke/
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
    
    @action(detail=True, methods=['get'], url_path='detail')
    def thong_ke_chi_tiet_can_ho(self, request, pk=None):
        """
        Endpoint: GET /api/apartments/{id}/detail/
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
        danh_sach_cu_dan = can_ho.cu_dan_hien_tai.values('ma_cu_dan')

        data = {
            "thong_tin_can_ho": {
                "ma_can_ho": can_ho.ma_can_ho,
                "phong": can_ho.phong,
                "tang": can_ho.tang,
                "toa_nha": can_ho.toa_nha,
                "dien_tich": can_ho.dien_tich,
                "trang_thai_hien_tai": can_ho.trang_thai, # Trả về "Trống", "Đã bán"...
            },
            "thong_ke_nhan_khau": {
                "danh_sach_cu_dan": list(danh_sach_cu_dan),
                "tong_so_nguoi": stats['tong_nguoi'],
                "so_nguoi_tam_tru": stats['tam_tru'],
                "so_nguoi_thuong_tru": stats['thuong_tru'],
                "so_nguoi_tam_vang": stats['tam_vang'],
            }
        }

        return Response(data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request, pk=None):
        # 1. Lấy căn hộ hiện tại
        apartment = self.get_object()
        
        # 2. Truy vấn và sắp xếp giảm dần theo ngày
        # select_related giúp truy vấn tên cư dân nhanh hơn (tránh lỗi N+1)
        history_qs = BienDongDanCu.objects.filter(can_ho=apartment).select_related('cu_dan').order_by('-ngay_thuc_hien')
        
        # 3. Tạo list dữ liệu thủ công (Không cần Serializer class)
        data = [
            {
                "ma_cu_dan": item.cu_dan.ma_cu_dan,
                "loai_bien_dong": item.loai_bien_dong,
                "ngay_thuc_hien": item.ngay_thuc_hien
            } 
            for item in history_qs
        ]
        
        return Response(data)

class CanHoHistoryView(generics.ListAPIView):
    serializer_class = CanHoHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Lấy MaHoKhau từ URL
        ma_can_ho = self.kwargs['ma_can_ho'] 
        # Trả về tất cả các phiên bản lịch sử của đối tượng đó
        return CanHo.history.filter(MaCanHo=ma_can_ho).order_by('-history_date')

class CuDanViewSet(viewsets.ModelViewSet):
    queryset = CuDan.objects.all().order_by('ma_cu_dan')
    serializer_class = CuDanSerializer
    # permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request, pk=None):
        """
        Endpoint: GET /api/residents/{id}/history/
        """
        # 1. Lấy cư dân hiện tại dựa trên ID (pk)
        resident = self.get_object()
        
        # 2. Truy vấn lịch sử biến động của cư dân này
        # Dùng select_related('can_ho') để lấy nhanh mã căn hộ
        history_qs = BienDongDanCu.objects.filter(
            cu_dan=resident
        ).select_related('can_ho').order_by('-ngay_thuc_hien')
        
        # 3. Trả về dữ liệu rút gọn (không dùng Serializer class)
        data = [
            {
                "ma_can_ho": item.can_ho.ma_can_ho, # ID của căn hộ
                "loai_bien_dong": item.loai_bien_dong, # 'Thường trú', 'Chuyển đi'... nếu lấy tên thì dùng item.get_loai_bien_dong_display()
                "ngay_thuc_hien": item.ngay_thuc_hien
            }
            for item in history_qs
        ]
        
        return Response(data)

class CuDanHistoryView(generics.ListAPIView):
    serializer_class = CuDanHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Lấy MaCuDan từ URL
        ma_cu_dan = self.kwargs['ma_cu_dan'] 
        # Trả về tất cả các phiên bản lịch sử của đối tượng đó
        return CuDan.history.filter(MaCuDan=ma_cu_dan).order_by('-history_date')
    
class BienDongDanCuViewSet(viewsets.ModelViewSet):
    queryset = BienDongDanCu.objects.all().order_by('ma_bien_dong')
    serializer_class = BienDongDanCuSerializer
    # permission_classes = [IsAuthenticated]

class BienDongDanCuHistoryView(generics.ListAPIView):
    serializer_class = BienDongDanCuHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Lấy MaBienDong từ URL
        ma_bien_dong = self.kwargs['ma_bien_dong'] 
        # Trả về tất cả các phiên bản lịch sử của đối tượng đó
        return BienDongDanCu.history.filter(MaBienDong=ma_bien_dong).order_by('-history_date')