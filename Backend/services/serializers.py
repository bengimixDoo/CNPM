from rest_framework import serializers
from .models import TinTuc, YeuCau, PhuongTien



class TinTucSerializer(serializers.ModelSerializer):
    """
    Serializer cho Tin tức/Thông báo.
    """
    nguoi_dang_ten = serializers.ReadOnlyField(source='nguoi_dang.username')

    class Meta:
        model = TinTuc
        fields = ['ma_tin', 'tieu_de', 'noi_dung', 'nguoi_dang', 'nguoi_dang_ten', 'ngay_dang']
        read_only_fields = ['nguoi_dang', 'ngay_dang']

class YeuCauSerializer(serializers.ModelSerializer):
    """
    Serializer cho Yêu cầu/Phản ánh.
    """
    cu_dan_ten = serializers.ReadOnlyField(source='cu_dan.ho_ten')

    class Meta:
        model = YeuCau
        fields = ['ma_yeu_cau', 'cu_dan', 'cu_dan_ten', 'tieu_de', 'noi_dung', 'trang_thai', 'phan_hoi_bql', 'ngay_gui']
        read_only_fields = ['cu_dan', 'ngay_gui']

class PhuongTienSerializer(serializers.ModelSerializer):
    """
    Serializer cho Phương tiện.
    """
    class Meta:
        model = PhuongTien
        fields = '__all__'
