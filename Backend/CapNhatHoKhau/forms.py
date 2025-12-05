from django import forms
from .models import HoKhau

class HoKhauForm(forms.ModelForm):
    class Meta:
        model = HoKhau
        # Liệt kê tất cả các trường bạn muốn người dùng nhập/sửa
        fields = [
            'MaHoKhau', 
            'DiaChi', 
            'NgayLap', 
            'NgayChuyenDi', 
            'LyDoChuyenDi', 
            'DienTichHo', 
            'SoXeMay', 
            'SoOto', 
            'SoXeDap'
        ]
        widgets = {
            'NgayLap': forms.DateInput(
                # Vì bạn muốn giữ YYYY-MM-DD, không cần format tùy chỉnh
                # format='%Y-%m-%d', 
                attrs={
                    # Đặt type là 'date' (mặc định) để bật bộ chọn lịch của trình duyệt 
                    # hoặc dùng 'text' nếu bạn không muốn dùng bộ chọn lịch
                    'type': 'date', 
                    
                    # Thêm Placeholder để hướng dẫn người dùng
                    # 'placeholder': 'yyyy-mm-dd' 
                }
            ),
            
            'NgayChuyenDi': forms.DateInput(
                attrs={
                    'type': 'date',
                    # Thêm Placeholder cho trường khác
                    # 'placeholder': 'yyyy-mm-dd'
                }
            ),
            # Lặp lại cho tất cả các trường DateField khác
        }
        labels = {
            'MaHoKhau': 'Mã Hộ Khẩu',
            'DiaChi': 'Địa chỉ thường trú',
            'NgayLap': 'Ngày lập',
            'NgayChuyenDi': 'Ngày chuyển đi',
            'LyDoChuyenDi': 'Lý do chuyển đi',
            'DienTichHo': 'Diện tích hộ',
            'SoXeMay': 'Số xe máy',
            'SoOto': 'Số ô tô',
            'SoXeDap': 'Số xe đạp',
        }
        help_texts = {
            'MaHoKhau': 'Mã Hộ Khẩu phải có đúng 9 chữ số.',
        }
        
    # ==============================================================
    # PHƯƠNG THỨC KIỂM TRA LOGIC TỔNG THỂ (NgayChuyenDi vs NgayLap)
    # ==============================================================
    def clean(self):
        # Bước 1: Gọi hàm clean() gốc để làm sạch từng trường và lấy dữ liệu
        cleaned_data = super().clean()

        # Bước 2: Lấy dữ liệu đã được làm sạch của hai trường
        # Django sẽ tự động chuyển đổi chuỗi ngày thành đối tượng date/datetime
        ngay_lap = cleaned_data.get("NgayLap")
        ngay_chuyen_di = cleaned_data.get("NgayChuyenDi")

        # Bước 3: Kiểm tra nếu cả hai trường đều có dữ liệu
        if ngay_lap and ngay_chuyen_di:
            # Bước 4: So sánh logic
            if ngay_chuyen_di < ngay_lap:
                # Bước 5: Nếu ngày chuyển đi xảy ra trước ngày lập, báo lỗi
                
                # Báo lỗi toàn Form (hiện trên cùng)
                # raise forms.ValidationError(
                #     "Ngày chuyển đi không được nhỏ hơn Ngày lập."
                # )
                
                # Hoặc Báo lỗi gắn vào trường NgayChuyenDi (Khuyến nghị)
                self.add_error(
                    'NgayChuyenDi', # Tên trường cần gắn lỗi
                    "Ngày chuyển đi phải bằng hoặc sau Ngày lập."
                )

        # Bước 6: Trả về dữ liệu đã được làm sạch
        return cleaned_data
    
    def clean_MaHoKhau(self):
        ma_hk = self.cleaned_data.get('MaHoKhau')
        
        if len(ma_hk) != 9:
            raise forms.ValidationError("Mã Hộ Khẩu phải có đúng 9 chữ số.")
            
        # Kiểm tra thêm nếu cần
        if not ma_hk.isdigit():
             raise forms.ValidationError("Mã Hộ Khẩu chỉ được chứa chữ số.")
             
        return ma_hk
    
