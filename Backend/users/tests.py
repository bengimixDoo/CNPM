from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserTests(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(username='testuser', password='password123', role='resident')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.role, 'resident')
        self.assertTrue(user.check_password('password123'))

    def test_create_superuser(self):
        admin = User.objects.create_superuser(username='admin', password='password123')
        self.assertEqual(admin.role, 'resident') # Default is resident unless specified, or we can change default for superuser if needed
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_staff)
