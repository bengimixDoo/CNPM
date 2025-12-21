# models.py
**Vai trò:** Định nghĩa các thực thể Căn hộ, Cư dân và Lịch sử biến động.
```
# --- PHẦN IMPORT ---
from django.db import models # Thư viện gốc để định nghĩa cấu trúc DB
```
#### Class `CanHo` (Căn hộ)
```
class CanHo(models.Model):
    # Khóa chính tự tăng
    ma_can_ho = models.AutoField(primary_key=True) 
    
    # Mã hiển thị (vd: A101). Unique=True để không có 2 phòng trùng tên.
    ma_hien_thi = models.CharField(max_length=20, unique=True) 
    
    # Các thông tin vật lý
    tang = models.IntegerField()
    toa_nha = models.CharField(max_length=50) # Block A, B...
    dien_tich = models.FloatField()
    
    # Trạng thái phòng: 'Trong' (Trống), 'DangO' (Đang ở)...
    trang_thai = models.CharField(max_length=50, default='Trong') 

    def __str__(self):
        return self.ma_hien_thi # Khi in ra sẽ hiện "A101" thay vì "CanHo object (1)"
```
#### Class `CuDan` (Cư dân)
```
class CuDan(models.Model):
    ma_cu_dan = models.AutoField(primary_key=True)
    ho_ten = models.CharField(max_length=100)
    ngay_sinh = models.DateField()
    
    # Số CCCD là duy nhất
    so_cccd = models.CharField(max_length=20, unique=True)
    so_dien_thoai = models.CharField(max_length=15)
    
    # QUAN TRỌNG: Liên kết Cư dân -> Căn hộ
    # Logic: Một người chỉ ở 1 căn tại 1 thời điểm.
    # on_delete=SET_NULL: Nếu xóa căn hộ, người này không bị xóa, chỉ mất liên kết.
    # related_name='cu_dan_hien_tai': Từ căn hộ gọi .cu_dan_hien_tai sẽ ra danh sách người đang ở.
    can_ho_dang_o = models.ForeignKey(CanHo, on_delete=models.SET_NULL, null=True, blank=True, related_name='cu_dan_hien_tai')
    
    # Đánh dấu chủ hộ
    la_chu_ho = models.BooleanField(default=False)
    
    # Tình trạng pháp lý: Thường trú/Tạm trú
    trang_thai_cu_tru = models.CharField(max_length=50, default='TamTru') 

    def __str__(self):
        return self.ho_ten
```
#### Class `BienDongDanCu` (Lịch sử)
```
class BienDongDanCu(models.Model):
    ma_bien_dong = models.AutoField(primary_key=True)
    
    # Ai biến động? (Nếu xóa cư dân -> Xóa luôn lịch sử này -> CASCADE)
    cu_dan = models.ForeignKey(CuDan, on_delete=models.CASCADE, related_name='bien_dong')
    
    # Biến động tại căn nào? (Cần thiết để truy vết lịch sử căn hộ)
    can_ho = models.ForeignKey(CanHo, on_delete=models.SET_NULL, null=True, blank=True, related_name='lich_su_bien_dong')
    
    # Loại: ChuyenDen, ChuyenDi...
    loai_bien_dong = models.CharField(max_length=50) 
    ngay_thuc_hien = models.DateField()

    def __str__(self):
        return f"{self.cu_dan.ho_ten} - {self.loai_bien_dong}"
```
---
# serializers.py
**Vai trò:** Kiểm soát dữ liệu đầu vào/ra. Điểm đặc biệt ở đây là bạn dùng nhiều Serializer khác nhau cho cùng 1 Model để phục vụ các mục đích khác nhau (List vs Detail).
```
from rest_framework import serializers
from .models import CanHo, CuDan, BienDongDanCu
```
#### a. Các Serializer Cơ bản
```
class CuDanSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuDan
        fields = '__all__' # Lấy hết các trường

class CanHoSerializer(serializers.ModelSerializer):
    """ Dùng cho việc liệt kê danh sách (List) - Nhẹ, không load data con """
    class Meta:
        model = CanHo
        fields = '__all__'
```
#### b. `CanHoDetailSerializer` (Nested Serializer)
Đây là kỹ thuật nâng cao: Nhúng dữ liệu con vào dữ liệu cha.
```
class CanHoDetailSerializer(serializers.ModelSerializer):
    # Nhúng danh sách cư dân đang ở vào chi tiết căn hộ
    # many=True: Vì 1 căn có nhiều người
    # read_only=True: Chỉ xem, không sửa cư dân trực tiếp qua API sửa căn hộ
    cu_dan_hien_tai = CuDanSerializer(many=True, read_only=True)

    class Meta:
        model = CanHo
        fields = '__all__'
```
#### c. `MoveInSerializer` (Serializer Nghiệp vụ)
Đây không phải ModelSerializer (không gắn với bảng nào). Nó đóng vai trò là cái **Form nhập liệu** (Input Validation).
```
class MoveInSerializer(serializers.Serializer):
    # Bắt buộc Client phải gửi ID căn hộ muốn chuyển đến
    apartment_id = serializers.IntegerField(required=True)
    
    # Có phải chủ hộ không? (Mặc định False)
    la_chu_ho = serializers.BooleanField(default=False)
```
---
# views.py
**Vai trò:** "Bộ não" xử lý. File này chứa logic phức tạp nhất về Transaction (Giao dịch).
```
# --- IMPORT ---
from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import CanHo, CuDan, BienDongDanCu
# Import các "Form" (serializer) đã định nghĩa
from .serializers import (...)
from datetime import date
from django.db import transaction # Quan trọng: Để đảm bảo toàn vẹn dữ liệu
```
#### a. Permission & ViewSet Căn Hộ
```
class CanHoViewSet(viewsets.ModelViewSet):
    queryset = CanHo.objects.all()
    
    # Kỹ thuật Dynamic Serializer:
    # Nếu đang xem chi tiết (action='retrieve') -> Dùng bản Detail (kèm cư dân).
    # Nếu xem danh sách -> Dùng bản thường (nhẹ hơn).
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CanHoDetailSerializer
        return CanHoSerializer

    # Phân quyền linh hoạt:
    # Sửa/Xóa -> Cần Manager/Admin.
    # Xem -> Chỉ cần đăng nhập là được.
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManagerOrAdmin()]
        return [permissions.IsAuthenticated()]

    # API xem lịch sử: GET /apartments/{id}/history/
    @decorators.action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        can_ho = self.get_object()
        # Tìm trong bảng BienDongDanCu những dòng có liên quan căn này
        history = BienDongDanCu.objects.filter(can_ho=can_ho).order_by('-ngay_thuc_hien')
        serializer = BienDongDanCuSerializer(history, many=True)
        return Response(serializer.data)
```
#### b. ViewSet Cư Dân & Logic Chuyển Đến/Đi
```
class CuDanViewSet(viewsets.ModelViewSet):
    # ... (Phần setup queryset/permission cơ bản)

    # ACTION: MOVE IN (Chuyển đến)
    # POST /residents/{id}/move-in/
    @decorators.action(detail=True, methods=['post'], url_path='move-in')
    def move_in(self, request, pk=None):
        cu_dan = self.get_object() # Lấy cư dân từ ID trên URL
        
        # Validate dữ liệu đầu vào (apartment_id)
        serializer = MoveInSerializer(data=request.data)
        if serializer.is_valid():
            apt_id = serializer.validated_data['apartment_id']
            # ... (Logic check căn hộ tồn tại)

            # TRANSACTION ATOMIC: "Tất cả hoặc không gì cả"
            # Nếu 1 trong các lệnh dưới đây lỗi, DB sẽ quay lại trạng thái ban đầu.
            with transaction.atomic():
                # 1. Cập nhật thông tin cư dân
                cu_dan.can_ho_dang_o = can_ho
                cu_dan.save()

                # 2. Ghi nhật ký biến động
                BienDongDanCu.objects.create(
                    cu_dan=cu_dan,
                    can_ho=can_ho,
                    loai_bien_dong='ChuyenDen', # Lưu ý type này
                    ngay_thuc_hien=date.today()
                )
                
                # 3. Cập nhật trạng thái phòng (nếu cần)
                if can_ho.trang_thai == 'Trong':
                     can_ho.trang_thai = 'DangO'
                     can_ho.save()

            return Response({"message": "..."})
        return Response(serializer.errors, status=400)

    # ACTION: MOVE OUT (Chuyển đi)
    # POST /residents/{id}/move-out/
    @decorators.action(detail=True, methods=['post'], url_path='move-out')
    def move_out(self, request, pk=None):
        cu_dan = self.get_object()
        
        with transaction.atomic():
            old_apt = cu_dan.can_ho_dang_o # Lưu lại căn cũ để ghi log
            
            # 1. Xóa liên kết căn hộ
            cu_dan.can_ho_dang_o = None
            cu_dan.save()

            # 2. Ghi nhật ký chuyển đi
            BienDongDanCu.objects.create(
                cu_dan=cu_dan,
                can_ho=old_apt, # Vẫn lưu là biến động tại căn cũ
                loai_bien_dong='ChuyenDi',
                ngay_thuc_hien=date.today()
            )

        return Response({"message": "..."})
```
---
# urls.py
**Vai trò:** Định tuyến tự động.
```
from rest_framework.routers import DefaultRouter
from .views import CanHoViewSet, CuDanViewSet

router = DefaultRouter()
# Tự động sinh ra các URL chuẩn REST:
# GET /apartments/ -> List
# POST /apartments/ -> Create
# GET /apartments/{id}/ -> Retrieve
# ... và các @action: /apartments/{id}/history/
router.register(r'apartments', CanHoViewSet, basename='apartment')
router.register(r'residents', CuDanViewSet, basename='resident')

urlpatterns = [
    path('', include(router.urls)),
]
```
---
# Phân tích luồng hoạt động
---
### 1. Nhóm API Quản lý Căn hộ (Apartments)

#### A. Lấy danh sách Căn hộ (List)

- **Endpoint:** `GET /apartments/`
    
- **Mục đích:** Xem danh sách tất cả căn hộ (để hiển thị bảng quản lý).
    
- **Luồng chạy:**
    
    1. **Request:** Client gửi `GET` tới `/apartments/`.
        
    2. **URLs:** `DefaultRouter` trong `urls.py` nhận diện prefix `apartments` và chuyển tới `CanHoViewSet`.
        
    3. **Views (`CanHoViewSet`):**
        
        - Gọi `get_serializer_class()`: Vì action là `list`, nó trả về `CanHoSerializer` (bản nhẹ, chỉ có thông tin cơ bản).
            
        - Gọi `get_queryset()`: Lấy toàn bộ `CanHo.objects.all()`.
            
    4. **Serializers:** Chuyển đổi List các object Căn hộ thành JSON.
        
    5. **Response:** Trả về danh sách JSON `[{"ma_hien_thi": "A101", ...}, ...]`.

#### B. Xem chi tiết Căn hộ (Retrieve) - _Có logic lồng dữ liệu_

- **Endpoint:** `GET /apartments/{id}/` (Ví dụ: `/apartments/5/`)
    
- **Mục đích:** Xem kỹ thông tin một căn hộ, **bao gồm cả những ai đang ở trong đó**.
    
- **Luồng chạy:**
    
    1. **Request:** Client gửi `GET` tới `/apartments/5/`.
        
    2. **Views (`CanHoViewSet`):**
        
        - Action là `retrieve`.
            
        - Hàm `get_serializer_class()` nhận thấy action `retrieve` nên đổi sang dùng **`CanHoDetailSerializer`**.
            
        - Hàm `get_object()` tìm Căn hộ có ID=5.
            
    3. **Serializers (`CanHoDetailSerializer`):**
        
        - Field `cu_dan_hien_tai` được định nghĩa là `CuDanSerializer(many=True)`.
            
        - Django tự động query bảng `CuDan` tìm những người có `can_ho_dang_o_id = 5`.
            
        - Gộp dữ liệu lại thành JSON lồng nhau.
            
    4. **Response:**
        
        JSON
        
        ```
        {
            "ma_hien_thi": "A101",
            "dien_tich": 70.5,
            "cu_dan_hien_tai": [  <-- Danh sách này được nhúng vào tự động
                { "ho_ten": "Nguyen Van A", "so_cccd": "..." },
                { "ho_ten": "Tran Thi B", "so_cccd": "..." }
            ]
        }
        ```
#### C. Xem lịch sử biến động của Căn hộ (Custom Action)

- **Endpoint:** `GET /apartments/{id}/history/`
    
- **Mục đích:** Xem lịch sử ai đã đến/đi khỏi căn này.
    
- **Luồng chạy:**
    
    1. **Views (`history`):**
        
        - Lấy object căn hộ hiện tại.
            
        - Query bảng `BienDongDanCu`: `filter(can_ho=can_ho)`.
            
        - Sắp xếp mới nhất lên đầu (`order_by('-ngay_thuc_hien')`).
            
    2. **Serializers (`BienDongDanCuSerializer`):** Serialize danh sách lịch sử này.
        
    3. **Response:** List lịch sử.

---
### 2. Nhóm API Quản lý Cư dân (Residents)

#### A. Tìm kiếm Cư dân (Search)

- **Endpoint:** `GET /residents/?name=Tuan&cccd=001`
    
- **Mục đích:** Tìm người tên Tuấn có số CCCD chứa 001.
    
- **Luồng chạy:**
    
    1. **Views (`CuDanViewSet`):**
        
        - Hàm `get_queryset()` được kích hoạt.
            
        - Lấy tham số `name` và `cccd` từ URL.
            
        - Thực hiện filter: `filter(ho_ten__icontains="Tuan")` và `filter(so_cccd__icontains="001")`.
            
    2. **Response:** Trả về danh sách kết quả tìm được.

---
### 3. Nhóm Nghiệp vụ Phức tạp (Complex Business Logic)
Đây là phần quan trọng nhất, sử dụng `transaction.atomic` để đảm bảo dữ liệu không bị lỗi nửa vời.
#### A. Nghiệp vụ Chuyển đến (Move In)

- **Endpoint:** `POST /residents/{id}/move-in/`
    
- **Body:** `{ "apartment_id": 10, "la_chu_ho": true }`
    
- **Luồng chạy:**
    
    1. **Views (`move_in`):** Nhận request cho cư dân (ví dụ ID=99).
        
    2. **Validation (`MoveInSerializer`):**
        
        - Kiểm tra xem `apartment_id` có được gửi lên không.
            
        - Kiểm tra ID căn hộ (10) có tồn tại trong DB không (`CanHo.objects.get`). Nếu không -> Lỗi 404.
            
    3. **Database Transaction (Bắt đầu `atomic`):**
        
        - **Bước 3.1 (Update Cư dân):** Gán `cu_dan.can_ho_dang_o = can_ho_10`, update `la_chu_ho = True`.
            
        - **Bước 3.2 (Tạo Lịch sử):** `INSERT INTO BienDongDanCu` (Loại: 'ChuyenDen', Ngày: Hôm nay).
            
        - **Bước 3.3 (Update Căn hộ):** Nếu căn hộ đang trạng thái 'Trong', đổi thành 'DangO'.
            
    4. **Kết thúc:** Nếu cả 3 bước trên thành công -> **Commit** (Lưu thật). Nếu 1 bước lỗi -> **Rollback** (Hủy hết, coi như chưa làm gì).
        
    5. **Response:** Thông báo thành công.

#### B. Nghiệp vụ Chuyển đi (Move Out)

- **Endpoint:** `POST /residents/{id}/move-out/`
    
- **Luồng chạy:**
    
    1. **Views (`move_out`):** Nhận request cho cư dân ID=99.
        
    2. **Database Transaction:**
        
        - Lưu tạm căn hộ cũ vào biến `old_apt` để ghi vào lịch sử sau này.
            
        - **Bước 2.1 (Update Cư dân):** Set `can_ho_dang_o = None` (Cư dân bơ vơ, không thuộc căn nào), `la_chu_ho = False`.
            
        - **Bước 2.2 (Tạo Lịch sử):** `INSERT INTO BienDongDanCu` (Loại: 'ChuyenDi', Căn hộ: `old_apt`).
            
    3. **Response:** "Cư dân đã chuyển đi".

---
### 4. Hệ thống Phân quyền (Permissions)
Trong `views.py`, bạn định nghĩa class `IsManagerOrAdmin`. Nó hoạt động như một cái "cổng bảo vệ" cho các API nguy hiểm:

- **API An toàn (Read-only):** Như `list` (xem danh sách), `retrieve` (xem chi tiết) -> **`AllowAny` hoặc `IsAuthenticated`** (Ai đăng nhập rồi cũng xem được).
    
- **API Nguy hiểm (Write):** Như `create`, `update`, `delete`, `move_in`, `move_out` -> **`IsManagerOrAdmin`**.
    
    - **Luồng check:** Khi gọi `POST /residents/`, Django chạy hàm `has_permission`. Nó soi `request.user.role`. Nếu là `resident` -> Chặn ngay (Lỗi 403 Forbidden). Chỉ `manager` hoặc `admin` mới được đi tiếp vào xử lý logic.

# Tóm tắt kiến trúc của App Residents

App này của bạn được thiết kế rất chuẩn mực cho backend:

1. **Tách biệt dữ liệu đọc/ghi:** Dùng Serializer riêng cho List (nhẹ) và Detail (nặng, nhiều thông tin).
    
2. **Toàn vẹn dữ liệu:** Sử dụng Transaction cho các nghiệp vụ liên quan đến nhiều bảng (Chuyển nhà đụng tới cả Cư dân, Căn hộ và Lịch sử).
    
3. **Logic RESTful:** Sử dụng `@action` để tạo các endpoint ngữ nghĩa (`move-in`, `history`) thay vì nhồi nhét vào `update`.