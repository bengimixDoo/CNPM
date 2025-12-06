import os
import django

# Bước 1: Khởi tạo Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "quanlychungcu.settings")
django.setup()

from django.contrib.auth.models import User

# Lấy user theo username
username = "admin"
password_input = "123"  # mật khẩu cần kiểm tra

try:
    user = User.objects.get(username=username)
    if user.check_password(password_input):
        print("Mật khẩu đúng!")
    else:
        print("Mật khẩu sai!")
except User.DoesNotExist:
    print("User không tồn tại")
