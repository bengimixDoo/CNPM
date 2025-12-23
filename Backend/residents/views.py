from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q

# Import Permissions
from users.permissions import IsManager, IsOwnerOrReadOnly, IsAccountant

# Import Models & Serializers
from .models import CanHo, CuDan, BienDongDanCu
from .serializers import (
    CanHoSerializer, CuDanSerializer, BienDongDanCuSerializer,
    CanHoHistorySerializer, CuDanHistorySerializer, BienDongDanCuHistorySerializer
)

# -----------------------------------------------------------
# 1. VIEWSET CĂN HỘ (Apartments)
# -----------------------------------------------------------
class CanHoViewSet(viewsets.ModelViewSet):
    serializer_class = CanHoSerializer
    # Kế toán cũng cần đăng nhập để xem
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user

        # [CẬP NHẬT] Thêm 'KE_TOAN' vào đây để họ thấy hết danh sách mà thu tiền
        if user.role in ['ADMIN', 'QUAN_LY', 'KE_TOAN'] or user.is_superuser:
            return CanHo.objects.all().order_by('ma_can_ho')

        # Cư dân: Chỉ xem được nhà mình
        if hasattr(user, 'cu_dan') and user.cu_dan:
            return CanHo.objects.filter(cu_dan_hien_tai=user.cu_dan).distinct().order_by('ma_can_ho')

        return CanHo.objects.none()

    # Thống kê thì Kế toán cũng nên được xem để biết tình hình lấp đầy
    @action(detail=False, methods=['get'], url_path='thongke', permission_classes=[IsAccountant])
    def thong_ke(self, request):
        """
        Endpoint: GET /api/residents/canho/thongke/
        Dành cho: Quản lý + Kế toán (IsAccountant đã bao gồm cả Manager)
        """
        queryset = CanHo.objects.all()

        thong_ke_tong_quat = queryset.aggregate(
            tong_so_can_ho=Count('ma_can_ho'),
            so_can_trong_E=Count('ma_can_ho', filter=Q(trang_thai='E')),
            so_da_ban_S=Count('ma_can_ho', filter=Q(trang_thai='S')),
            so_dang_thue_H=Count('ma_can_ho', filter=Q(trang_thai='H'))
        )

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
        can_ho = self.get_object()

        stats = can_ho.cu_dan_hien_tai.aggregate(
            tong_nguoi=Count('ma_cu_dan'),
            tam_vang=Count('ma_cu_dan', filter=Q(trang_thai_cu_tru='TV')),
            tam_tru=Count('ma_cu_dan', filter=Q(trang_thai_cu_tru='TT')),
            thuong_tru=Count('ma_cu_dan', filter=Q(trang_thai_cu_tru='TH'))
        )
        danh_sach_cu_dan = can_ho.cu_dan_hien_tai.values('ma_cu_dan', 'ho_ten')

        data = {
            "thong_tin_can_ho": {
                "ma_can_ho": can_ho.ma_can_ho,
                "phong": can_ho.phong,
                "tang": can_ho.tang,
                "toa_nha": can_ho.toa_nha,
                "dien_tich": can_ho.dien_tich,
                "trang_thai_hien_tai": can_ho.get_trang_thai_display(),
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
        apartment = self.get_object()
        history_qs = BienDongDanCu.objects.filter(can_ho=apartment).select_related('cu_dan').order_by('-ngay_thuc_hien')
        data = [
            {
                "ma_cu_dan": item.cu_dan.ma_cu_dan,
                "ten_cu_dan": item.cu_dan.ho_ten,
                "loai_bien_dong": item.get_loai_bien_dong_display(),
                "ngay_thuc_hien": item.ngay_thuc_hien
            }
            for item in history_qs
        ]
        return Response(data)

# -----------------------------------------------------------
# 2. VIEW HISTORY (LOG HỆ THỐNG)
# -----------------------------------------------------------
class CanHoHistoryView(generics.ListAPIView):
    serializer_class = CanHoHistorySerializer
    permission_classes = [IsManager] # Chỉ quản lý xem log sửa đổi cấu trúc

    def get_queryset(self):
        ma_can_ho = self.kwargs['ma_can_ho']
        return CanHo.history.filter(ma_can_ho=ma_can_ho).order_by('-history_date')


# -----------------------------------------------------------
# 3. VIEWSET CƯ DÂN
# -----------------------------------------------------------
class CuDanViewSet(viewsets.ModelViewSet):
    serializer_class = CuDanSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user

        # [CẬP NHẬT] Kế toán được xem hết danh sách cư dân (để xuất hóa đơn)
        if user.role in ['ADMIN', 'QUAN_LY', 'KE_TOAN'] or user.is_superuser:
            return CuDan.objects.all().order_by('ma_cu_dan')

        if hasattr(user, 'cu_dan') and user.cu_dan:
            return CuDan.objects.filter(ma_cu_dan=user.cu_dan.ma_cu_dan)

        return CuDan.objects.none()

    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request, pk=None):
        resident = self.get_object()
        history_qs = BienDongDanCu.objects.filter(
            cu_dan=resident
        ).select_related('can_ho').order_by('-ngay_thuc_hien')
        data = [
            {
                "ma_can_ho": item.can_ho.ma_can_ho,
                "loai_bien_dong": item.get_loai_bien_dong_display(),
                "ngay_thuc_hien": item.ngay_thuc_hien
            }
            for item in history_qs
        ]
        return Response(data)

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
    permission_classes = [IsManager] # Log nhạy cảm

    def get_queryset(self):
        ma_cu_dan = self.kwargs['ma_cu_dan']
        return CuDan.history.filter(ma_cu_dan=ma_cu_dan).order_by('-history_date')


# -----------------------------------------------------------
# 4. VIEWSET BIẾN ĐỘNG DÂN CƯ
# -----------------------------------------------------------
class BienDongDanCuViewSet(viewsets.ModelViewSet):
    queryset = BienDongDanCu.objects.all().order_by('ma_bien_dong')
    serializer_class = BienDongDanCuSerializer

    # Kế toán không được phép nhập/cắt khẩu -> Vẫn giữ IsManager
    permission_classes = [IsManager]

class BienDongDanCuHistoryView(generics.ListAPIView):
    serializer_class = BienDongDanCuHistorySerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        ma_bien_dong = self.kwargs['ma_bien_dong']
        return BienDongDanCu.history.filter(ma_bien_dong=ma_bien_dong).order_by('-history_date')