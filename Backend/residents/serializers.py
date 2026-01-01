from datetime import date
from rest_framework import serializers
from .models import CanHo, CuDan, BienDongDanCu


class ThongTinCuDanRutGonSerializer(serializers.ModelSerializer):
    """
    Serializer rút gọn dùng để hiển thị thông tin cư dân bên trong Căn hộ
    """
    class Meta:
        model = CuDan
        fields = ['ma_cu_dan', 'ho_ten', 'ngay_sinh', 'so_dien_thoai', 'so_cccd', 'la_chu_ho', 'trang_thai_cu_tru']

class CanHoSerializer(serializers.ModelSerializer):
    # Field hiển thị thông tin chi tiết (Read-only)
    chu_so_huu_info = ThongTinCuDanRutGonSerializer(source='chu_so_huu', read_only=True)
    danh_sach_cu_dan = ThongTinCuDanRutGonSerializer(source='cu_dan_hien_tai', many=True, read_only=True)

    class Meta:
        model = CanHo
        fields = [
            'ma_can_ho', 'phong', 'tang', 'toa_nha', 'dien_tich', 
            'trang_thai', 'chu_so_huu', # Giữ lại field ID gốc để POST/PUT dễ dàng
            'chu_so_huu_info', 'danh_sach_cu_dan' # Fields thông tin chi tiết
        ]
        read_only_fields = ['chu_so_huu', 'chu_so_huu_info', 'danh_sach_cu_dan']
        # Lưu ý: chu_so_huu là read_only theo yêu cầu cũ, nếu muốn đổi chủ phải dùng API riêng hoặc set lại read_only_fields

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
        # QUAN TRỌNG: Phải check key tồn tại, không phải check giá trị
        # Vì None/null là giá trị hợp lệ khi OUT
        if 'can_ho_dang_o' in data:
            can_ho = data.get('can_ho_dang_o')
        elif self.instance:
            can_ho = self.instance.can_ho_dang_o
        else:
            can_ho = None
        
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
    cu_dan = CuDanSerializer(read_only=True)
    can_ho = CanHoSerializer(read_only=True)
    
    class Meta:
        model = BienDongDanCu
        fields = '__all__'

    def validate_ngay_thuc_hien(self, value):
        if value > date.today():
            raise serializers.ValidationError("Ngày thực hiện không hợp lệ vì vượt quá ngày hiện tại.")
        return value
    
    def validate(self, attrs):
        # Lấy dữ liệu mới từ attrs, nếu không có thì lấy từ instance cũ (khi PATCH)
        loai = attrs.get('loai_bien_dong', getattr(self.instance, 'loai_bien_dong', None))
        cu_dan = attrs.get('cu_dan', getattr(self.instance, 'cu_dan', None))
        can_ho_moi = attrs.get('can_ho', getattr(self.instance, 'can_ho', None))

        if cu_dan and loai:
            # Nếu trạng thái hiện tại của cư dân giống hệt loại biến động mới
            ten_trang_thai = cu_dan.get_trang_thai_cu_tru_display()
            if cu_dan.trang_thai_cu_tru == loai:
                # Riêng trường hợp chuyển đi (OUT) thì có thể cho phép hoặc báo lỗi tùy quy trình
                # Ở đây chúng ta chặn tất cả các trường hợp trùng tên trạng thái
                raise serializers.ValidationError({
                    "loai_bien_dong": f"Cư dân hiện đã ở trạng thái '{ten_trang_thai}'. Không thể đăng ký biến động trùng với trạng thái hiện tại."
                })
            if loai in ['TV', 'OUT']:
                # Đảm bảo cu_dan và can_ho_moi tồn tại để kiểm tra
                if cu_dan.can_ho_dang_o != can_ho_moi:
                    raise serializers.ValidationError(
                        f"Lỗi: Cư dân hiện đang ở căn hộ {cu_dan.can_ho_dang_o}, "
                        f"không thể đăng ký {ten_trang_thai} tại căn hộ {can_ho_moi}."
                    )
        return attrs
    
class BienDongDanCuHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BienDongDanCu.history.model
        fields = '__all__'