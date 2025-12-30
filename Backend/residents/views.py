from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

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
@extend_schema(
    tags=['Apartments']
)
class CanHoViewSet(viewsets.ModelViewSet):
    lookup_field = 'ma_can_ho'
    serializer_class = CanHoSerializer

    # [QUAN TRỌNG] Phân quyền chặt chẽ
    def get_permissions(self):
        # Hành động sửa đổi dữ liệu (Thêm, Sửa, Xóa) -> Chỉ QUẢN LÝ
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManager()]

        # Hành động Xem thống kê -> Chỉ KẾ TOÁN hoặc QUẢN LÝ (đã set ở @action bên dưới)
        if self.action == 'thong_ke':
            return [IsAccountant()]

        # Các hành động xem danh sách (list, retrieve) -> Ai có tài khoản cũng xem được
        # (Nhưng sẽ bị lọc dữ liệu ở get_queryset)
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        # 1. Quản lý, Kế toán, Admin: Xem hết toàn bộ
        if user.role in ['ADMIN', 'QUAN_LY', 'KE_TOAN'] or user.is_superuser:
            # Tối ưu truy vấn: lấy luôn thông tin chủ sở hữu và danh sách cư dân
            return CanHo.objects.all().select_related('chu_so_huu').prefetch_related('cu_dan_hien_tai').order_by('ma_can_ho')

        # 2. Cư dân: Chỉ xem được nhà mình đang ở
        # Logic: Dựa vào trường 'cu_dan_hien_tai' (related_name trong model CuDan)
        if hasattr(user, 'cu_dan') and user.cu_dan:
            return CanHo.objects.filter(cu_dan_hien_tai=user.cu_dan).select_related('chu_so_huu').prefetch_related('cu_dan_hien_tai').distinct().order_by('ma_can_ho')

        # 3. Người lạ: Không thấy gì
        return CanHo.objects.none()

    # --- CÁC ACTION MỞ RỘNG ---

    @action(detail=False, methods=['get'], url_path='thongke')
    def thong_ke(self, request):
        """
        Thống kê tổng quan tình trạng căn hộ (Trống, Đã bán, Đang thuê).
        """
        # Lưu ý: Dùng CanHo.objects.all() để thống kê toàn bộ, không phụ thuộc vào get_queryset
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
        """
        Xem chi tiết nhân khẩu trong 1 căn hộ cụ thể.
        """
        can_ho = self.get_object()

        # 'cu_dan_hien_tai' là related_name trỏ ngược về bảng CuDan
        stats = can_ho.cu_dan_hien_tai.aggregate(
            tong_nguoi=Count('ma_cu_dan'),
            tam_vang=Count('ma_cu_dan', filter=Q(trang_thai_cu_tru='TV')),
            tam_tru=Count('ma_cu_dan', filter=Q(trang_thai_cu_tru='TT')),
            thuong_tru=Count('ma_cu_dan', filter=Q(trang_thai_cu_tru='TH'))
        )
        danh_sach_cu_dan = can_ho.cu_dan_hien_tai.values('ma_cu_dan', 'ho_ten', 'ngay_sinh', 'so_dien_thoai', 'la_chu_ho', 'trang_thai_cu_tru')

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
# 2. VIEW HISTORY (LOG HỆ THỐNG - SIMPLE HISTORY)
# -----------------------------------------------------------
@extend_schema(tags=['Logs'])
class CanHoHistoryView(generics.ListAPIView):
    serializer_class = CanHoHistorySerializer
    permission_classes = [IsManager] # Chỉ quản lý xem log sửa đổi cấu trúc

    def get_queryset(self):
        ma_can_ho = self.kwargs['ma_can_ho']
        return CanHo.history.filter(ma_can_ho=ma_can_ho).order_by('-history_date')


# -----------------------------------------------------------
# 3. VIEWSET CƯ DÂN
# -----------------------------------------------------------
@extend_schema(
    tags=['Residents']
)
class CuDanViewSet(viewsets.ModelViewSet):
    lookup_field = 'ma_cu_dan'
    serializer_class = CuDanSerializer

    def get_permissions(self):
        # Chỉ Quản lý mới được Thêm/Sửa/Xóa hồ sơ cư dân
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManager()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        # 1. Quản lý, Kế toán, Admin: Xem hết
        if user.role in ['ADMIN', 'QUAN_LY', 'KE_TOAN'] or user.is_superuser:
            return CuDan.objects.all().order_by('ma_cu_dan')

        # 2. Cư dân: Chỉ xem được hồ sơ của chính mình và thành viên trong cùng căn hộ
        if hasattr(user, 'cu_dan') and user.cu_dan:
            # Lấy căn hộ hiện tại của user
            current_apartment = user.cu_dan.can_ho_dang_o
            if current_apartment:
                return CuDan.objects.filter(can_ho_dang_o=current_apartment).order_by('ma_cu_dan')
            else:
                # Nếu chưa vào ở đâu, chỉ xem được chính mình
                return CuDan.objects.filter(pk=user.cu_dan.pk)

        return CuDan.objects.none()

    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request, pk=None):
        resident = self.get_object()
        history_qs = BienDongDanCu.objects.filter(cu_dan=resident).order_by('-ngay_thuc_hien')
        data = [
            {
                "loai_bien_dong": item.get_loai_bien_dong_display(),
                "ngay_thuc_hien": item.ngay_thuc_hien
            }
            for item in history_qs
        ]
        return Response(data)

@extend_schema(tags=['Logs'])
class CuDanHistoryView(generics.ListAPIView):
    serializer_class = CuDanHistorySerializer
    permission_classes = [IsManager] # Log nhạy cảm

    def get_queryset(self):
        ma_cu_dan = self.kwargs['ma_cu_dan']
        return CuDan.history.filter(ma_cu_dan=ma_cu_dan).order_by('-history_date')


# -----------------------------------------------------------
# 4. VIEWSET BIẾN ĐỘNG DÂN CƯ
# -----------------------------------------------------------
@extend_schema(tags=['History'])
class BienDongDanCuViewSet(viewsets.ModelViewSet):
    queryset = BienDongDanCu.objects.all().order_by('ma_bien_dong')
    serializer_class = BienDongDanCuSerializer

    # Kế toán không được phép nhập/cắt khẩu -> Vẫn giữ IsManager
    permission_classes = [IsManager]

@extend_schema(tags=['Logs'])
class BienDongDanCuHistoryView(generics.ListAPIView):
    serializer_class = BienDongDanCuHistorySerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        ma_bien_dong = self.kwargs['ma_bien_dong']
        return BienDongDanCu.history.filter(ma_bien_dong=ma_bien_dong).order_by('-history_date')