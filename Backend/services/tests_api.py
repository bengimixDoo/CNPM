from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from residents.models import CanHo, CuDan
from services.models import PhuongTien, TinTuc

User = get_user_model()

class ServicesAPITests(APITestCase):
    def setUp(self):
        # Users
        self.manager = User.objects.create_user(username='manager', password='Strong@Password123', role='QUAN_LY')
        self.resident = User.objects.create_user(username='resident', password='Strong@Password123', role='CU_DAN')
        self.accountant = User.objects.create_user(username='accountant', password='Strong@Password123', role='KE_TOAN')
        
        # Test Data
        self.apartment = CanHo.objects.create(phong='101', tang=1, toa_nha='A', dien_tich=50, trang_thai='H')
        self.resident_profile = CuDan.objects.create(
            ho_ten='Nguyen Van A', 
            so_cccd='123456', 
            can_ho_dang_o=self.apartment,
            ngay_sinh='1995-05-15',
            gioi_tinh='M',
            so_dien_thoai='0912345678'
        )
        self.resident.cu_dan = self.resident_profile
        self.resident.save()

        self.vehicle = PhuongTien.objects.create(can_ho=self.apartment, bien_so='29A-12345', loai_xe='C')
        self.news = TinTuc.objects.create(tieu_de="News 1", noi_dung="Content", nguoi_dang=self.manager)

        # URLs
        self.vehicle_list = reverse('vehicle-list')
        self.news_list = reverse('news-list')
        self.request_list = reverse('support-tickets-list')

    def test_list_vehicles_manager(self):
        self.client.force_authenticate(user=self.manager)
        response = self.client.get(self.vehicle_list)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see all
        self.assertTrue(len(response.data) >= 1)

    def test_list_vehicles_resident(self):
        self.client.force_authenticate(user=self.resident)
        response = self.client.get(self.vehicle_list)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Resident sees own vehicle
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['bien_so'], '29A-12345')

    def test_create_vehicle_manager(self):
        self.client.force_authenticate(user=self.manager)
        data = {
            'can_ho': self.apartment.ma_can_ho,
            'bien_so': '29B-99999',
            'loai_xe': 'M'
        }
        response = self.client.post(self.vehicle_list, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_vehicle_resident_forbidden(self):
        self.client.force_authenticate(user=self.resident)
        data = {'bien_so': '29V-11111', 'loai_xe': 'M'}
        response = self.client.post(self.vehicle_list, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_news_authenticated(self):
        self.client.force_authenticate(user=self.resident)
        response = self.client.get(self.news_list)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_create_request_resident_success(self):
        self.client.force_authenticate(user=self.resident)
        data = {
            'tieu_de': 'Can sua cua',
            'noi_dung': 'Cua hong roi'
        }
        # Assuming YeuCauViewSet handles creation for resident
        response = self.client.post(self.request_list, data)
        if response.status_code != 201:
             print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
