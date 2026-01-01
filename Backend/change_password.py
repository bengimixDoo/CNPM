import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

user = User.objects.get(id=200)
old_pass_hint = user.password[:20] + "..." if len(user.password) > 20 else user.password

user.set_password('123')
user.save()

print(f"✅ Đổi mật khẩu thành công!")
print(f"Email: {user.email}")
print(f"Role: {user.role}")
print(f"Mật khẩu mới: 123")
print(f"\nGhi chú: Mật khẩu được hash trong database nên không thể xem mật khẩu gốc")
