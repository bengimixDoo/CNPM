from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from residents.models import CanHo, CuDan

User = get_user_model()

class ResidentsAPITests(APITestCase):
    def setUp(self):
        # Users
        self.manager = User.objects.create_user(username='manager', password='Strong@Password123', role='QUAN_LY')
        self.resident = User.objects.create_user(username='resident', password='Strong@Password123', role='CU_DAN')
        self.accountant = User.objects.create_user(username='accountant', password='Strong@Password123', role='KE_TOAN')
        
        # Test Data
        self.apartment1 = CanHo.objects.create(phong='101', tang=1, toa_nha='A', dien_tich=50, trang_thai='E')
        self.apartment2 = CanHo.objects.create(phong='202', tang=2, toa_nha='B', dien_tich=60, trang_thai='E')
        
        self.cudan1 = CuDan.objects.create(
            ho_ten='Nguyen A', 
            so_cccd='123456789', 
            can_ho_dang_o=self.apartment1,
            ngay_sinh='1990-01-01',
            gioi_tinh='M',
            so_dien_thoai='0901234567'
        )
        
        # Link resident user to CuDan
        self.resident.cu_dan = self.cudan1
        self.resident.save()

        # URLs
        self.list_apartments_url = reverse('apartments-list')
        self.list_residents_url = reverse('residents-list')

    def test_list_apartments_manager(self):
        self.client.force_authenticate(user=self.manager)
        response = self.client.get(self.list_apartments_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Manager sees all
        self.assertTrue(len(response.data) >= 2)

    def test_list_apartments_resident(self):
        self.client.force_authenticate(user=self.resident)
        response = self.client.get(self.list_apartments_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Resident sees only own apartment
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['phong'], self.apartment1.phong)

    def test_create_apartment_manager(self):
        self.client.force_authenticate(user=self.manager)
        data = {
            'phong': '303',
            'tang': 3,
            'toa_nha': 'C', 
            'dien_tich': 70,
            'trang_thai': 'E'
        }
        response = self.client.post(self.list_apartments_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_apartment_resident_forbidden(self):
        self.client.force_authenticate(user=self.resident)
        data = {'phong': '404', 'tang': 4, 'toa_nha': 'D', 'dien_tich': 80}
        response = self.client.post(self.list_apartments_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_view_residents_manager(self):
        self.client.force_authenticate(user=self.manager)
        response = self.client.get(self.list_residents_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_view_residents_resident(self):
        self.client.force_authenticate(user=self.resident)
        response = self.client.get(self.list_residents_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Resident sees self
        self.assertEqual(len(response.data), 1)
