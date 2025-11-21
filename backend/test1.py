
import os
import django

# BƯỚC 1: Đặt biến môi trường DJANGO_SETTINGS_MODULE
# THAY THẾ 'ten_du_an_cua_ban' bằng tên thư mục chứa settings.py
# Ví dụ: 'quanlychungcu.settings'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cnpm.settings")

# BƯỚC 2: Khởi tạo Django
# Lệnh này tải tất cả cấu hình, models và ứng dụng.
django.setup()

# --- Mã của bạn truy cập Models hoặc Settings sẽ chạy sau dòng này ---
from cnpm.models import Users

# Lấy tất cả
user_list = Users.objects.all()

# In ra danh sách
for u in user_list:
    print(u.username, u.email)