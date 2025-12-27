from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAPITests(APITestCase):
    def setUp(self):
        # Create users with different roles
        self.admin_user = User.objects.create_superuser(
            username='admin', password='Strong@Password123', role='ADMIN'
        )
        self.manager_user = User.objects.create_user(
            username='manager', password='Strong@Password123', role='QUAN_LY'
        )
        self.resident_user = User.objects.create_user(
            username='resident', password='Strong@Password123', role='CU_DAN'
        )
        
        self.login_url = reverse('token_obtain_pair')
        self.list_url = reverse('user-list')
        self.me_url = reverse('user-get-me')

    def test_login_success(self):
        data = {
            'username': 'resident',
            'password': 'Strong@Password123'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['role'], 'CU_DAN')

    def test_login_failure(self):
        data = {
            'username': 'resident',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_me_authenticated(self):
        self.client.force_authenticate(user=self.resident_user)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'resident')

    def test_get_me_unauthenticated(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_users_manager(self):
        self.client.force_authenticate(user=self.manager_user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if list contains our 3 users
        self.assertTrue(len(response.data) >= 3)

    def test_list_users_resident_forbidden(self):
        self.client.force_authenticate(user=self.resident_user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_user_manager_success(self):
        self.client.force_authenticate(user=self.manager_user)
        data = {
            'username': 'newresident',
            'password': 'Strong@Password123',
            'role': 'CU_DAN'
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 4)

    def test_create_user_resident_forbidden(self):
        self.client.force_authenticate(user=self.resident_user)
        data = {
            'username': 'hacker',
            'password': 'Strong@Password123',
            'role': 'ADMIN'
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_change_password(self):
        self.client.force_authenticate(user=self.resident_user)
        url = reverse('user-change-password')
        data = {
            'old_password': 'Strong@Password123',
            'new_password': 'newStrong@Password123',
            'confirm_password': 'newStrong@Password123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify login with new password
        self.client.logout()
        login_resp = self.client.post(self.login_url, {
            'username': 'resident',
            'password': 'newStrong@Password123'
        })
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)
