from rest_framework import serializers
from .models import PhuongTien, ChiSoDienNuoc, TinTuc, YeuCau

class PhuongTienSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhuongTien
        fields = '__all__'

    def validate(self, data):
        # Lấy giá trị từ data (trường hợp update có thể một số trường không có trong data)
        loai_xe = data.get('loai_xe')
        bien_so = data.get('bien_so')
        if self.instance:
            loai_xe = loai_xe or self.instance.loai_xe
            bien_so = bien_so or self.instance.bien_so

        # Logic: Ô tô (C) hoặc Xe máy (M) thì không được để trống biển số
        if loai_xe in ['C', 'M'] and not bien_so:
            raise serializers.ValidationError({
                "bien_so": f"Phương tiện loại '{dict(PhuongTien.LOAI_XE_CHOICES).get(loai_xe)}' bắt buộc phải có biển số xe."
            })

        return data

class ChiSoDienNuocSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChiSoDienNuoc
        fields = '__all__'

class TinTucSerializer(serializers.ModelSerializer):
    class Meta:
        model = TinTuc
        fields = '__all__'
        read_only_fields = ['nguoi_dang', 'ngay_dang']

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
        # Nếu là thao tác cập nhật (update)
        if self.instance:
            current_status = self.instance.trang_thai

            if current_status != value:
                # 1. Cư dân chỉ được phép đổi sang 'C' (Hủy)
                if value != 'C':
                    raise serializers.ValidationError("Cư dân chỉ có quyền chuyển trạng thái sang 'Hủy'.")

                # 2. Chỉ được hủy nếu trạng thái hiện tại là 'W' (Chờ xử lý)
                if current_status != 'W':
                    raise serializers.ValidationError("Chỉ có thể hủy yêu cầu khi đang ở trạng thái 'Chờ xử lý'.")
        # Nếu là tạo mới (create)
        else:
            if value != 'W':
                raise serializers.ValidationError("Trạng thái khi tạo yêu cầu phải là 'Chờ xử lý'.")
        return value

class QuanLyYeuCauSerializer(serializers.ModelSerializer):
    class Meta:
        model = YeuCau
        fields = '__all__'
        # Quản lý không sửa nội dung yêu cầu của dân
        read_only_fields = ['cu_dan', 'tieu_de', 'noi_dung', 'ngay_gui']

    def validate_trang_thai(self, value):
        if self.instance:
            current_status = self.instance.trang_thai
            if current_status == 'C':
                raise serializers.ValidationError("Yêu cầu đã bị hủy, không thể thay đổi trạng thái.")
        return value

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