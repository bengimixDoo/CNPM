from rest_framework import serializers
from .models import DanhMucPhi, HoaDon, ChiTietHoaDon, DotDongGop, DongGop
from residents.serializers import CanHoSerializer
from services.models import ChiSoDienNuoc

class FeeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DanhMucPhi
        fields = '__all__'

class InvoiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChiTietHoaDon
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    chi_tiet = InvoiceDetailSerializer(many=True, read_only=True)
    # Nested serializer for display, PrimaryKey related for write if needed
    
    class Meta:
        model = HoaDon
        fields = '__all__'

class FinanceChiSoDienNuocSerializer(serializers.ModelSerializer):
    """
    Serializer cho ChiSoDienNuoc (Finance App)
    Dùng để Kế toán xem/nhập chỉ số khi tính tiền
    """
    class Meta:
        model = ChiSoDienNuoc
        fields = '__all__'

class RevenueStatsSerializer(serializers.Serializer):
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)

class BatchGenerateSerializer(serializers.Serializer):
    thang = serializers.IntegerField(min_value=1, max_value=12)
    nam = serializers.IntegerField(min_value=2000)

class RevenueStatsResponseSerializer(serializers.Serializer):
    thang = serializers.CharField()
    phat_sinh = serializers.DecimalField(max_digits=14, decimal_places=2)
    thuc_thu = serializers.DecimalField(max_digits=14, decimal_places=2)

class DotDongGopSerializer(serializers.ModelSerializer):
    tong_tien_dong_gop = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    so_luot_dong_gop = serializers.IntegerField(read_only=True)

    class Meta:
        model = DotDongGop
        fields = '__all__'

class DongGopSerializer(serializers.ModelSerializer):
    ten_can_ho = serializers.CharField(source='can_ho.ma_can_ho', read_only=True)
    ten_dot = serializers.CharField(source='dot_dong_gop.ten_dot', read_only=True)
    trang_thai = serializers.CharField(read_only=True) # Chỉ Admin mới được duyệt/Cư dân phản hồi qua action

    class Meta:
        model = DongGop
        fields = '__all__'
        read_only_fields = ['ngay_dong', 'trang_thai'] # Admin cần nhập can_ho

class MonthlyExpenseSerializer(serializers.Serializer):
    ma_can_ho = serializers.CharField()
    chu_ho = serializers.CharField()
    thang = serializers.IntegerField()
    nam = serializers.IntegerField()
    tong_tien = serializers.DecimalField(max_digits=12, decimal_places=2)
    trang_thai = serializers.IntegerField() # 0: Chua thanh toan, 1: Da thanh toan