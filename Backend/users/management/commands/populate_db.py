from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from residents.models import CanHo, CuDan, BienDongDanCu
from finance.models import DanhMucPhi, HoaDon, ChiTietHoaDon
from services.models import ChiSoDienNuoc, TinTuc, PhuongTien
from django.utils import timezone
from datetime import date, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with seed data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting data population...')

        # 1. Fee Categories
        fees = [
            {'name': 'Tiền Điện', 'price': 3000, 'unit': 'kwh'},
            {'name': 'Tiền Nước', 'price': 15000, 'unit': 'm3'},
            {'name': 'Phí Quản lý', 'price': 10000, 'unit': 'm2'}, # 10k/m2
            {'name': 'Phí Gửi xe', 'price': 120000, 'unit': 'xe/thang'},
        ]
        
        for f in fees:
            DanhMucPhi.objects.get_or_create(
                ten_loai_phi=f['name'],
                defaults={'dong_gia_hien_tai': f['price'], 'don_vi_tinh': f['unit']}
            )
        self.stdout.write('- Fees created.')

        # 2. Apartments (Block A, 5 floors, 4 rooms each => 20 rooms)
        for floor in range(1, 6):
            for room_num in range(1, 5):
                name = f"A{floor}0{room_num}"
                CanHo.objects.get_or_create(
                    ma_hien_thi=name,
                    defaults={
                        'tang': floor,
                        'toa_nha': 'Block A',
                        'dien_tich': random.choice([50, 70, 90]),
                        'trang_thai': 'Trong'
                    }
                )
        self.stdout.write('- Apartments created.')

        # 3. Residents & Users
        # Tạo 5 hộ dân mẫu
        apts = CanHo.objects.filter(trang_thai='Trong')[:5]
        for i, apt in enumerate(apts):
            # Cư dân
            resident_name = f"Nguyen Van {chr(65+i)}" # Nguyen Van A, B...
            cudan, created = CuDan.objects.get_or_create(
                so_cccd=f"00109900000{i}",
                defaults={
                    'ho_ten': resident_name,
                    'ngay_sinh': date(1990, 1, 1),
                    'so_dien_thoai': f"090900000{i}",
                    'can_ho_dang_o': apt,
                    'la_chu_ho': True,
                    'trang_thai_cu_tru': 'ThuongTru'
                }
            )
            
            # Update Apt status
            apt.trang_thai = 'DangO'
            apt.save()

            # Tạo BienDong (Move in)
            if created:
                BienDongDanCu.objects.create(
                    cu_dan=cudan,
                    loai_bien_dong='ChuyenDen',
                    ngay_thuc_hien=date.today() - timedelta(days=30)
                )

            # User account
            username = f"user{i+1}"
            if not User.objects.filter(username=username).exists():
                u = User.objects.create_user(username=username, password='password123')
                u.role = 'resident'
                u.cu_dan = cudan
                u.save()
        
        # Admin & Manager
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123', role='admin')
        
        if not User.objects.filter(username='manager').exists():
            User.objects.create_user('manager', 'manager@example.com', 'manager123', role='manager')

        self.stdout.write('- Users & Residents created.')

        # 4. Utility Readings (Last month)
        today = date.today()
        last_month = today.month - 1 if today.month > 1 else 12
        year = today.year if today.month > 1 else today.year - 1
        
        occupied_apts = CanHo.objects.filter(trang_thai='DangO')
        for apt in occupied_apts:
            # Dien
            ChiSoDienNuoc.objects.get_or_create(
                can_ho=apt, thang=last_month, nam=year, loai_dich_vu='Dien',
                defaults={
                    'chi_so_cu': 100,
                    'chi_so_moi': 150 + random.randint(10, 50),
                    'ngay_chot': today.replace(day=1)
                }
            )
            # Nuoc
            ChiSoDienNuoc.objects.get_or_create(
                can_ho=apt, thang=last_month, nam=year, loai_dich_vu='Nuoc',
                defaults={
                    'chi_so_cu': 50,
                    'chi_so_moi': 60 + random.randint(5, 10),
                    'ngay_chot': today.replace(day=1)
                }
            )

            # Phuong tien
            PhuongTien.objects.get_or_create(
                bien_so=f"59-{chr(65+apt.ma_can_ho)}1",
                defaults={'can_ho': apt, 'loai_xe': 'XeMay'}
            )

        self.stdout.write('- Utility Readings created.')
        self.stdout.write('Data population completed successfully!')
