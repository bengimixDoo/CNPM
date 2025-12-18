from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('QUAN_LY', 'Ban Quản Lý'),
        ('CU_DAN', 'Cư Dân'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CU_DAN')
    # Link string để tránh circular import, sẽ trỏ tới residents.CuDan
    cu_dan_id = models.IntegerField(null=True, blank=True, help_text="ID của bảng CuDan nếu role là CU_DAN")
    
    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = 'ADMIN'
        super().save(*args, **kwargs)