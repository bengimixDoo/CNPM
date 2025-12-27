import random
from datetime import datetime, timedelta, date
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from django.contrib.auth.hashers import make_password

# Import Models
from users.models import User
from residents.models import CanHo, CuDan, BienDongDanCu
from finance.models import DanhMucPhi, HoaDon, ChiTietHoaDon
from services.models import ChiSoDienNuoc, PhuongTien, TinTuc, YeuCau, DichVu

class Command(BaseCommand):
    help = 'Seed database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting data seeding...')
        
        with transaction.atomic():
            self.clear_data()
            self.create_users()
            self.create_fees()
            apartments = self.create_apartments()
            residents = self.create_residents(apartments)
            self.create_vehicles(apartments)
            self.create_readings_and_invoices(apartments)
            self.create_services_data(residents)
            
        self.stdout.write(self.style.SUCCESS('Successfully seeded database!'))

    def clear_data(self):
        self.stdout.write('Clearing old data...')
        ChiTietHoaDon.objects.all().delete()
        HoaDon.objects.all().delete()
        ChiSoDienNuoc.objects.all().delete()
        PhuongTien.objects.all().delete()
        YeuCau.objects.all().delete()
        TinTuc.objects.all().delete()
        BienDongDanCu.objects.all().delete()
        CuDan.objects.all().delete()
        CanHo.objects.all().delete()
        DanhMucPhi.objects.all().delete()
        DichVu.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete() # Keep superuser if exists, or just recreate

    def create_users(self):
        self.stdout.write('Creating system users...')
        # Admin
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        
        # Manager
        if not User.objects.filter(username='manager').exists():
            User.objects.create_user(username='manager', password='123', role='QUAN_LY')
        
        # Accountant
        if not User.objects.filter(username='accountant').exists():
            User.objects.create_user(username='accountant', password='123', role='KE_TOAN')

    def create_fees(self):
        self.stdout.write('Creating fees...')
        # Finance Fees (Used for Billing)
        self.fee_dien = DanhMucPhi.objects.create(ten_loai_phi='Tiền Điện', dong_gia_hien_tai=3000, don_vi_tinh='kWh')
        self.fee_nuoc = DanhMucPhi.objects.create(ten_loai_phi='Tiền Nước', dong_gia_hien_tai=6000, don_vi_tinh='m3')
        self.fee_ql = DanhMucPhi.objects.create(ten_loai_phi='Phí Quản Lý', dong_gia_hien_tai=7000, don_vi_tinh='m2')
        self.fee_xe = DanhMucPhi.objects.create(ten_loai_phi='Phí Gửi Xe', dong_gia_hien_tai=120000, don_vi_tinh='xe')

        # Services Menu (Display only)
        DichVu.objects.create(ten_dich_vu='Điện sinh hoạt', don_gia=3000, don_vi_tinh='kWh', loai_dich_vu='BIEN_DOI')
        DichVu.objects.create(ten_dich_vu='Nước sạch', don_gia=6000, don_vi_tinh='m3', loai_dich_vu='BIEN_DOI')
        DichVu.objects.create(ten_dich_vu='Gửi xe máy', don_gia=120000, don_vi_tinh='tháng', loai_dich_vu='CO_DINH')
        DichVu.objects.create(ten_dich_vu='Gửi ô tô', don_gia=1200000, don_vi_tinh='tháng', loai_dich_vu='CO_DINH')

    def create_apartments(self):
        self.stdout.write('Creating apartments...')
        apartments = []
        blocks = ['A', 'B']
        for block in blocks:
            for floor in range(1, 11): # 10 floors
                for room_num in range(1, 6): # 5 rooms per floor
                    room_code = f"{block}{floor:02d}{room_num:02d}" # e.g. A0101
                    dien_tich = random.choice([70, 85, 100, 120])
                    apt = CanHo.objects.create(
                        phong=f"{floor:02d}{room_num:02d}",
                        tang=floor,
                        toa_nha=block,
                        dien_tich=dien_tich,
                        trang_thai='E' # Initially Empty
                    )
                    apartments.append(apt)
        return apartments

    def create_residents(self, apartments):
        self.stdout.write('Creating residents...')
        first_names = ['An', 'Bình', 'Cường', 'Dũng', 'Giang', 'Hương', 'Khánh', 'Lan', 'Minh', 'Nam', 'Oanh', 'Phúc', 'Quân', 'Thảo', 'Uyên', 'Vinh', 'Yến']
        last_names = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý']
        
        residents = []
        # Fill 80% of apartments
        occupied_apts = random.sample(apartments, int(len(apartments) * 0.8))
        
        for apt in occupied_apts:
            apt.trang_thai = random.choice(['S', 'H']) # Sold or Hired
            apt.save()
            
            num_people = random.randint(1, 4)
            for i in range(num_people):
                ho_ten = f"{random.choice(last_names)} {random.choice(first_names)}"
                is_owner = (i == 0) # First person is owner/head
                
                resident = CuDan.objects.create(
                    ho_ten=ho_ten,
                    gioi_tinh=random.choice(['M', 'F']),
                    ngay_sinh=date(random.randint(1970, 2000), random.randint(1, 12), random.randint(1, 28)),
                    so_cccd=f"0{random.randint(10000000000, 99999999999)}",
                    so_dien_thoai=f"09{random.randint(10000000, 99999999)}",
                    can_ho_dang_o=apt,
                    la_chu_ho=is_owner,
                    trang_thai_cu_tru='TT'
                )
                residents.append(resident)
                
                # Create User Account for Resident
                username = f"res_{resident.ma_cu_dan}"
                if not User.objects.filter(username=username).exists():
                    user = User.objects.create_user(username=username, password='123', role='CU_DAN')
                    user.cu_dan = resident
                    user.save()

                if is_owner:
                    apt.chu_so_huu = resident
                    apt.save()

        return residents

    def create_vehicles(self, apartments):
        self.stdout.write('Creating vehicles...')
        for apt in apartments:
            if apt.trang_thai == 'E': continue
            
            # Random 0-2 vehicles
            num_vehicles = random.randint(0, 2)
            for _ in range(num_vehicles):
                loai_xe = random.choice(['M', 'C']) # Motorbike or Car
                PhuongTien.objects.create(
                    can_ho=apt,
                    bien_so=f"59-{random.choice(['A','B','C','D'])}{random.randint(100,999)}.{random.randint(10,99)}",
                    loai_xe=loai_xe,
                    dang_hoat_dong=True
                )

    def create_readings_and_invoices(self, apartments):
        self.stdout.write('Creating readings and invoices...')
        # Generate for last 3 months
        today = timezone.now()
        months = []
        for i in range(3):
            d = today - timedelta(days=30 * (i+1))
            months.append((d.month, d.year))
        
        months.reverse() # Oldest first

        for month, year in months:
            for apt in apartments:
                if apt.trang_thai == 'E': continue

                # 1. Create Readings
                dien_cu = random.randint(100, 1000)
                dien_moi = dien_cu + random.randint(50, 300)
                nuoc_cu = random.randint(10, 100)
                nuoc_moi = nuoc_cu + random.randint(5, 30)

                ChiSoDienNuoc.objects.create(can_ho=apt, loai_dich_vu='Dien', thang=month, nam=year, chi_so_cu=dien_cu, chi_so_moi=dien_moi, ngay_chot=date(year, month, 25))
                ChiSoDienNuoc.objects.create(can_ho=apt, loai_dich_vu='Nuoc', thang=month, nam=year, chi_so_cu=nuoc_cu, chi_so_moi=nuoc_moi, ngay_chot=date(year, month, 25))

                # 2. Generate Invoice (Simplified logic from ViewSet)
                total_amount = 0
                
                # Dien
                tieu_thu_dien = dien_moi - dien_cu
                tien_dien = tieu_thu_dien * self.fee_dien.dong_gia_hien_tai
                total_amount += tien_dien
                
                # Nuoc
                tieu_thu_nuoc = nuoc_moi - nuoc_cu
                tien_nuoc = tieu_thu_nuoc * self.fee_nuoc.dong_gia_hien_tai
                total_amount += tien_nuoc
                
                # Quan Ly
                tien_ql = apt.dien_tich * self.fee_ql.dong_gia_hien_tai
                total_amount += tien_ql
                
                # Gui Xe
                so_xe = PhuongTien.objects.filter(can_ho=apt).count()
                tien_xe = so_xe * self.fee_xe.dong_gia_hien_tai
                total_amount += tien_xe
                
                # Create Invoice
                is_paid = random.choice([True, True, False]) # 66% paid
                invoice = HoaDon.objects.create(
                    can_ho=apt,
                    thang=month,
                    nam=year,
                    tong_tien=total_amount,
                    trang_thai=1 if is_paid else 0,
                    ngay_thanh_toan=timezone.now() if is_paid else None
                )
                
                # Details (Simplified)
                ChiTietHoaDon.objects.create(hoa_don=invoice, loai_phi=self.fee_dien, ten_phi_snapshot='Tiền Điện', so_luong=tieu_thu_dien, dong_gia_snapshot=self.fee_dien.dong_gia_hien_tai, thanh_tien=tien_dien)
                ChiTietHoaDon.objects.create(hoa_don=invoice, loai_phi=self.fee_nuoc, ten_phi_snapshot='Tiền Nước', so_luong=tieu_thu_nuoc, dong_gia_snapshot=self.fee_nuoc.dong_gia_hien_tai, thanh_tien=tien_nuoc)
                ChiTietHoaDon.objects.create(hoa_don=invoice, loai_phi=self.fee_ql, ten_phi_snapshot='Phí Quản Lý', so_luong=int(apt.dien_tich), dong_gia_snapshot=self.fee_ql.dong_gia_hien_tai, thanh_tien=tien_ql)
                if so_xe > 0:
                    ChiTietHoaDon.objects.create(hoa_don=invoice, loai_phi=self.fee_xe, ten_phi_snapshot='Phí Gửi Xe', so_luong=so_xe, dong_gia_snapshot=self.fee_xe.dong_gia_hien_tai, thanh_tien=tien_xe)

    def create_services_data(self, residents):
        self.stdout.write('Creating news and tickets...')
        # News
        titles = ['Thông báo bảo trì thang máy', 'Lịch thu phí tháng này', 'Quy định mới về rác thải', 'Họp cư dân định kỳ', 'Cảnh báo an ninh']
        manager = User.objects.get(username='manager')
        for t in titles:
            TinTuc.objects.create(
                tieu_de=t,
                noi_dung=f"Nội dung chi tiết của {t}...",
                nguoi_dang=manager
            )
            
        # Tickets
        ticket_titles = ['Hỏng bóng đèn hành lang', 'Ồn ào tầng trên', 'Thang máy rung lắc', 'Vệ sinh chưa sạch', 'Đăng ký thẻ xe mới']
        for _ in range(20):
            res = random.choice(residents)
            YeuCau.objects.create(
                cu_dan=res,
                tieu_de=random.choice(ticket_titles),
                noi_dung="Tôi cần hỗ trợ vấn đề này...",
                trang_thai=random.choice(['W', 'P', 'A']),
                ngay_gui=timezone.now() - timedelta(days=random.randint(0, 30))
            )
