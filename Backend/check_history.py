import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from residents.models import BienDongDanCu

print(f"Total BienDongDanCu records: {BienDongDanCu.objects.count()}")
print("\nSample data:")
for b in BienDongDanCu.objects.all()[:5]:
    print(f"  ID: {b.ma_bien_dong}")
    print(f"    Cư dân: {b.cu_dan.ho_ten if b.cu_dan else 'None'}")
    print(f"    Căn hộ: {b.can_ho if b.can_ho else 'None'}")
    print(f"    Loại: {b.loai_bien_dong}")
    print(f"    Ngày: {b.ngay_thuc_hien}")
    print()
