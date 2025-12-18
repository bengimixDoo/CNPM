from django.test import TestCase
from .models import CanHo, CuDan
from datetime import date

class ResidentTests(TestCase):
    def setUp(self):
        self.can_ho = CanHo.objects.create(
            ma_hien_thi='A101',
            tang=1,
            toa_nha='A',
            dien_tich=70.5,
            trang_thai='Trong'
        )

    def test_create_can_ho(self):
        self.assertEqual(self.can_ho.ma_hien_thi, 'A101')
        self.assertEqual(str(self.can_ho), 'A101')

    def test_create_cu_dan(self):
        cu_dan = CuDan.objects.create(
            ho_ten='Nguyen Van A',
            ngay_sinh=date(1990, 1, 1),
            so_cccd='123456789012',
            so_dien_thoai='0901234567',
            can_ho_dang_o=self.can_ho,
            la_chu_ho=True,
            trang_thai_cu_tru='ThuongTru'
        )
        self.assertEqual(cu_dan.ho_ten, 'Nguyen Van A')
        self.assertEqual(cu_dan.can_ho_dang_o, self.can_ho)
