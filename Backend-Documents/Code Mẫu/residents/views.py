from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CanHo, CuDan, BienDongDanCu
from .serializers import CanHoSerializer, CuDanSerializer, BienDongSerializer
# Giả sử bạn đã viết Permissions (tôi sẽ viết ở file riêng bên dưới)
from core.permissions import IsManagerOrReadOnly, IsOwnerOrResidentReadOnly

class CanHoViewSet(viewsets.ModelViewSet):
    queryset = CanHo.objects.all()
    serializer_class = CanHoSerializer
    permission_classes = [IsManagerOrReadOnly]

class CuDanViewSet(viewsets.ModelViewSet):
    queryset = CuDan.objects.all()
    serializer_class = CuDanSerializer
    permission_classes = [IsManagerOrReadOnly]

    @action(detail=True, methods=['post'], url_path='move-in')
    def move_in(self, request, pk=None):
        # Logic chuyển đến
        cu_dan = self.get_object()
        can_ho_id = request.data.get('can_ho_id')
        cu_dan.ma_can_ho_dang_o_id = can_ho_id
        cu_dan.save()
        
        BienDongDanCu.objects.create(
            ma_cu_dan=cu_dan, 
            loai_bien_dong='NHAP_KHAU',
            ghi_chu=f'Chuyển vào căn hộ ID {can_ho_id}'
        )
        return Response({'status': 'moved in'})