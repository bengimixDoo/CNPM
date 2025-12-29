from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Sum
from .models import ChiTietHoaDon

@receiver(post_save, sender=ChiTietHoaDon)
@receiver(post_delete, sender=ChiTietHoaDon)
def update_invoice_total(sender, instance, **kwargs):
    hoa_don = instance.hoa_don
    # Calculate total from all details
    total = hoa_don.chi_tiet.aggregate(total=Sum('thanh_tien'))['total'] or 0
    hoa_don.tong_tien = total
    hoa_don.save()
