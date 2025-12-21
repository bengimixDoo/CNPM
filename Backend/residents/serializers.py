from datetime import date
from rest_framework import serializers
from .models import CanHo, CuDan, BienDongDanCu

class CanHoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanHo
        fields = '__all__'
        read_only_fields = ['chu_so_huu']

    def validate(self, data):
        # Không cho chuyển sang Trống nếu còn cư dân đang ở
        # Lấy trạng thái mới từ request (nếu có)
        trang_thai_moi = data.get('trang_thai')
        # Chỉ kiểm tra nếu người dùng muốn chuyển sang trạng thái 'E' (Trống)
        if trang_thai_moi == 'E':
            # Nếu là cập nhật (PUT/PATCH), self.instance sẽ tồn tại
            if self.instance:
                # Kiểm tra xem có cư dân nào đang ở căn hộ này không
                # 'cu_dan_hien_tai' là related_name từ model CuDan
                dang_co_nguoi = self.instance.cu_dan_hien_tai.exists()
                if dang_co_nguoi:
                    raise serializers.ValidationError({
                        "trang_thai": "Căn hộ này hiện đang có cư dân sinh sống. "
                                      "Không được phép chuyển trạng thái về 'Trống'."
                    })
        
        return data

class CanHoHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CanHo.history.model # Lấy Model lịch sử tự động tạo
        fields = '__all__'

class CuDanSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuDan
        fields = '__all__'

    def validate_so_cccd(self, value):
        if len(value) != 12 or not value.isdigit():
            raise serializers.ValidationError("Số CCCD phải có đúng 12 chữ số.")
        return value

    def validate_so_dien_thoai(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Số điện thoại chỉ được chứa các chữ số.")
        return value
    
    def validate_ngay_sinh(self, value):
        if value > date.today():
            raise serializers.ValidationError("Ngày sinh không hợp lệ vì vượt quá ngày hiện tại.")
        return value

    def validate(self, data):
        # 1. Lấy thông tin căn hộ từ dữ liệu gửi lên (cho POST/PUT)
        # Hoặc từ instance hiện tại (cho PATCH nếu không gửi field này lên)
        can_ho = data.get('can_ho_dang_o')
        if not can_ho and self.instance:
            can_ho = self.instance.can_ho_dang_o
        
        # Nếu lấy id
        ma_id = can_ho.pk if can_ho else None

        # 2. Kiểm tra điều kiện: Căn hộ không được ở trạng thái 'E' (Trống)
        if can_ho and can_ho.trang_thai == 'E':
            raise serializers.ValidationError({
                "can_ho_dang_o": "Không thể thêm cư dân vào căn hộ đang có trạng thái 'Trống'. "
                                 "Vui lòng cập nhật trạng thái căn hộ sang 'Đã bán' hoặc 'Đang thuê' trước."
            })

        # Lấy trạng thái cư trú từ dữ liệu gửi lên
        trang_thai = data.get('trang_thai_cu_tru')

        # RÀNG BUỘC: Chỉ áp dụng khi TẠO MỚI cư dân
        # Trong DRF, self.instance là None nếu là thao tác POST (tạo mới)
        if not self.instance:
            if trang_thai not in ['TT', 'TH']:
                raise serializers.ValidationError({
                    "trang_thai_cu_tru": "Khi tạo cư dân mới, trạng thái cư trú bắt buộc phải là 'Tạm Trú' hoặc 'Thường Trú'."
                })
        
        if self.instance:
            trang_thai = trang_thai or self.instance.trang_thai_cu_tru
        # RÀNG BUỘC: Nếu là TH, TT, TV thì BẮT BUỘC phải có căn hộ
        labels = dict(CuDan.TRANG_THAI_CHOICES)
        if trang_thai in ['TH', 'TT', 'TV'] and can_ho is None:
            raise serializers.ValidationError({
                "can_ho_dang_o": f"Cư dân ở trạng thái '{labels.get(trang_thai)}' bắt buộc phải được gắn với một căn hộ."
            })

        # RÀNG BUỘC 2: Nếu là OUT thì căn hộ PHẢI là NULL
        if trang_thai == 'OUT' and can_ho is not None:
            raise serializers.ValidationError({
                "can_ho_dang_o": "Cư dân đã chuyển đi (OUT) không thể tiếp tục gắn với căn hộ."
            })
        
        return data
    

class CuDanHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CuDan.history.model # Lấy Model lịch sử tự động tạo
        fields = '__all__'

class BienDongDanCuSerializer(serializers.ModelSerializer):
    class Meta:
        model = BienDongDanCu
        fields = '__all__'

    def validate_ngay_thuc_hien(self, value):
        if value > date.today():
            raise serializers.ValidationError("Ngày thực hiện không hợp lệ vì vượt quá ngày hiện tại.")
        return value
    
class BienDongDanCuHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BienDongDanCu.history.model
        fields = '__all__'