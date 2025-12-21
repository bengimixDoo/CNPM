from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import CanHo, CuDan, BienDongDanCu
from .serializers import (
    CanHoSerializer, CanHoDetailSerializer, 
    CuDanSerializer, BienDongDanCuSerializer, MoveInSerializer
)
from datetime import date
from django.db import transaction

class IsManagerOrAdmin(permissions.BasePermission):
    """
    Permission: Manager hoặc Admin.
    """
    def has_permission(self, request, view):
        return request.user and (request.user.role == 'manager' or request.user.role == 'admin')

class CanHoViewSet(viewsets.ModelViewSet):
    """
    API ViewSet quản lý Căn hộ.
    - List: Xem danh sách.
    - Retrieve: Xem chi tiết (kèm cư dân đang ở).
    - Create/Update/Delete: Manager/Admin.
    """
    queryset = CanHo.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CanHoDetailSerializer
        return CanHoSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManagerOrAdmin()]
        return [permissions.IsAuthenticated()]

    @decorators.action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """
        Endpoint: GET /apartments/{id}/history/
        Lấy lịch sử biến động dân cư của căn hộ này (dựa trên Biến động của các resident từng ở đây? 
        Hoặc đơn giản là query table BienDongDanCu join CuDan).
        Tuy nhiên BienDongDanCu đang link với CuDan, không trực tiếp CanHo.
        Logic: Tìm tất cả CuDan từng ở căn này, sau đó liệt kê biến động của họ?
        Cách đơn giản hơn cho MVP: List các biến động của các cư dân *đang* ở đây hoặc đã từng ở.
        NOTE: Model hiện tại chưa tối ưu để query history theo căn hộ dễ dàng nếu người đó chuyển đi.
        Tạm thời trả về history của các cư dân HIỆN TẠI trong căn hộ.
        """
        can_ho = self.get_object()
        can_ho = self.get_object()
        # Query lịch sử biến động của chính căn hộ này (nhờ field can_ho mới thêm)
        history = BienDongDanCu.objects.filter(can_ho=can_ho).order_by('-ngay_thuc_hien')
        serializer = BienDongDanCuSerializer(history, many=True)
        return Response(serializer.data)

class CuDanViewSet(viewsets.ModelViewSet):
    """
    API ViewSet quản lý Cư dân.
    """
    queryset = CuDan.objects.all()
    serializer_class = CuDanSerializer
    permission_classes = [IsManagerOrAdmin] # Mặc định Manager quản lý full

    def get_queryset(self):
        """
        Search theo tên hoặc CCCD nếu có param.
        """
        queryset = super().get_queryset()
        name = self.request.query_params.get('name')
        cccd = self.request.query_params.get('cccd')
        if name:
            queryset = queryset.filter(ho_ten__icontains=name)
        if cccd:
            queryset = queryset.filter(so_cccd__icontains=cccd)
        return queryset

    @decorators.action(detail=True, methods=['post'], url_path='move-in')
    def move_in(self, request, pk=None):
        """
        Nghiệp vụ Chuyển đến.
        Input: {apartment_id, la_chu_ho}
        Logic: 
        1. Update MaCanHoDangO
        2. Tạo BienDongDanCu (Nhập khẩu/Đến ở)
        """
        cu_dan = self.get_object()
        serializer = MoveInSerializer(data=request.data)
        if serializer.is_valid():
            apt_id = serializer.validated_data['apartment_id']
            is_owner = serializer.validated_data['la_chu_ho']

            try:
                can_ho = CanHo.objects.get(pk=apt_id)
            except CanHo.DoesNotExist:
                return Response({"error": "Căn hộ không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

            with transaction.atomic():
                # 1. Update CuDan
                cu_dan.can_ho_dang_o = can_ho
                cu_dan.la_chu_ho = is_owner
                cu_dan.trang_thai_cu_tru = 'ThuongTru' # Hoặc TamTru tùy logic
                cu_dan.save()

                # 2. Tạo BienDong
                BienDongDanCu.objects.create(
                    cu_dan=cu_dan,
                    can_ho=can_ho, # Lưu vết căn hộ
                    loai_bien_dong='ChuyenDen',
                    ngay_thuc_hien=date.today()
                )
                
                # Update trạng thái căn hộ nếu cần
                if can_ho.trang_thai == 'Trong':
                     can_ho.trang_thai = 'DangO'
                     can_ho.save()

            return Response({"message": f"Cư dân {cu_dan.ho_ten} đã chuyển vào {can_ho.ma_hien_thi}"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(detail=True, methods=['post'], url_path='move-out')
    def move_out(self, request, pk=None):
        """
        Nghiệp vụ Chuyển đi.
        Logic:
        1. Set MaCanHoDangO = Null
        2. Tạo BienDongDanCu (Chuyển đi)
        """
        cu_dan = self.get_object()
        
        with transaction.atomic():
            old_apt = cu_dan.can_ho_dang_o
            
            # 1. Update CuDan
            cu_dan.can_ho_dang_o = None
            cu_dan.la_chu_ho = False
            cu_dan.save()

            # 2. Tạo BienDong
            BienDongDanCu.objects.create(
                cu_dan=cu_dan,
                can_ho=old_apt, # Lưu vết căn hộ cũ
                loai_bien_dong='ChuyenDi',
                ngay_thuc_hien=date.today()
            )
            
            # Check old apt status (nếu trống hết thì set về Trong? - Optional)

        return Response({"message": f"Cư dân {cu_dan.ho_ten} đã chuyển đi."})
