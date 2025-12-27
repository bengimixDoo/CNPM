from rest_framework import serializers
from .models import DanhMucPhi, HoaDon, ChiTietHoaDon
from services.models import ChiSoDienNuoc

class FinanceChiSoDienNuocSerializer(serializers.ModelSerializer):
    """
    Serializer cho Chỉ số điện nước.
    """
    class Meta:
        model = ChiSoDienNuoc
        fields = '__all__'

class DanhMucPhiSerializer(serializers.ModelSerializer):
    """
    Serializer cho Danh mục phí.
    """
    class Meta:
        model = DanhMucPhi
        fields = '__all__'

class ChiTietHoaDonSerializer(serializers.ModelSerializer):
    """
    Serializer cho Chi tiết hóa đơn (các dòng phí).
    """
    class Meta:
        model = ChiTietHoaDon
        fields = '__all__'

class HoaDonSerializer(serializers.ModelSerializer):
    """
    Serializer cho Hóa đơn.
    Include chi tiết hóa đơn (nested) khi xem chi tiết.
    """
    chi_tiet = ChiTietHoaDonSerializer(many=True, read_only=True)
    can_ho_info = serializers.CharField(source='can_ho.ma_hien_thi', read_only=True)

    class Meta:
        model = HoaDon
        fields = ['ma_hoa_don', 'can_ho', 'can_ho_info', 'thang', 'nam', 'tong_tien', 'trang_thai', 'ngay_tao', 'chi_tiet']

class BatchGenerateSerializer(serializers.Serializer):
    """
    Input cho việc tạo hóa đơn hàng loạt.
    """
    thang = serializers.IntegerField(min_value=1, max_value=12)
    nam = serializers.IntegerField(min_value=2000)

class RevenueStatsSerializer(serializers.Serializer):
    thang = serializers.IntegerField()
    phat_sinh = serializers.DecimalField(max_digits=15, decimal_places=2)
    thuc_thu = serializers.DecimalField(max_digits=15, decimal_places=2)

class RevenueStatsResponseSerializer(serializers.Serializer):
    nam = serializers.IntegerField()
    data = RevenueStatsSerializer(many=True)