from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import DanhMucPhi, ChiSoDienNuoc, HoaDon, ChiTietHoaDon
from residents.models import CanHo
from .serializers import HoaDonSerializer, ChiSoSerializer, DanhMucPhiSerializer
from core.permissions import IsManager

class HoaDonViewSet(viewsets.ModelViewSet):
    queryset = HoaDon.objects.all()
    serializer_class = HoaDonSerializer
    # Chỉ Manager được tạo/xóa, Cư dân xem cái của mình (sẽ xử lý ở get_queryset)
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'CU_DAN' and user.cu_dan_id:
            # Lấy ID căn hộ của user đó
            # (Giả sử bạn đã query lấy được list căn hộ của user)
            pass 
        return super().get_queryset()

    @action(detail=False, methods=['post'], url_path='batch-generate')
    @transaction.atomic
    def batch_generate(self, request):
        """Logic tạo hóa đơn hàng loạt cực quan trọng"""
        thang = request.data.get('thang')
        nam = request.data.get('nam')
        
        # 1. Lấy bảng giá hiện tại
        phi_dien = DanhMucPhi.objects.get(ten_loai_phi='DIEN')
        phi_nuoc = DanhMucPhi.objects.get(ten_loai_phi='NUOC')
        phi_ql = DanhMucPhi.objects.get(ten_loai_phi='QUAN_LY')

        generated_count = 0
        
        # 2. Loop qua các căn hộ đang có người ở
        can_hos = CanHo.objects.exclude(trang_thai='TRONG')
        
        for ch in can_hos:
            # Tạo Header Hóa Đơn
            hoa_don = HoaDon.objects.create(can_ho=ch, thang=thang, nam=nam)
            tong_tien = 0

            # Tính Điện
            cs_dien = ChiSoDienNuoc.objects.filter(can_ho=ch, thang=thang, nam=nam, loai_dich_vu='DIEN').first()
            if cs_dien:
                tien = cs_dien.so_tieu_thu * phi_dien.don_gia_hien_tai
                ChiTietHoaDon.objects.create(
                    hoa_don=hoa_don,
                    danh_muc_phi=phi_dien,
                    ten_phi_snapshot=phi_dien.ten_loai_phi,
                    so_luong=cs_dien.so_tieu_thu,
                    don_gia_snapshot=phi_dien.don_gia_hien_tai,
                    thanh_tien=tien
                )
                tong_tien += tien

            # Tính Phí Quản Lý (Diện tích * Đơn giá)
            tien_ql = float(ch.dien_tich) * float(phi_ql.don_gia_hien_tai)
            ChiTietHoaDon.objects.create(
                hoa_don=hoa_don,
                danh_muc_phi=phi_ql,
                ten_phi_snapshot=phi_ql.ten_loai_phi,
                so_luong=int(ch.dien_tich),
                don_gia_snapshot=phi_ql.don_gia_hien_tai,
                thanh_tien=tien_ql
            )
            tong_tien += tien_ql
            
            # Update Tổng tiền
            hoa_don.tong_tien = tong_tien
            hoa_don.save()
            generated_count += 1

        return Response({'msg': f'Đã tạo {generated_count} hóa đơn'})
    
class DanhMucPhiViewSet(viewsets.ModelViewSet):
    queryset = DanhMucPhi.objects.all()
    serializer_class = DanhMucPhiSerializer
    # Chỉ Admin được sửa giá, người khác chỉ xem
    permission_classes = [permissions.IsAuthenticated] 

class ChiSoDienNuocViewSet(viewsets.ModelViewSet):
    queryset = ChiSoDienNuoc.objects.all()
    serializer_class = ChiSoDienNuocSerializer
    permission_classes = [IsManager] # Chỉ Manager được nhập số