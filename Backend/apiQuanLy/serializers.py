from datetime import date
from rest_framework import serializers
from .models import CanHo

class CanHoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanHo
        fields = '__all__'
    
    def validate(self, data):
        # Lấy trạng thái từ dữ liệu mới (hoặc dữ liệu cũ nếu là cập nhật)
        # Sử dụng .get() để lấy dữ liệu mới, nếu không có (trường không được gửi) thì lấy từ instance
        
        # 1. Xác định trạng thái mới: 
        # Nếu là UPDATE, kiểm tra data.get('TrangThai'). Nếu không có, dùng self.instance.TrangThai.
        # Nếu là CREATE, dùng data.get('TrangThai').
        
        trang_thai = data.get('TrangThai', None)
        if trang_thai is None and self.instance:
            trang_thai = self.instance.TrangThai
        
        # 2. Kiểm tra điều kiện ràng buộc
        if trang_thai == 'A':
            ma_chu_so_huu = data.get('MaChuSoHuu', self.instance.MaChuSoHuu if self.instance else None)
            # print( "MA CHU SO HUU:", ma_chu_so_huu)
            ngay_ban_giao = data.get('NgayBanGiao', self.instance.NgayBanGiao if self.instance else None)
            
            errors = {}
            
            # Kiểm tra MaChuSoHuu
            if ma_chu_so_huu is not None:
                errors['MaChuSoHuu'] = 'Căn hộ Trống không được có Chủ Sở Hữu.'
                
            # Kiểm tra NgayBanGiao
            if ngay_ban_giao is not None:
                errors['NgayBanGiao'] = 'Căn hộ Trống không được có Ngày Bàn Giao.'

            if errors:
                # Ném ValidationError với chi tiết từng trường
                raise serializers.ValidationError(errors)
        else:
            pass   
        # 1. Lấy mã căn hộ hiện tại đang được xử lý
        # Nếu đang tạo (POST), MaCanHo sẽ nằm trong data['MaCanHo'] (hoặc trường khóa chính của CanHo)
        # Nếu đang cập nhật (PUT/PATCH), MaCanHo lấy từ instance (nếu có), nếu không lấy từ data
        
        # Nếu MaCanHo là trường khóa chính của CanHo:
        # ma_can_ho = data.get('MaCanHo', self.instance.MaCanHo if self.instance else None)
        
        # # Lấy MaChuSoHuu từ dữ liệu đầu vào
        # ma_chu_so_huu = data.get('MaChuSoHuu', self.instance.MaChuSoHuu_id if self.instance else None)
        # ma_chu_so_huu = data.get('MaChuSoHuu', getattr(self.instance, 'MaChuSoHuu_id', None))
        # print("MA CHU SO HUU:", ma_chu_so_huu)
        # ma_chu_so_huu = self.initial_data.get('MaChuSoHuu', None)
        # if self.instance:
        #     ma_chu_so_huu = self.instance.MaChuSoHuu_id
        # print("MA CHU SO HUU:", ma_chu_so_huu)

        # if self.instance:
        #     # KIỂM TRA 1: Truy cập đối tượng
        #     print(f"Giá trị self.instance.MaChuSoHuu: {self.instance.MaChuSoHuu}")
            
        #     # KIỂM TRA 2: Truy cập ID
        #     print(f"Giá trị self.instance.MaChuSoHuu_id: {self.instance.MaChuSoHuu_id}")

        # print(f"Giá trị ma_chu_so_huu từ data: {self.initial_data.get('MaChuSoHuu')}")
        # print(f"Giá trị ma_chu_so_huu_id từ data: {data.get('MaChuSoHuu_id', None)}")
        

        # if ma_chu_so_huu:
        #     try:
        #         # 2. Tìm kiếm đối tượng CuDan dựa trên MaChuSoHuu (giả sử MaChuSoHuu tương ứng với khóa chính/ID của CuDan)
        #         chu_so_huu = CuDan.objects.get(pk=ma_chu_so_huu)
        #     except CuDan.DoesNotExist:
        #         raise serializers.ValidationError(
        #             {"MaChuSoHuu": "Mã Chủ Sở Hữu không tồn tại trong danh sách Cư Dân."}
        #         )

        #     # 3. Kiểm tra điều kiện MaCanHoDangO của CuDan phải giống MaCanHo
        #     if chu_so_huu.MaCanHoDangO_id != ma_can_ho:
        #         raise serializers.ValidationError(
        #             {"MaChuSoHuu": f"Người có mã {ma_chu_so_huu} không ở tại căn hộ {ma_can_ho}."}
        #         )
            
        #     # 4. Kiểm tra điều kiện QuanHeVoiChuHo = 'CH' (Chủ Hộ)
        #     if chu_so_huu.QuanHeVoiChuHo != 'CH':
        #         raise serializers.ValidationError(
        #             {"MaChuSoHuu": "Người được chọn làm Chủ Sở Hữu phải có Quan Hệ Với Chủ Hộ là 'CH'."}
        #         )
                
        return data
    
class CanHoHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CanHo.history.model # Lấy Model lịch sử tự động tạo
        fields = '__all__'

from .models import CuDan

class CuDanSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuDan
        fields = '__all__'

    def validate_SoCCCD(self, value):
        # Kiểm tra độ dài
        if len(value) != 12:
            raise serializers.ValidationError("Số CCCD phải có đúng 12 chữ số.")
            
        # Kiểm tra tất cả có phải là chữ số
        if not value.isdigit():
            raise serializers.ValidationError("Số CCCD chỉ được chứa chữ số (0-9).")
        
        # Nếu validation thành công, trả về giá trị
        return value
    
    def validate_SoDienThoai(self, value):
        # Kiểm tra độ dài
        if not value:
            return value  # Cho phép để trống nếu không bắt buộc

        if len(value) < 10 or len(value) > 15:
            raise serializers.ValidationError("Số Điện Thoại phải có từ 10 đến 15 chữ số.")
            
        # Kiểm tra tất cả có phải là chữ số
        if not value.isdigit():
            raise serializers.ValidationError("Số Điện Thoại chỉ được chứa chữ số (0-9).")
        
        # Nếu validation thành công, trả về giá trị
        return value
    
    def validate_NgaySinh(self, value):
        """
        Kiểm tra Ngày sinh không được lớn hơn ngày hiện tại.
        (Giá trị 'value' ở đây là một đối tượng date của Python).
        """
        if value > date.today():
            raise serializers.ValidationError("Ngày sinh không được lớn hơn ngày hiện tại.")
        
        return value

class CuDanHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CuDan.history.model # Lấy Model lịch sử tự động tạo
        fields = '__all__'