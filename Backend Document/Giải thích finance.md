# models.py
**Vai trò:** Định nghĩa cấu trúc lưu trữ hóa đơn và bảng giá.
```
from django.db import models

# Bảng DanhMucPhi: Nơi lưu đơn giá (Bảng giá dịch vụ)
class DanhMucPhi(models.Model):
    ma_loai_phi = models.AutoField(primary_key=True)
    ten_loai_phi = models.CharField(max_length=100) # Ví dụ: "Điện sinh hoạt", "Nước", "Phí gửi xe máy"
    dong_gia_hien_tai = models.DecimalField(max_digits=10, decimal_places=2) # Giá hiện tại (vd: 3500.00)
    don_vi_tinh = models.CharField(max_length=50) # m3, kwh, thang, chiec

    def __str__(self):
        return self.ten_loai_phi

# Bảng HoaDon (Invoice Header): Chứa thông tin tổng quát của tờ hóa đơn
class HoaDon(models.Model):
    ma_hoa_don = models.AutoField(primary_key=True)
    # Liên kết tới Căn hộ (bên app residents). 
    # related_name='hoa_don': Từ căn hộ gọi .hoa_don sẽ ra lịch sử thanh toán.
    can_ho = models.ForeignKey('residents.CanHo', on_delete=models.CASCADE, related_name='hoa_don')
    thang = models.IntegerField()
    nam = models.IntegerField()
    tong_tien = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    trang_thai = models.IntegerField(default=0) # 0: Chưa trả, 1: Đã trả
    ngay_thanh_toan = models.DateTimeField(null=True, blank=True)
    ngay_tao = models.DateTimeField(auto_now_add=True) # Tự động lấy giờ hệ thống khi tạo

    def __str__(self):
        return f"Hoa don {self.thang}/{self.nam} - {self.can_ho}"

# Bảng ChiTietHoaDon (Invoice Lines): Các dòng tiền chi tiết trong 1 hóa đơn
class ChiTietHoaDon(models.Model):
    ma_chi_tiet = models.AutoField(primary_key=True)
    # Link về hóa đơn cha
    hoa_don = models.ForeignKey(HoaDon, on_delete=models.CASCADE, related_name='chi_tiet')
    # Link về loại phí (để biết đây là tiền điện hay nước)
    loai_phi = models.ForeignKey(DanhMucPhi, on_delete=models.PROTECT)
    
    # --- LOGIC SNAPSHOT (QUAN TRỌNG) ---
    # Tại sao cần lưu lại tên phí và đơn giá ở đây trong khi đã có ID loại phí?
    # Lý do: Giá điện tháng 1 là 3k, tháng 2 lên 4k. 
    # Nếu chỉ lưu ID, khi xem lại hóa đơn tháng 1, nó sẽ lấy giá hiện tại (4k) -> SAI SỐ LIỆU LỊCH SỬ.
    # Giải pháp: Lưu cứng (Snapshot) giá tại thời điểm tạo hóa đơn vào đây.
    ten_phi_snapshot = models.CharField(max_length=100) 
    so_luong = models.IntegerField() # Ví dụ: 100 (kwh)
    dong_gia_snapshot = models.DecimalField(max_digits=10, decimal_places=2) # 3000
    thanh_tien = models.DecimalField(max_digits=12, decimal_places=2) # 300,000

    def __str__(self):
        return f"{self.hoa_don} - {self.loai_phi}"
```
---
# serializers.py
**Vai trò:** Chuyển đổi dữ liệu và Validate.
```
from rest_framework import serializers
from .models import DanhMucPhi, HoaDon, ChiTietHoaDon
from services.models import ChiSoDienNuoc

# Các Serializer cơ bản (ModelSerializer)
class ChiSoDienNuocSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChiSoDienNuoc
        fields = '__all__'

class DanhMucPhiSerializer(serializers.ModelSerializer):
    class Meta:
        model = DanhMucPhi
        fields = '__all__'

class ChiTietHoaDonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChiTietHoaDon
        fields = '__all__'

# Serializer cho Hóa đơn (Có lồng dữ liệu)
class HoaDonSerializer(serializers.ModelSerializer):
    # Lồng danh sách chi tiết vào trong hóa đơn. 
    # Client gọi GET /invoices/1/ sẽ thấy luôn cả tiền điện, tiền nước bên trong.
    chi_tiet = ChiTietHoaDonSerializer(many=True, read_only=True)
    
    # Kỹ thuật lấy field quan hệ: Thay vì hiện can_ho: 1 (ID), nó sẽ hiện "A101" (dễ đọc)
    can_ho_info = serializers.CharField(source='can_ho.ma_hien_thi', read_only=True)

    class Meta:
        model = HoaDon
        fields = ['ma_hoa_don', 'can_ho', 'can_ho_info', 'thang', 'nam', 'tong_tien', 'trang_thai', 'ngay_tao', 'chi_tiet']

# Serializer Input (Không phải ModelSerializer)
class BatchGenerateSerializer(serializers.Serializer):
    """ Dùng để validate input khi Manager bấm nút 'Tính tiền tháng 10' """
    thang = serializers.IntegerField(min_value=1, max_value=12)
    nam = serializers.IntegerField(min_value=2000)
```
---
# views.py
**Vai trò:** Xử lý nghiệp vụ tài chính phức tạp.
```
# --- IMPORT ---
from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import DanhMucPhi, HoaDon, ChiTietHoaDon
from .serializers import (...) 
from residents.models import CanHo
from services.models import ChiSoDienNuoc, PhuongTien
from django.db import transaction # Để đảm bảo tính toàn vẹn dữ liệu
from django.utils import timezone

# Permission tùy chỉnh (giống app Users)
class IsManagerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.role == 'manager' or request.user.role == 'admin')

# 1. View Quản lý Phí & Chỉ số điện nước (CRUD cơ bản)
class FeeCategoryViewSet(viewsets.ModelViewSet):
    queryset = DanhMucPhi.objects.all()
    serializer_class = DanhMucPhiSerializer
    permission_classes = [IsManagerOrAdmin]

class UtilityReadingViewSet(viewsets.ModelViewSet):
    # ... setup queryset ...
    
    # Action nhập liệu hàng loạt (Batch Upload)
    # Giúp Manager upload 1 file Excel/JSON chứa chỉ số cả tòa nhà thay vì nhập tay từng cái.
    @decorators.action(detail=False, methods=['post'], url_path='batch')
    def batch(self, request):
        serializer = self.get_serializer(data=request.data, many=True) # many=True: Nhận vào 1 danh sách
        if serializer.is_valid():
            serializer.save()
            return Response(...)
        return Response(serializer.errors, status=400)

# 2. View Hóa Đơn (CORE LOGIC)
class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = HoaDon.objects.all()
    serializer_class = HoaDonSerializer

    # Filter: GET /invoices/?status=0&month=12 (Tìm hóa đơn chưa trả tháng 12)
    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status')
        month = self.request.query_params.get('month')
        if status_param is not None: queryset = queryset.filter(trang_thai=status_param)
        if month: queryset = queryset.filter(thang=month)
        return queryset

    # --- LOGIC TÍNH TIỀN TỰ ĐỘNG (Phần khó nhất) ---
    @decorators.action(detail=False, methods=['post'], url_path='batch-generate')
    def batch_generate(self, request):
        serializer = BatchGenerateSerializer(data=request.data)
        if serializer.is_valid():
            thang = serializer.validated_data['thang']
            nam = serializer.validated_data['nam']
            
            # 1. Lấy bảng giá hiện tại (Hardcode tìm theo tên - cần cẩn thận chỗ này)
            try:
                gia_dien = DanhMucPhi.objects.filter(ten_loai_phi__icontains='Dien').first()
                # ... (Lấy giá nước, quản lý, gửi xe tương tự) ...
                if not all([...]): return Response({"error": "Chưa cấu hình giá"}, status=400)
            except Exception as e: return Response(...)

            generated_count = 0
            
            # Transaction Atomic: Đảm bảo tính đúng đắn, lỗi ở đâu rollback sạch ở đó
            with transaction.atomic():
                # Loop qua từng căn hộ trong chung cư
                for apt in CanHo.objects.all():
                    # Nếu căn này đã có hóa đơn tháng này rồi thì bỏ qua (tránh tính trùng)
                    if HoaDon.objects.filter(can_ho=apt, thang=thang, nam=nam).exists():
                        continue 

                    total_amount = 0
                    details = [] # Danh sách tạm các dòng phí

                    # A. Tính Điện/Nước
                    readings = ChiSoDienNuoc.objects.filter(can_ho=apt, thang=thang, nam=nam)
                    for reading in readings:
                        tieu_thu = reading.chi_so_moi - reading.chi_so_cu
                        if tieu_thu < 0: tieu_thu = 0 # Tránh âm
                        
                        price_obj = gia_dien if reading.loai_dich_vu == 'Dien' else gia_nuoc
                        cost = tieu_thu * price_obj.dong_gia_hien_tai
                        
                        # Thêm vào danh sách tạm
                        details.append({
                            'loai_phi': price_obj,
                            'so_luong': tieu_thu,
                            'dong_gia_snapshot': price_obj.dong_gia_hien_tai, # Lưu giá lúc này
                            'thanh_tien': cost
                        })
                        total_amount += cost
                    
                    # B. Phí Quản lý (Tính theo m2)
                    ql_cost = apt.dien_tich * gia_quan_ly.dong_gia_hien_tai
                    details.append({ ... }) # (Code tương tự trên)
                    total_amount += ql_cost

                    # C. Phí Gửi Xe (Đếm số xe trong hệ thống)
                    xe_count = PhuongTien.objects.filter(can_ho=apt).count()
                    if xe_count > 0:
                        xe_cost = xe_count * gia_gui_xe.dong_gia_hien_tai
                        details.append({ ... })
                        total_amount += xe_cost
                    
                    # D. Lưu vào Database
                    # Tạo Header hóa đơn trước
                    invoice = HoaDon.objects.create(
                        can_ho=apt, thang=thang, nam=nam,
                        tong_tien=total_amount, trang_thai=0
                    )
                    
                    # Tạo các dòng chi tiết
                    for d in details:
                        ChiTietHoaDon.objects.create(hoa_don=invoice, **d) # **d là unpack dictionary
                    
                    generated_count += 1

            return Response({"message": f"Đã tạo {generated_count} hóa đơn..."})
        return Response(...)

    # Xác nhận thanh toán
    @decorators.action(detail=True, methods=['post'], url_path='confirm-payment')
    def confirm_payment(self, request, pk=None):
        invoice = self.get_object()
        if invoice.trang_thai == 1: return Response(...)
        
        invoice.trang_thai = 1
        invoice.ngay_thanh_toan = timezone.now()
        invoice.save()
        return Response(...)

# 3. View Báo Cáo Doanh Thu
class RevenueStatsView(viewsets.ViewSet):
    permission_classes = [IsManagerOrAdmin]

    @decorators.action(detail=False, methods=['get'], url_path='monthly-revenue')
    def monthly_revenue(self, request):
        year = request.query_params.get('year')
        # Logic: Chạy vòng lặp 12 tháng, sum tiền hóa đơn
        data = []
        for month in range(1, 13):
            invoices = HoaDon.objects.filter(nam=year, thang=month)
            # Python sum(): Hơi chậm nếu dữ liệu lớn, nên dùng Database Aggregate (Sum) thì tốt hơn
            total = sum(inv.tong_tien for inv in invoices) 
            collected = sum(inv.tong_tien for inv in invoices if inv.trang_thai == 1)
            
            data.append({ "thang": month, "phat_sinh": total, "thuc_thu": collected })
        
        return Response({"nam": year, "data": data})
```
---
# urls.py
**Vai trò:** Định tuyến API.
```
from rest_framework.routers import DefaultRouter
from .views import FeeCategoryViewSet, InvoiceViewSet, RevenueStatsView, UtilityReadingViewSet

router = DefaultRouter()
# Đăng ký các ViewSet vào Router
router.register(r'fee-categories', FeeCategoryViewSet, basename='fee-category')
router.register(r'utility-readings', UtilityReadingViewSet, basename='utility-reading')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'analytics', RevenueStatsView, basename='analytics') # Endpoint thống kê

urlpatterns = [
    path('', include(router.urls)),
]
```
---
# Phân tích luồng hoạt động

