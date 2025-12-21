# admin.py
File `admin.py` trong Django đóng vai trò cấu hình giao diện **Admin Dashboard** (trang quản trị dành cho người điều hành hệ thống). Thay vì phải vào database để sửa dữ liệu thô, bạn dùng trang này để quản lý người dùng một cách trực quan.
#### a. Import các thành phần cần thiết
```
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
```

- **`admin`**: Thư viện gốc của Django để tạo trang quản trị.
    
- **`UserAdmin`**: Đây là một lớp đặc biệt của Django đã được xây dựng sẵn các tính năng để quản lý người dùng (như đổi mật khẩu, phân quyền, kiểm tra lịch sử đăng nhập). Vì bạn đang dùng Custom User, nên bạn cần kế thừa lớp này.
    
- **`User`**: Gọi Model `User` mà bạn đã định nghĩa trong file `models.py` ra để cấu hình.
#### b. Định nghĩa lớp `CustomUserAdmin`
Vì bạn đã thêm 2 trường mới vào Model User là `role` (vai trò) và `cu_dan` (liên kết cư dân), nên bạn phải khai báo để trang Admin của Django biết đường hiển thị chúng ra.
```
class CustomUserAdmin(UserAdmin):
    model = User
    # 1. Những cột sẽ hiển thị ở trang danh sách
    list_display = ['username', 'email', 'role', 'cu_dan', 'is_staff']
```

- **`list_display`**: Khi bạn vào mục "Users" trong trang Admin, bạn sẽ thấy một cái bảng. Dòng này quyết định bảng đó có các cột nào. Ở đây bạn chọn hiển thị: Tên đăng nhập, Email, Vai trò, Cư dân liên kết và trạng thái nhân viên.
#### c. Cấu hình các trường nhập liệu (Fields)
Django chia giao diện chỉnh sửa User thành từng nhóm (gọi là fieldsets).

```
    # 2. Cấu hình khi Chỉnh sửa (Edit) một User đã có
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'cu_dan')}),
    )
    
    # 3. Cấu hình khi Thêm mới (Add) một User
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'cu_dan')}),
    )
```
- Mặc định `UserAdmin` chỉ có các ô như Username, Password, Name...
    
- Bằng cách dùng `+ ( (None, {'fields': ('role', 'cu_dan')}), )`, bạn đang nói với Django: _"Hãy giữ nguyên các ô cũ, và thêm cho tôi một nhóm mới chứa 2 ô nhập liệu là **role** và **cu_dan** vào cuối trang"_.
#### d. Đăng ký với hệ thống

```
admin.site.register(User, CustomUserAdmin)
```

- Dòng này là bước cuối cùng để "kích hoạt". Nó bảo Django: _"Khi tôi truy cập vào trang Admin, hãy dùng cấu hình `CustomUserAdmin` này để quản lý bảng `User`"_.

Nếu không có file này, khi bạn vào trang Admin:

1. Bạn có thể không thấy bảng User (vì chưa register).
    
2. Hoặc nếu thấy, bạn cũng không thể chỉnh sửa được trường **Role** hay chọn **Cư dân** cho User đó trên giao diện web.

File này đảm bảo người quản trị hệ thống (Admin) có thể dễ dàng phân quyền "ai là Manager", "ai là Resident" và gắn tài khoản cho cư dân bằng cách chọn từ menu thả xuống (dropdown) một cách tiện lợi.

---
# models.py

File này định nghĩa bảng `User` trong database. Đây là nền móng của toàn bộ hệ thống xác thực.

```
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # 1. Định nghĩa các lựa chọn cho vai trò (Enum)
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('resident', 'Resident'),
    )
    
    # 2. Trường Role (Vai trò)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='resident')
    
    # 3. Trường Liên kết Cư dân (Quan hệ 1-nhiều hoặc 1-1 lỏng lẻo)
    cu_dan = models.ForeignKey('residents.CuDan', on_delete=models.SET_NULL, null=True, blank=True, related_name='user_account')
    
    def __str__(self):
        return f"{self.username} ({self.role})"
```

**Giải thích chi tiết:**

- **`AbstractUser`**: Bạn không dùng bảng User mặc định mà kế thừa `AbstractUser`. Điều này cho phép bạn giữ lại toàn bộ tính năng xịn sò của Django (đăng nhập, hash mật khẩu, first_name, last_name...) nhưng vẫn có thể chèn thêm cột riêng của mình.
    
- **`role`**: Đây là cột phân quyền cứng. Mặc định ai tạo tài khoản xong cũng sẽ là `resident` (cư dân) để an toàn.
    
- **`cu_dan`**:
    
    - **Logic nghiệp vụ**: Một tài khoản User đại diện cho một con người thực tế (Cư dân). Trường này giúp hệ thống biết "Tài khoản `nguyenvana` ứng với ông Nguyễn Văn A ở phòng 101".
        
    - **`'residents.CuDan'`**: Đây là cách gọi "Lazy reference". Vì app `users` và app `residents` có thể import lẫn nhau gây lỗi vòng tròn (circular import), nên bạn dùng chuỗi string để chỉ định model thay vì import trực tiếp.
        
    - **`on_delete=models.SET_NULL`**: Rất quan trọng! Nếu hồ sơ cư dân bị xóa (ví dụ dọn nhà đi), tài khoản đăng nhập này **không bị xóa theo** mà chỉ bị mất liên kết (`null`). Họ vẫn có thể đăng nhập (nhưng có thể không xem được gì).
        
    - **`related_name='user_account'`**: Giúp bạn truy ngược từ Cư dân ra User. Ví dụ: `cu_dan_A.user_account` sẽ ra danh sách các tài khoản user của cư dân đó (vì bạn dùng ForeignKey nên một cư dân lý thuyết có thể có nhiều user, nếu muốn 1-1 chặt chẽ thì dùng `OneToOneField`).

---
# serializers.py

**Vai trò:** Bộ lọc dữ liệu. Chuyển đổi JSON <-> Python Object và Validate dữ liệu.
```
# --- PHẦN IMPORT ---
from rest_framework import serializers
from django.contrib.auth import get_user_model
from residents.models import CuDan

User = get_user_model() # Lấy model User hiện tại của dự án (cái bạn vừa viết ở trên)
```
#### a. Class `UserSerializer`
Dùng cho việc: Xem thông tin user, Tạo user mới.
```
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Những trường sẽ xuất hiện trong API
        fields = ['id', 'username', 'email', 'role', 'cu_dan', 'is_active', 'date_joined']
        # read_only_fields: Những trường Client chỉ được XEM, không được SỬA
        read_only_fields = ['id', 'date_joined']
        # extra_kwargs: Cấu hình phụ
        extra_kwargs = {
            'password': {'write_only': True} # QUAN TRỌNG: Mật khẩu chỉ dùng để GHI (lúc tạo/đăng nhập), API không bao giờ trả về mật khẩu.
        }

    # Hàm create: Chạy khi có request POST tạo user
    def create(self, validated_data):
        # 1. Tách mật khẩu ra khỏi cục dữ liệu
        password = validated_data.pop('password', None)
        # 2. Tạo object user nhưng chưa lưu password
        instance = self.Meta.model(**validated_data)
        if password is not None:
            # 3. Mã hóa (Hash) mật khẩu (vd: '123' -> 'pbkdf2$sha256$...')
            instance.set_password(password)
        # 4. Lưu xuống DB
        instance.save()
        return instance
```

#### b. Class `LinkResidentSerializer`
Dùng cho việc: Kiểm tra dữ liệu khi gán cư dân.
```
class LinkResidentSerializer(serializers.Serializer):
    # Khai báo input đầu vào bắt buộc phải có cu_dan_id là số nguyên
    cu_dan_id = serializers.IntegerField(required=True)

    # Hàm validate_<tên_trường>: Django tự động chạy hàm này để kiểm tra logic riêng
    def validate_cu_dan_id(self, value):
        # Kiểm tra: Có ông cư dân nào mang ID này trong DB không?
        if not CuDan.objects.filter(pk=value).exists():
            # Nếu không có, ném lỗi 400 Bad Request
            raise serializers.ValidationError("Cư dân với ID này không tồn tại.")
        return value # Nếu ổn thì trả lại giá trị để dùng tiếp
```
---
# urls.py
**Vai trò:** Bản đồ chỉ đường. Client gõ URL nào -> Gọi View nào.
```
from django.urls import path
# Import các view có sẵn của thư viện simplejwt để làm Login/Refresh token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)
# Import các view mình tự viết
from .views import (
    UserMeView, ChangePasswordView, UserListView, UserDetailView, LinkResidentView
)

urlpatterns = [
    # --- NHÓM XÁC THỰC (AUTH) ---
    # Login: Gửi username/pass -> Nhận về Access/Refresh Token
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Refresh: Gửi Refresh Token -> Nhận về Access Token mới (khi cái cũ hết hạn)
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Logout: Gửi Refresh Token -> Server đưa vào danh sách đen (Blacklist) để không dùng được nữa
    path('auth/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),

    # --- NHÓM USER CÁ NHÂN ---
    path('users/me/', UserMeView.as_view(), name='user_me'),
    path('users/change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # --- NHÓM QUẢN TRỊ (ADMIN) ---
    # Lấy danh sách hoặc Tạo mới
    path('users/', UserListView.as_view(), name='user_list_create'),
    
    # Xem chi tiết/Sửa/Xóa một user cụ thể theo ID (<int:pk>)
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    
    # Liên kết user với cư dân
    path('users/<int:pk>/link-resident/', LinkResidentView.as_view(), name='link_resident'),
]
```
---
# views.py
**Vai trò:** Xử lý logic nghiệp vụ, nhận Request và trả về Response.
```
# --- PHẦN IMPORT ---
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, ChangePasswordSerializer, LinkResidentSerializer
from residents.models import CuDan

User = get_user_model()
```
#### a. PHẦN IMPORT
`from rest_framework import generics, permissions, status`

`generics`: Cung cấp **các class view dựng sẵn** cho CRUD:

|Class|Chức năng|
|---|---|
|`ListAPIView`|GET danh sách|
|`RetrieveAPIView`|GET chi tiết|
|`CreateAPIView`|POST tạo mới|
|`UpdateAPIView`|PUT / PATCH|
|`DestroyAPIView`|DELETE|
|`ListCreateAPIView`|GET + POST|
|`RetrieveUpdateDestroyAPIView`|GET + PUT + DELETE|
=> Giúp **viết API rất nhanh**, ít code, chuẩn REST.

`permissions`: Dùng để **kiểm soát ai được gọi API**
Ví dụ:
```
permissions.AllowAny        # Ai cũng gọi được 
permissions.IsAuthenticated # Phải đăng nhập 
permissions.IsAdminUser     # Chỉ admin`
```
=> Áp dụng ở permission_classes = [...]

`status`: Chứa **HTTP status code chuẩn**

| Status                         | Ý nghĩa        |
| ------------------------------ | -------------- |
| `status.HTTP_200_OK`           | Thành công     |
| `status.HTTP_201_CREATED`      | Tạo thành công |
| `status.HTTP_400_BAD_REQUEST`  | Sai dữ liệu    |
| `status.HTTP_401_UNAUTHORIZED` | Chưa đăng nhập |
| `status.HTTP_403_FORBIDDEN`    | Không có quyền |
| `status.HTTP_404_NOT_FOUND`    | Không tồn tại  |
=> Dùng để **trả response chuẩn REST**


`from rest_framework.response import Response`
`Response`: Thay cho `HttpResponse` của Django
```
return Response(
    {"message": "Success"},
    status=status.HTTP_200_OK
)
```
Tự động:
- Convert Python → JSON
- Set content-type
- Dễ đọc, dễ test


`from rest_framework.views import APIView`
`APIView`: View **thấp nhất (low-level)** trong DRF

Bạn tự định nghĩa từng method:
```
class MyView(APIView):
    def get(self, request):
    ...
	def post(self, request):         
	...
```
Dùng khi:
- Logic phức tạp
- Không phù hợp CRUD đơn giản
- Cần kiểm soát luồng xử lý


`from django.contrib.auth import get_user_model`
=> **Lấy User model đúng chuẩn**
Vì sao không import trực tiếp `User`?
❌ Không nên:
`from django.contrib.auth.models import User`
✔️ Nên:
`User = get_user_model()`
➡️ Vì:
- Có thể project dùng **Custom User Model**
- `get_user_model()` luôn trả đúng model đang cấu hình


➡️ User (auth) ≠ Cư dân (thực thể nghiệp vụ)
Thiết kế đúng:
- `User`: xác thực – phân quyền
- `CuDan`: dữ liệu thực tế

```
Request
   ↓ 
Permission (permissions)
   ↓ 
APIView / GenericView
   ↓
Serializer (validate + convert)
   ↓ 
Model (User / CuDan)
   ↓
Response + status
```
#### b. Phần Permission (Giấy phép ra vào)
```
class IsAdminUser(permissions.BasePermission):
    # Hàm has_permission trả về True (cho vào) hoặc False (chặn)
    def has_permission(self, request, view):
        # Logic: Phải có user (đã login) VÀ role của user đó là 'admin'
        return request.user and request.user.role == 'admin'

class IsManagerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        # Logic: Là Admin HOẶC là Manager đều được vào
        return request.user and (request.user.role == 'admin' or request.user.role == 'manager')
```
#### c. View: `UserMeView` (Xem chính mình)
```
class UserMeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated] # Chỉ cần đăng nhập là được

    # Ghi đè hàm get_object: Thay vì tìm theo ID trên URL, ta trả về chính người đang request
    def get_object(self):
        return self.request.user
```
#### d. View: `ChangePasswordView` (Đổi mật khẩu)
```
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Đưa dữ liệu vào serializer để check format
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            # Check pass cũ có đúng không
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Mật khẩu cũ không đúng."]}, status=status.HTTP_400_BAD_REQUEST)
            
            # Nếu đúng, set pass mới (tự động hash)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"message": "Đổi mật khẩu thành công."}, status=status.HTTP_200_OK)
        # Nếu format sai (vd thiếu trường), trả về lỗi
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```
#### e. View: `UserListView` (Admin quản lý)

```
class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all() # Mặc định lấy tất cả
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser] # Chỉ Admin

    # Ghi đè get_queryset để thêm tính năng lọc (Filter)
    def get_queryset(self):
        queryset = super().get_queryset()
        role = self.request.query_params.get('role') # Lấy tham số ?role=... từ URL
        if role:
            queryset = queryset.filter(role=role) # Lọc theo role nếu có
        return queryset
```
#### f. View: `LinkResidentView` (Liên kết User - Cư dân)
```
class LinkResidentView(APIView):
    permission_classes = [IsManagerOrAdmin] # Manager hoặc Admin

    # Nhận vào pk (ID của User) từ URL
    def post(self, request, pk, *args, **kwargs):
        # 1. Tìm User theo ID
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        # 2. Kiểm tra input (cu_dan_id)
        serializer = LinkResidentSerializer(data=request.data)
        if serializer.is_valid():
            cu_dan_id = serializer.validated_data['cu_dan_id']
            # 3. Tìm Cư Dân và Gán
            try:
                cu_dan = CuDan.objects.get(pk=cu_dan_id)
                user.cu_dan = cu_dan # Gán object cư dân vào trường cu_dan của user
                user.save() # Lưu thay đổi
                return Response({"message": f"Đã liên kết..."}, status=status.HTTP_200_OK)
            except CuDan.DoesNotExist:
                 return Response({"error": "Cư dân không tồn tại."}, status=404)
        
        return Response(serializer.errors, status=400)
```

---
# Phân tích luồng hoạt động
---
### 1. Luồng Xác thực & Bảo mật (Authentication)

#### A. Đăng nhập (Login)

- **Endpoint:** `POST /auth/token/`
    
- **Mục đích:** Đổi tên đăng nhập/mật khẩu lấy "chìa khóa" (Token) để vào hệ thống.
    
- **Luồng chạy:**
    
    1. **Request:** Client gửi JSON `{ "username": "admin", "password": "123" }`.
        
    2. **URLs:** `urls.py` nhận diện path `/auth/token/` và chuyển cho `TokenObtainPairView` (của thư viện `simplejwt`).
        
    3. **Xử lý:** Thư viện này tự động kiểm tra trong bảng `User` (Database):
        
        - Tìm user có username là "admin".
            
        - Kiểm tra hash của mật khẩu "123" có khớp không.
            
    4. **Response:**
        
        - Nếu đúng: Trả về 2 chuỗi `{ "access": "...", "refresh": "..." }`.
            
        - Nếu sai: Trả về lỗi 401 Unauthorized.

#### B. Làm mới Token (Refresh Token)

- **Endpoint:** `POST /auth/token/refresh/`
    
- **Mục đích:** Khi `access` token hết hạn (ví dụ sau 15 phút), dùng `refresh` token để xin cấp lại mà không cần đăng nhập lại.
    
- **Luồng chạy:**
    
    1. **Request:** Client gửi JSON `{ "refresh": "chuỗi_refresh_token_cũ" }`.
        
    2. **URLs:** Chuyển đến `TokenRefreshView`.
        
    3. **Xử lý:** Kiểm tra `refresh` token có hợp lệ và còn hạn không.
        
    4. **Response:** Trả về một `access` token mới tinh.

#### C. Đăng xuất (Logout)

- **Endpoint:** `POST /auth/logout/`
    
- **Mục đích:** Vô hiệu hóa `refresh` token để kẻ gian không thể dùng lại.
    
- **Luồng chạy:**
    
    1. **Request:** Client gửi JSON `{ "refresh": "chuỗi_refresh_token_cần_hủy" }`.
        
    2. **URLs:** Chuyển đến `TokenBlacklistView`.
        
    3. **Xử lý:** Đưa token này vào "Danh sách đen" (Blacklist).
        
    4. **Kết quả:** Từ giờ trở đi, token này không thể dùng để refresh được nữa.

---
### 2. Luồng Người dùng Cá nhân (Self-Service)

#### A. Xem thông tin bản thân (Me)

- **Endpoint:** `GET /users/me/`
    
- **Mục đích:** Frontend muốn biết "Tôi là ai?" để hiển thị Avatar/Tên.
    
- **Luồng chạy:**
    
    1. **Request:** Client gửi Header `Authorization: Bearer <access_token>`.
        
    2. **Views (`UserMeView`):**
        
        - Kiểm tra Token hợp lệ -> Xác định được User đang gọi (ví dụ: ID=5).
            
        - Gọi `get_object()` -> Trả về `request.user` (User ID=5).
            
    3. **Serializers (`UserSerializer`):** Biến đổi object User ID=5 thành JSON (bao gồm `id`, `username`, `role`, `cu_dan`...).
        
        - _Lưu ý:_ Mật khẩu bị loại bỏ ở bước này.
            
    4. **Response:** JSON thông tin user.

#### B. Đổi mật khẩu

- **Endpoint:** `POST /users/change-password/`
    
- **Luồng chạy:**
    
    1. **Request:** Client gửi `{ "old_password": "123", "new_password": "456" }`.
        
    2. **Views (`ChangePasswordView`):**
        
        - Gọi `ChangePasswordSerializer` để kiểm tra dữ liệu đầu vào.
            
        - Gọi `user.check_password("123")`: So sánh với mật khẩu trong DB.
            
            - Nếu sai: Trả lỗi 400.
                
            - Nếu đúng: Gọi `user.set_password("456")` -> Mã hóa mật khẩu mới -> `user.save()`.
                
    3. **Response:** `{ "message": "Đổi mật khẩu thành công." }`.
        

---
### 3. Luồng Quản trị (Admin/Manager Flow)

#### A. Lấy danh sách Users (có Lọc)

- **Endpoint:** `GET /users/?role=manager`
    
- **Mục đích:** Admin muốn xem danh sách các quản lý.
    
- **Luồng chạy:**
    
    1. **Request:** Client gửi GET kèm tham số `role=manager`.
        
    2. **Middleware:** Kiểm tra Token -> Xác thực User là Admin (qua `IsAdminUser`).
        
    3. **Views (`UserListView`):**
        
        - Chạy hàm `get_queryset()`: Lấy tất cả user (`User.objects.all()`).
            
        - Đọc tham số `role` từ URL -> Lọc lại: `queryset.filter(role='manager')`.
            
    4. **Serializers:** Chuyển danh sách kết quả thành mảng JSON `[{}, {}, ...]`.
        
    5. **Response:** Trả về danh sách.

#### B. Tạo User mới

- **Endpoint:** `POST /users/`
    
- **Mục đích:** Admin tạo tài khoản cho nhân viên mới.
    
- **Luồng chạy:**
    
    1. **Request:** Client gửi `{ "username": "nv_A", "password": "123", "role": "manager" }`.
        
    2. **Views (`UserListView`):**
        
        - Kiểm tra quyền Admin.
            
        - Gọi `UserSerializer` với data nhận được.
            
    3. **Serializers (`create`):**
        
        - Tách mật khẩu "123".
            
        - Tạo object User.
            
        - Gọi `set_password("123")` để mã hóa.
            
        - Lưu xuống DB.
            
    4. **Response:** JSON thông tin user vừa tạo (không có mật khẩu).

#### C. Chỉnh sửa User (Khóa tài khoản/Đổi Role)

- **Endpoint:** `PATCH /users/{id}/`
    
- **Mục đích:** Admin muốn khóa tài khoản nhân viên nghỉ việc.
    
- **Luồng chạy:**
    
    1. **Request:** Admin gửi `PATCH /users/10/` với body `{ "is_active": false }`.
        
    2. **Views (`UserDetailView`):**
        
        - Tìm User có ID=10 trong DB.
            
        - Gọi `UserSerializer` cập nhật trường `is_active`.
            
        - Lưu DB.
            
    3. **Response:** JSON thông tin user ID=10 sau khi cập nhật.

#### D. Liên kết Tài khoản với Cư dân (Nghiệp vụ đặc thù)

- **Endpoint:** `POST /users/{id}/link-resident/`
    
- **Mục đích:** Gán tài khoản đăng nhập cho một hồ sơ cư dân cụ thể.
    
- **Luồng chạy:**
    
    1. **Request:** Manager gửi `POST /users/5/link-resident/` với `{ "cu_dan_id": 99 }`.
        
    2. **Views (`LinkResidentView`):**
        
        - Kiểm tra quyền `IsManagerOrAdmin`.
            
        - Tìm User ID=5. Nếu không thấy -> Lỗi 404.
            
        - Gọi `LinkResidentSerializer` để validate `{ "cu_dan_id": 99 }`.
            
    3. **Serializers (`validate_cu_dan_id`):**
        
        - Truy vấn bảng `CuDan` xem có ID=99 không.
            
        - Nếu không có -> Lỗi "Cư dân không tồn tại".
            
    4. **Views (Tiếp):**
        
        - Lấy object Cư dân ID=99.
            
        - Gán: `user.cu_dan = cu_dan_99`.
            
        - Lưu: `user.save()`.
            
    5. **Models:** Thực thi câu lệnh SQL UPDATE trong bảng User.
        
    6. **Response:** `{ "message": "Đã liên kết user..." }`.