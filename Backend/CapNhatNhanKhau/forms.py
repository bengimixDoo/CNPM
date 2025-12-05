from django import forms

from .models import NhanKhau
from CapNhatHoKhau.models import HoKhau

class NhanKhauForm(forms.ModelForm):
    # Thêm trường MaHoKhau cho HoKhau vào form
    # Dùng widget Select để người dùng chọn từ các HoKhau đã có
    MaHoKhau = forms.ModelChoiceField(
        queryset=HoKhau.objects.all(),
        label="Mã Hộ Khẩu",
        empty_label="Chọn Hộ Khẩu",
        # Đảm bảo trường này được map đúng khi save form
        to_field_name="MaHoKhau" 
    )
    
    class Meta:
        model = NhanKhau
        # Liệt kê tất cả các trường bạn muốn hiển thị trong form
        fields = [
            'MaHoKhau', 
            'SoCCCD', 
            'HoTen', 
            'Tuoi', 
            'GioiTinh', 
            'SoDT', 
            'QuanHe', 
            'TamVang', 
            'TamTru'
        ]
        labels = {
            'MaHoKhau': 'Mã Hộ Khẩu',
            'SoCCCD': 'Số CCCD',
            'HoTen': 'Họ và Tên',
            'Tuoi': 'Tuổi',
            'GioiTinh': 'Giới Tính',
            'SoDT': 'Số Điện Thoại',
            'QuanHe': 'Quan Hệ',
            'TamVang': 'Tạm Vắng',
            'TamTru': 'Tạm Trú',
        }
        help_texts = {
            # Thêm hướng dẫn cho người dùng
            'SoCCCD': 'Đảm bảo nhập đúng 12 chữ số.',
        }

