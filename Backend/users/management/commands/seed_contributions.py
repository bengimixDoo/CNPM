import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction

# Import Models
from finance.models import DotDongGop, DongGop
from residents.models import CanHo

class Command(BaseCommand):
    help = 'Seed contribution data (Add-only)'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting contribution seeding...')
        
        with transaction.atomic():
            self.create_contributions()
            
        self.stdout.write(self.style.SUCCESS('Successfully seeded contributions!'))

    def create_contributions(self):
        # 1. Create Drives
        drives = [
            {
                "ten": "Ủng hộ đồng bào lũ lụt miền Trung",
                "start": timezone.now().date() - timedelta(days=60),
                "end": timezone.now().date() - timedelta(days=30),
                "desc": "Quyên góp giúp đỡ bà con vùng lũ..."
            },
            {
                "ten": "Quỹ khuyến học khu dân cư 2025",
                "start": timezone.now().date() - timedelta(days=15),
                "end": timezone.now().date() + timedelta(days=15),
                "desc": "Trao học bổng cho con em cư dân có thành tích tốt."
            },
            {
                "ten": "Trang trí Tết Nguyên Đán",
                "start": timezone.now().date() + timedelta(days=5),
                "end": timezone.now().date() + timedelta(days=35),
                "desc": "Mua cây cảnh, đèn lồng trang trí sảnh."
            }
        ]
        
        created_drives = []
        for d in drives:
            drive, created = DotDongGop.objects.get_or_create(
                ten_dot=d['ten'],
                defaults={
                    'ngay_bat_dau': d['start'],
                    'ngay_ket_thuc': d['end'],
                    'mo_ta': d['desc']
                }
            )
            if created:
                self.stdout.write(f"Created drive: {drive.ten_dot}")
            created_drives.append(drive)

        # 2. Create Donations for active/past drives
        apartments = CanHo.objects.exclude(trang_thai='E') # Only occupied apartments
        
        for drive in created_drives:
            # Randomly select 40% of apartments to donate
            donors = random.sample(list(apartments), int(len(apartments) * 0.4))
            
            for apt in donors:
                # Check if already donated to avoid duplicates if run multiple times
                if DongGop.objects.filter(dot_dong_gop=drive, can_ho=apt).exists():
                    continue
                    
                amount = random.choice([50000, 100000, 200000, 500000, 1000000])
                DongGop.objects.create(
                    dot_dong_gop=drive,
                    can_ho=apt,
                    so_tien=amount,
                    hinh_thuc=random.choice(['TM', 'CK'])
                )
        
        self.stdout.write(f"Added donations for {len(created_drives)} drives.")
