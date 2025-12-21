### 1. FILE: `services/models.py`

**Vai trò:** Định nghĩa các bảng dữ liệu phục vụ vận hành.

Python

```
from django.db import models

# 1. Bảng Chỉ số Điện Nước
# Lưu ý: Bảng này nằm ở app Services (về mặt vật lý) nhưng thường được App Finance sử dụng để tính tiền.
class ChiSoDienNuoc(models.Model):
    ma_chi_so = models.AutoField(primary_key=True)
    # Link tới Căn hộ: Để biết số này của nhà nào
    can_ho = models.ForeignKey('residents.CanHo', on_delete=models.CASCADE, related_name='chi_so_dien_nuoc')
    loai_dich_vu = models.CharField(max_length=20) # 'Dien' hoặc 'Nuoc'
    thang = models.IntegerField()
    nam = models.IntegerField()
    chi_so_cu = models.IntegerField()
    chi_so_moi = models.IntegerField()
    ngay_chot = models.DateField()

    def __str__(self):
        return f"{self.loai_dich_vu} - {self.can_ho} - {self.thang}/{self.nam}"

# 2. Bảng Tin Tức (Thông báo từ BQL)
class TinTuc(models.Model):
    ma_tin = models.AutoField(primary_key=True)
    tieu_de = models.CharField(max_length=200)
    noi_dung = models.TextField()
    # Link tới User (người đăng): Nếu user admin bị xóa, bài đăng vẫn còn (SET_NULL) nhưng mất tên người đăng.
    nguoi_dang = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    ngay_dang = models.DateTimeField(auto_now_add=True) # Tự động lấy giờ hiện tại

    def __str__(self):
        return self.tieu_de

# 3. Bảng Yêu Cầu (Support Ticket - Báo hỏng/Khiếu nại)
class YeuCau(models.Model):
    ma_yeu_cau = models.AutoField(primary_key=True)
    # Link tới Cư Dân: Cụ thể ông nào gửi yêu cầu này.
    # related_name='yeu_cau': Giúp truy vấn ngược -> cu_dan.yeu_cau.all() ra lịch sử báo hỏng.
    cu_dan = models.ForeignKey('residents.CuDan', on_delete=models.CASCADE, related_name='yeu_cau')
    tieu_de = models.CharField(max_length=200)
    noi_dung = models.TextField()
    trang_thai = models.CharField(max_length=50, default='ChoXuLy') # Workflow trạng thái
    phan_hoi_bql = models.TextField(blank=True, null=True) # Câu trả lời của BQL
    ngay_gui = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.tieu_de

# 4. Bảng Phương Tiện (Xe cộ)
class PhuongTien(models.Model):
    ma_xe = models.AutoField(primary_key=True)
    # Xe thuộc về Căn hộ (chứ không gắn trực tiếp vào Cư dân, để dễ tính phí theo hộ)
    can_ho = models.ForeignKey('residents.CanHo', on_delete=models.CASCADE, related_name='phuong_tien')
    bien_so = models.CharField(max_length=20, unique=True) # Biển số không được trùng
    loai_xe = models.CharField(max_length=50) # Oto, Xemay

    def __str__(self):
        return self.bien_so
```

---

### 2. FILE: `services/serializers.py`

**Vai trò:** Chuyển đổi dữ liệu và "làm đẹp" thông tin trả về (Flattening data).

Python

```
from rest_framework import serializers
from .models import TinTuc, YeuCau, PhuongTien

class TinTucSerializer(serializers.ModelSerializer):
    # Kỹ thuật ReadOnlyField với source:
    # Thay vì trả về nguoi_dang: 1 (ID vô nghĩa), nó sẽ trả về nguoi_dang_ten: "admin_huy"
    nguoi_dang_ten = serializers.ReadOnlyField(source='nguoi_dang.username')

    class Meta:
        model = TinTuc
        fields = ['ma_tin', 'tieu_de', 'noi_dung', 'nguoi_dang', 'nguoi_dang_ten', 'ngay_dang']
        # read_only_fields: Client không được gửi các trường này lên. Server tự xử lý.
        read_only_fields = ['nguoi_dang', 'ngay_dang']

class YeuCauSerializer(serializers.ModelSerializer):
    # Tương tự, lấy tên cư dân để hiển thị cho Manager dễ quản lý
    cu_dan_ten = serializers.ReadOnlyField(source='cu_dan.ho_ten')

    class Meta:
        model = YeuCau
        fields = ['ma_yeu_cau', 'cu_dan', 'cu_dan_ten', 'tieu_de', 'noi_dung', 'trang_thai', 'phan_hoi_bql', 'ngay_gui']
        # Cư dân không được tự ý sửa trạng thái hay ngày gửi
        read_only_fields = ['cu_dan', 'ngay_gui']

class PhuongTienSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhuongTien
        fields = '__all__'
```

---

### 3. FILE: `services/views.py`

**Vai trò:** Logic nghiệp vụ, phân quyền và tự động điền dữ liệu (Auto-populate).

Python

```
from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import TinTuc, YeuCau, PhuongTien
from .serializers import (...)

# --- 1. View Quản lý Phương Tiện ---
class VehicleViewSet(viewsets.ModelViewSet):
    queryset = PhuongTien.objects.all()
    serializer_class = PhuongTienSerializer
    
    # Phân quyền động:
    # Sửa/Xóa/Thêm -> Chỉ Manager/Admin
    # Xem -> Cư dân cũng xem được (để biết mình đã đăng ký xe chưa)
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
             return [IsManagerOrAdmin()]
        return [permissions.IsAuthenticated()]

# --- 2. View Yêu Cầu Hỗ Trợ (Logic khó nhất file này) ---
class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = YeuCau.objects.all()
    serializer_class = YeuCauSerializer

    # Hàm hook chạy khi tạo mới (POST)
    def perform_create(self, serializer):
        # MỤC ĐÍCH: Tự động gán người gửi là cư dân đang đăng nhập.
        # Frontend không cần gửi field "cu_dan", Backend tự lấy từ Token.
        
        # 1. Check xem User này có liên kết với Cư dân nào không? (nhờ bảng User bên app users)
        if hasattr(self.request.user, 'cu_dan') and self.request.user.cu_dan:
            # 2. Lưu vào DB với cu_dan lấy từ request.user
            serializer.save(cu_dan=self.request.user.cu_dan)
        else:
            # Nếu là Admin (không phải cư dân) hoặc chưa link -> Lỗi
            raise serializers.ValidationError("User này chưa liên kết với hồ sơ Cư dân.")

    # Hàm lọc dữ liệu (Data Isolation)
    def get_queryset(self):
        user = self.request.user
        # Nếu là Sếp (Manager/Admin): Xem được TẤT CẢ khiếu nại của cả tòa nhà.
        if user.role == 'manager' or user.role == 'admin':
            return YeuCau.objects.all()
        
        # Nếu là Cư dân thường: Chỉ xem được khiếu nại CỦA CHÍNH MÌNH.
        # (Tránh việc ông A xem được ông B đang chửi bới BQL)
        if hasattr(user, 'cu_dan') and user.cu_dan:
            return YeuCau.objects.filter(cu_dan=user.cu_dan)
        
        return YeuCau.objects.none() # Không có quyền thì không thấy gì

# --- 3. View Tin Tức ---
class NewsViewSet(viewsets.ModelViewSet):
    # Sắp xếp bài mới nhất lên đầu (-ngay_dang)
    queryset = TinTuc.objects.all().order_by('-ngay_dang')
    serializer_class = TinTucSerializer

    def get_permissions(self):
        # Viết bài -> Manager
        if self.action in ['create', 'update', 'destroy']:
            return [IsManagerOrAdmin()]
        # Đọc bài -> Ai cũng đọc được (AllowAny - kể cả khách vãng lai chưa login)
        return [permissions.AllowAny()] 
    
    def perform_create(self, serializer):
        # Tự động lưu người đăng là user đang login (Manager)
        serializer.save(nguoi_dang=self.request.user)
```

---

### 4. FILE: `services/urls.py`

**Vai trò:** Định tuyến.

Python

```
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, SupportTicketViewSet, NewsViewSet

router = DefaultRouter()
# Tạo các đường dẫn chuẩn REST:
# /vehicles/
# /support-tickets/
# /news/
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'support-tickets', SupportTicketViewSet, basename='support-ticket')
router.register(r'news', NewsViewSet, basename='news')

urlpatterns = [
    path('', include(router.urls)),
]
```

---

### PHÂN TÍCH LUỒNG NGHIỆP VỤ THỰC TẾ

#### Kịch bản 1: Cư dân báo hỏng bóng đèn

1. **Hành động:** Cư dân (đã login) mở app, nhập tiêu đề "Hỏng đèn hành lang", nội dung "Tầng 5 tối thui". Bấm Gửi.
    
2. **Request:** `POST /support-tickets/` với body `{ "tieu_de": "...", "noi_dung": "..." }`. (Lưu ý: Không cần gửi ID cư dân).
    
3. **Views (`perform_create`):**
    
    - Backend kiểm tra Token -> Biết đây là User "nguyenvanA".
        
    - Check User "nguyenvanA" link tới Cư Dân ID=50.
        
    - Tự động điền `cu_dan_id = 50` vào phiếu yêu cầu.
        
    - Lưu xuống DB.
        
4. **Kết quả:** Tạo thành công yêu cầu cho đúng người, trạng thái mặc định "ChoXuLy".
    

#### Kịch bản 2: Manager xử lý yêu cầu

1. **Hành động:** Manager vào dashboard, thấy danh sách yêu cầu (do `get_queryset` trả về all).
    
2. **Request:** `PATCH /support-tickets/10/` với body `{ "trang_thai": "DaXuLy", "phan_hoi_bql": "Đã thay bóng mới" }`.
    
3. **Kết quả:** Cư dân nhận được thông báo (thấy trạng thái đổi) và xem được phản hồi.
    

#### Kịch bản 3: Tính tiền gửi xe (Liên kết với App Finance)

- Bảng `PhuongTien` ở đây đóng vai trò là dữ liệu đầu vào.
    
- Khi App Finance chạy tính toán (`batch_generate`): Nó sẽ query `PhuongTien.objects.filter(can_ho=apt).count()` để biết căn hộ này có bao nhiêu xe -> Nhân với đơn giá gửi xe.