from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import CanHo, CuDan, BienDongDanCu
from django.db import IntegrityError
import json
from datetime import date

User = get_user_model()

class ApartmentManagementTests(APITestCase):
    def setUp(self):
        # 1. Khắc phục lỗi 401: Tạo và xác thực User
        self.user = User.objects.create_user(username='admin', password='password123')
        self.client.force_authenticate(user=self.user)

        # 2. Tạo dữ liệu mẫu: Căn hộ A101 (Đang thuê - H) và A102 (Trống - E)
        self.can_ho_h = CanHo.objects.create(
            phong="101", tang=1, toa_nha="A", trang_thai='H', dien_tich=100
        )
        self.can_ho_e = CanHo.objects.create(
            phong="102", tang=1, toa_nha="A", trang_thai='E', dien_tich=100
        )

        # 3. Tạo cư dân mẫu đang ở phòng 101
        self.cu_dan = CuDan.objects.create(
            ho_ten="Nguyen Van A",
            so_cccd="123456789012",
            so_dien_thoai="0912345678",
            can_ho_dang_o=self.can_ho_h,
            ngay_sinh=date(1990, 1, 1),
            gioi_tinh = 'M',
            trang_thai_cu_tru='TH',
            la_chu_ho=True
        )

        # Định nghĩa các URL dựa trên Router của bạn
        self.list_url = reverse('apartments-list')
        self.thong_ke_tong_quat_url = reverse('apartments-thong-ke') # url_path='thongke'
        self.detail_stats_url = lambda pk: reverse('apartments-thong-ke-chi-tiet-can-ho', kwargs={'pk': pk})
        self.history_url = lambda pk: reverse('apartments-history', kwargs={'pk': pk})

    def test_get_apartments_list(self):
        """Kiểm tra lấy danh sách căn hộ (Status 200)"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_aggregate_statistics(self):
        """Kiểm tra API thống kê tổng quát /apartments/thongke/"""
        response = self.client.get(self.thong_ke_tong_quat_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['tong_quan']['tong_so_can_ho'], 2)
        self.assertEqual(response.data['chi_tiet']['A']['trong'], 1)

    def test_apartment_detail_stats(self):
        """Kiểm tra API chi tiết nhân khẩu /apartments/{id}/detail/"""
        url = self.detail_stats_url(self.can_ho_h.pk)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['thong_ke_nhan_khau']['tong_so_nguoi'], 1)

    def test_constraint_no_resident_in_empty_apartment(self):
        """Ràng buộc: Không được thêm cư dân vào căn hộ trạng thái E (Trống)"""
        url = reverse('residents-list')
        data = {
            "ho_ten": "Nguoi dung loi",
            "so_cccd": "987654321098",
            "so_dien_thoai": "0888999888",
            "ngay_sinh": "2000-01-01",      # BỔ SUNG: Tránh lỗi required
            "gioi_tinh": "M",             # BỔ SUNG: Tránh lỗi required (hoặc mã code của bạn)
            "can_ho_dang_o": self.can_ho_e.pk, 
            "trang_thai_cu_tru": "TT"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("can_ho_dang_o", response.data)

    # def test_signal_auto_empty_apartment(self):
    #     """Ràng buộc: Khi cư dân cuối cùng chuyển đi (OUT), căn hộ tự động về E"""
    #     # Tạo biến động OUT cho cư dân duy nhất của phòng 101
    #     BienDongDanCu.objects.create(
    #         cu_dan=self.cu_dan,
    #         loai_bien_dong='OUT'
    #     )
        
    #     # Làm mới dữ liệu từ DB
    #     self.can_ho_h.refresh_from_db()
    #     self.assertEqual(self.can_ho_h.trang_thai, 'E')