from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('resident', 'Resident'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='resident')
    cu_dan = models.ForeignKey('residents.CuDan', on_delete=models.SET_NULL, null=True, blank=True, related_name='user_account')
    
    def __str__(self):
        return f"{self.username} ({self.role})"
