from rest_framework import serializers
from .models import PhuongTien, YeuCau, TinTuc

class PhuongTienSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhuongTien
        fields = '__all__'

class YeuCauSerializer(serializers.ModelSerializer):
    nguoi_gui = serializers.CharField(source='cu_dan.ho_ten', read_only=True)
    
    class Meta:
        model = YeuCau
        fields = ['id', 'cu_dan', 'nguoi_gui', 'tieu_de', 'noi_dung', 'trang_thai', 'phan_hoi_bql', 'ngay_gui']
        read_only_fields = ['trang_thai', 'phan_hoi_bql', 'cu_dan'] # Cư dân không được tự sửa trạng thái

class TinTucSerializer(serializers.ModelSerializer):
    ten_nguoi_dang = serializers.CharField(source='nguoi_dang.username', read_only=True)

    class Meta:
        model = TinTuc
        fields = ['id', 'tieu_de', 'noi_dung', 'nguoi_dang', 'ten_nguoi_dang', 'ngay_dang']