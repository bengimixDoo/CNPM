from rest_framework import serializers
from .models import CanHo, CuDan, BienDongDanCu

class CuDanSerializer(serializers.ModelSerializer):
    """
    Serializer cho Cư dân.
    """
    class Meta:
        model = CuDan
        fields = '__all__'

class CanHoSerializer(serializers.ModelSerializer):
    """
    Serializer cho Căn hộ.
    Có thể include danh sách cư dân đang ở nếu cần (nhưng nên xử lý ở View để check quyền).
    """
    class Meta:
        model = CanHo
        fields = '__all__'

class CanHoDetailSerializer(serializers.ModelSerializer):
    """
    Serializer chi tiết cho Căn hộ, bao gồm danh sách cư dân đang ở.
    Dùng cho view Retrieve.
    """
    cu_dan_hien_tai = CuDanSerializer(many=True, read_only=True)

    class Meta:
        model = CanHo
        fields = '__all__'

class BienDongDanCuSerializer(serializers.ModelSerializer):
    """
    Serializer cho Biến động dân cư (Lịch sử chuyển đến/đi).
    """
    cu_dan_ten = serializers.ReadOnlyField(source='cu_dan.ho_ten')

    class Meta:
        model = BienDongDanCu
        fields = ['ma_bien_dong', 'cu_dan', 'cu_dan_ten', 'loai_bien_dong', 'ngay_thuc_hien']

class MoveInSerializer(serializers.Serializer):
    """
    Serializer input cho nghiệp vụ Chuyển đến.
    """
    apartment_id = serializers.IntegerField(required=True)
    # role_in_house chưa có trong model CuDan (ví dụ: Chủ hộ, Thành viên...), 
    # nhưng có thể dùng field la_chu_ho để set.
    la_chu_ho = serializers.BooleanField(default=False)
