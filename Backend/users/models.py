from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Định nghĩa Role
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        QUAN_LY = "QUAN_LY", "Quản lý"
        CU_DAN = "CU_DAN", "Cư dân"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CU_DAN,
        help_text="Phân quyền người dùng"
    )

    # QUAN TRỌNG: Sửa tham chiếu từ 'residents.Resident' thành 'residents.CuDan'
    # để khớp với tên Class trong file residents/models.py của bạn
    cu_dan = models.OneToOneField(
        'residents.CuDan',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user_account',
        help_text="Liên kết với hồ sơ cư dân thực tế"
    )

    def __str__(self):
        return f"{self.username} ({self.role})"