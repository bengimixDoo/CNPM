from django.test import TestCase
from .models import DanhMucPhi, HoaDon, ChiTietHoaDon
from residents.models import CanHo

class FinanceTests(TestCase):
    def setUp(self):
        self.can_ho = CanHo.objects.create(
            phong='B202', tang=2, toa_nha='B', dien_tich=80.0, trang_thai='Trong'
        )
        self.loai_phi = DanhMucPhi.objects.create(
            ten_loai_phi='Phi Quan Ly', dong_gia_hien_tai=5000, don_vi_tinh='m2'
        )

    def test_create_hoa_don(self):
        hoa_don = HoaDon.objects.create(
            can_ho=self.can_ho, thang=12, nam=2025, tong_tien=400000
        )
        self.assertEqual(hoa_don.can_ho, self.can_ho)
        self.assertEqual(hoa_don.thang, 12)

    def test_create_chi_tiet_hoa_don(self):
        hoa_don = HoaDon.objects.create(
            can_ho=self.can_ho, thang=12, nam=2025
        )
        chi_tiet = ChiTietHoaDon.objects.create(
            hoa_don=hoa_don,
            loai_phi=self.loai_phi,
            ten_phi_snapshot='Phi Quan Ly',
            so_luong=80,
            dong_gia_snapshot=5000,
            thanh_tien=400000
        )
        self.assertEqual(chi_tiet.thanh_tien, 400000)
