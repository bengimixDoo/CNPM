# Mở file: users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    """
    Model User tùy chỉnh, kế thừa từ User mặc định của Django.
    """

    # Định nghĩa các vai trò (Tùy chọn)
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Quản trị viên'
        QUAN_LY = 'QUAN_LY', 'Quản lý'
        KE_TOAN = 'KE_TOAN', 'Kế toán'
        CU_DAN = 'CU_DAN', 'Cư dân'

    role = models.CharField(
        max_length=50,
        choices=Role.choices,
        default=Role.ADMIN
    )

    # (KHÔNG CÒN class Meta)
    # Bằng cách xóa Meta, chúng ta để Django tự do:
    # 1. Tự đặt tên bảng (sẽ là "users_customuser")
    # 2. Tự quản lý bảng (managed = True)
    # 3. Tự tạo khóa chính 'id'