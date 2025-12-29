from django.test import TestCase
from .models import ChiSoDienNuoc, TinTuc, YeuCau, PhuongTien
from residents.models import CanHo, CuDan
from datetime import date
from django.contrib.auth import get_user_model

User = get_user_model()

class ServicesTests(TestCase):
    def setUp(self):
        self.can_ho = CanHo.objects.create(
            phong='C303', tang=3, toa_nha='C', dien_tich=60.0
        )
        self.cu_dan = CuDan.objects.create(
            ho_ten='Tran Van B', ngay_sinh=date(1995, 5, 5), so_cccd='987654321', so_dien_thoai='0987654321'
        )
        self.user = User.objects.create_user(username='poster', password='password')

    def test_create_chi_so(self):
        chi_so = ChiSoDienNuoc.objects.create(
            can_ho=self.can_ho, loai_dich_vu='Dien', thang=10, nam=2025,
            chi_so_cu=100, chi_so_moi=150, ngay_chot=date(2025, 10, 25)
        )
        self.assertEqual(chi_so.chi_so_moi - chi_so.chi_so_cu, 50)

    def test_create_tin_tuc(self):
        tin = TinTuc.objects.create(
            tieu_de='Thong bao', noi_dung='Noi dung thong bao', nguoi_dang=self.user
        )
        self.assertEqual(tin.tieu_de, 'Thong bao')

    def test_create_yeu_cau(self):
        yeu_cau = YeuCau.objects.create(
            cu_dan=self.cu_dan, tieu_de='Sua chua', noi_dung='Hong den'
        )
        self.assertEqual(yeu_cau.trang_thai, 'ChoXuLy')

    def test_create_phuong_tien(self):
        xe = PhuongTien.objects.create(
            can_ho=self.can_ho, bien_so='29A-12345', loai_xe='Oto'
        )
        self.assertEqual(xe.bien_so, '29A-12345')
