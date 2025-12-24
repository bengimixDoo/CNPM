from rest_framework import serializers
from .models import PhuongTien, ChiSoDienNuoc, TinTuc, YeuCau, DichVu

# --- 1. [MỚI] SERIALIZER BẢNG GIÁ DỊCH VỤ ---
# Bắt buộc phải có để Quản lý thêm/sửa bảng giá
class DichVuSerializer(serializers.ModelSerializer):
    class Meta:
        model = DichVu
        fields = '__all__'

# --- 2. SERIALIZER PHƯƠNG TIỆN ---
class PhuongTienSerializer(serializers.ModelSerializer):
    # loai_xe_display = serializers.CharField(source='get_loai_xe_display', read_only=True)
    ma_can_ho = serializers.CharField(source='can_ho.ma_can_ho', read_only=True)

    class Meta:
        model = PhuongTien
        fields = '__all__'

    def validate(self, data):
        loai_xe = data.get('loai_xe')
        bien_so = data.get('bien_so')
        if self.instance:
            loai_xe = loai_xe or self.instance.loai_xe
            bien_so = bien_so or self.instance.bien_so

        if loai_xe in ['C', 'M'] and not bien_so:
            raise serializers.ValidationError({
                "bien_so": f"Phương tiện loại '{dict(PhuongTien.LOAI_XE_CHOICES).get(loai_xe)}' bắt buộc phải có biển số xe."
            })
        return data

# --- 3. SERIALIZER CHỈ SỐ ĐIỆN NƯỚC ---
class ChiSoDienNuocSerializer(serializers.ModelSerializer):
    # loai_dich_vu_display = serializers.CharField(source='get_loai_dich_vu_display', read_only=True)
    ma_can_ho = serializers.CharField(source='can_ho.ma_can_ho', read_only=True)

    class Meta:
        model = ChiSoDienNuoc
        fields = '__all__'

# --- 4. SERIALIZER TIN TỨC ---
class TinTucSerializer(serializers.ModelSerializer):
    nguoi_dang_ten = serializers.CharField(source='nguoi_dang.username', read_only=True)
    class Meta:
        model = TinTuc
        fields = '__all__'
        read_only_fields = ['nguoi_dang', 'ngay_dang']

# --- 5. SERIALIZER YÊU CẦU (Giữ nguyên logic phân quyền của bạn) ---
class YeuCauSerializer(serializers.ModelSerializer):
    class Meta:
        model = YeuCau
        fields = '__all__'

class CuDanYeuCauSerializer(serializers.ModelSerializer):
    class Meta:
        model = YeuCau
        fields = ['ma_yeu_cau', 'tieu_de', 'noi_dung', 'trang_thai', 'phan_hoi_bql', 'ngay_gui']
        read_only_fields = ['phan_hoi_bql', 'ngay_gui']

    def validate_trang_thai(self, value):
        if self.instance:
            current_status = self.instance.trang_thai
            if current_status != value:
                if value != 'C':
                    raise serializers.ValidationError("Cư dân chỉ có quyền chuyển trạng thái sang 'Hủy'.")
                if current_status != 'W':
                    raise serializers.ValidationError("Chỉ có thể hủy yêu cầu khi đang ở trạng thái 'Chờ xử lý'.")
        else:
            if value != 'W':
                raise serializers.ValidationError("Trạng thái khi tạo yêu cầu phải là 'Chờ xử lý'.")
        return value
    
    def validate(self, data):
        user = self.context['request'].user
        cu_dan_profile = getattr(user, 'cu_dan', None)

        if not cu_dan_profile or cu_dan_profile.can_ho_dang_o is None:
            raise serializers.ValidationError(
                "Yêu cầu không thể gửi do bạn chưa có thông tin căn hộ đang cư trú."
            )
        
        return data

class QuanLyYeuCauSerializer(serializers.ModelSerializer):
    ten_cu_dan = serializers.CharField(source='cu_dan.ho_ten', read_only=True)
    ma_can_ho = serializers.CharField(source='cu_dan.can_ho.ma_can_ho', read_only=True)

    class Meta:
        model = YeuCau
        fields = '__all__'
        read_only_fields = ['cu_dan', 'tieu_de', 'noi_dung', 'ngay_gui']

    def validate_trang_thai(self, value):
        if self.instance:
            current_status = self.instance.trang_thai
            if current_status == 'C':
                raise serializers.ValidationError("Yêu cầu đã bị hủy, không thể thay đổi trạng thái.")
        return value

# --- 6. HISTORY SERIALIZERS ---
class PhuongTienHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PhuongTien.history.model
        fields = '__all__'

class ChiSoDienNuocHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChiSoDienNuoc.history.model
        fields = '__all__'

class TinTucHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TinTuc.history.model
        fields = '__all__'

class YeuCauHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = YeuCau.history.model
        fields = '__all__'