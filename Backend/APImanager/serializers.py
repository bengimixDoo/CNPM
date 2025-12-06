from rest_framework import serializers
from .models import HoKhau

class HoKhauSerializer(serializers.ModelSerializer):
    class Meta:
        model = HoKhau
        fields = '__all__'

    def validate_MaHoKhau(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Mã Hộ Khẩu chỉ được chứa chữ số.")
        
        if len(value) != 9:
            raise serializers.ValidationError("Mã Hộ Khẩu phải có đúng 9 chữ số.")
            
        return value
    
    def validate(self, data):
        ngay_lap = data.get('NgayLap')
        ngay_chuyen_di = data.get('NgayChuyenDi')

        # Xử lý trường hợp có thể là cập nhật (PATCH) nên một trong hai trường không có
        # Hoặc một trong hai trường là NULL/None trong DB
        
        # Lấy giá trị hiện tại của đối tượng nếu là CẬP NHẬT (PATCH/PUT)
        if self.instance:
            if ngay_lap is None:
                ngay_lap = self.instance.NgayLap
            if ngay_chuyen_di is None:
                ngay_chuyen_di = self.instance.NgayChuyenDi
        
        # Chỉ kiểm tra khi cả NgayLap và NgayChuyenDi đều có giá trị (không phải None)
        if ngay_lap and ngay_chuyen_di:
            if ngay_chuyen_di < ngay_lap:
                raise serializers.ValidationError({
                    'NgayChuyenDi': "Ngày Chuyển Đi không được trước Ngày Lập Hộ Khẩu."
                })
            
        return data
    
class HoKhauHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = HoKhau.history.model # Lấy Model lịch sử tự động tạo
        fields = '__all__'