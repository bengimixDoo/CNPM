from rest_framework import serializers
from .models import DanhMucPhi, ChiSoDienNuoc, HoaDon, ChiTietHoaDon

class DanhMucPhiSerializer(serializers.ModelSerializer):
    class Meta:
        model = DanhMucPhi
        fields = '__all__'

class ChiSoDienNuocSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChiSoDienNuoc
        fields = '__all__'

class ChiTietHoaDonSerializer(serializers.ModelSerializer):
    # Hiển thị tên phí thay vì chỉ hiện ID
    ten_phi = serializers.CharField(source='danh_muc_phi.ten_loai_phi', read_only=True)
    
    class Meta:
        model = ChiTietHoaDon
        fields = ['id', 'danh_muc_phi', 'ten_phi', 'ten_phi_snapshot', 'so_luong', 'don_gia_snapshot', 'thanh_tien']

class HoaDonSerializer(serializers.ModelSerializer):
    # Nested Serializer: Để khi get Hóa đơn sẽ thấy luôn list chi tiết bên trong
    chi_tiet = ChiTietHoaDonSerializer(many=True, read_only=True)
    ten_can_ho = serializers.CharField(source='can_ho.ma_hien_thi', read_only=True)

    class Meta:
        model = HoaDon
        fields = ['id', 'can_ho', 'ten_can_ho', 'thang', 'nam', 'tong_tien', 'trang_thai', 'ngay_tao', 'ngay_thanh_toan', 'chi_tiet']