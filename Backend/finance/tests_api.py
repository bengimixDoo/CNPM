from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from finance.models import DanhMucPhi

User = get_user_model()

class FinanceAPITests(APITestCase):
    def setUp(self):
        # Users
        self.manager = User.objects.create_user(username='manager', password='Strong@Password123', role='QUAN_LY')
        self.resident = User.objects.create_user(username='resident', password='Strong@Password123', role='CU_DAN')
        self.accountant = User.objects.create_user(username='accountant', password='Strong@Password123', role='KE_TOAN')
        
        # Test Data
        self.fee = DanhMucPhi.objects.create(ten_loai_phi="Phi Quan Ly", dong_gia_hien_tai=5000, don_vi_tinh="m2")
        
        # URLs
        self.fees_list = reverse('fees-list')

    def test_list_fees_manager(self):
        self.client.force_authenticate(user=self.manager)
        response = self.client.get(self.fees_list)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_list_fees_resident_forbidden(self):
        self.client.force_authenticate(user=self.resident)
        response = self.client.get(self.fees_list)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_fee_accountant(self):
        self.client.force_authenticate(user=self.accountant)
        data = {
            'ten_loai_phi': 'Phi Gui Xe',
            'dong_gia_hien_tai': 100000,
            'don_vi_tinh': 'thang'
        }
        response = self.client.post(self.fees_list, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_fee_resident_forbidden(self):
        self.client.force_authenticate(user=self.resident)
        data = {
            'ten_loai_phi': 'Phi Hack',
            'dong_gia_hien_tai': 0,
            'don_vi_tinh': 'vnd'
        }
        response = self.client.post(self.fees_list, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
