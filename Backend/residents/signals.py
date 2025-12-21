from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import CuDan, CanHo, BienDongDanCu
from datetime import date

@receiver(post_save, sender=CuDan)
def update_apartment_owner_signal(sender, instance, created, **kwargs):
    """
    Tín hiệu này chạy NGAY SAU KHI một cư dân được lưu (tạo mới hoặc cập nhật).
    """
    # Sử dụng transaction.atomic để đảm bảo an toàn dữ liệu
    with transaction.atomic():
        # Ghi nhận biến động dân cư khi tạo mới cư dân
        if created:
            BienDongDanCu.objects.create(
                cu_dan=instance,
                loai_bien_dong=instance.trang_thai_cu_tru,
                ngay_thuc_hien=date.today()
            )
        
        # Ghi nhận chủ hộ và cập nhật bảng CanHo
        if instance.la_chu_ho:
            # RÀNG BUỘC: Nếu người này là chủ hộ
            if instance.can_ho_dang_o:
                # 1. Hủy trạng thái chủ hộ của những người khác trong cùng căn hộ
                # Dùng .update() để không kích hoạt ngược lại signal này (tránh vòng lặp)
                CuDan.objects.filter(
                    can_ho_dang_o=instance.can_ho_dang_o,
                    la_chu_ho=True
                ).exclude(ma_cu_dan=instance.ma_cu_dan).update(la_chu_ho=False)

                # 2. Cập nhật bảng CanHo: Gán chu_so_huu là cư dân này
                can_ho = instance.can_ho_dang_o
                if can_ho.chu_so_huu != instance:
                    can_ho.chu_so_huu = instance
                    can_ho.save(update_fields=['chu_so_huu'])
        else:
            # TÍNH NHẤT QUÁN: Nếu người này không còn là chủ hộ
            can_ho = instance.can_ho_dang_o
            if can_ho and can_ho.chu_so_huu == instance:
                can_ho.chu_so_huu = None
                can_ho.save(update_fields=['chu_so_huu'])

@receiver(post_save, sender=BienDongDanCu)
def xu_ly_khi_co_bien_dong(sender, instance, created, **kwargs):
    """
    Xử lý logic khi một bản ghi BienDongDanCu được tạo ra.
    """
    if created:
        cu_dan = instance.cu_dan
        with transaction.atomic():
            # YÊU CẦU 1: Nếu là Chuyển đi (OUT)
            if instance.loai_bien_dong == 'OUT':
                # 1. Hủy tư cách chủ sở hữu tại căn hộ cũ nếu có
                can_ho_cu = cu_dan.can_ho_dang_o
                if can_ho_cu and can_ho_cu.chu_so_huu == cu_dan:
                    can_ho_cu.chu_so_huu = None
                    can_ho_cu.save(update_fields=['chu_so_huu'])

                # 2. Cập nhật thông tin cư dân: rời căn hộ và đổi trạng thái
                cu_dan.can_ho_dang_o = None
                cu_dan.trang_thai_cu_tru = 'OUT'
                cu_dan.la_chu_ho = False
                cu_dan.save()

                # Kiểm tra xem căn hộ còn người nào không
                if can_ho_cu:
                    # Đếm số người còn lại trong căn hộ này
                    so_nguoi_con_lai = CuDan.objects.filter(can_ho_dang_o=can_ho_cu).count()
                    
                    if so_nguoi_con_lai == 0:
                        can_ho_cu.trang_thai = 'E' # Chuyển về Trống
                        can_ho_cu.save(update_fields=['trang_thai'])

            
            else:
                cu_dan.trang_thai_cu_tru = instance.loai_bien_dong
                cu_dan.save()
            