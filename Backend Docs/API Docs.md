# Tài Liệu API Hệ Thống Quản Lý Chung Cư

**Base URL**: `/api/v1`

---

## 1. Xác thực & Người dùng (Authentication & Users)

### 1.1. Đăng nhập
- **Endpoint**: `/api/v1/auth/token/`
- **Method**: `POST`
- **Mô tả**: Đăng nhập hệ thống để nhận Token truy cập (JWT).
- **Role**: Tất cả (Khách).

**JSON Gửi đi**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**JSON Gửi về (200 OK)**:
```json
{
  "refresh": "eyJ0eX...",
  "access": "eyJ0eX...",
  "role": "ADMIN",
  "cu_dan_id": null,
  "username": "admin"
}
```

### 1.2. Làm mới Token (Refresh Token)
- **Endpoint**: `/api/v1/auth/token/refresh/`
- **Method**: `POST`
- **Mô tả**: Cấp lại Access Token mới khi token cũ hết hạn.
- **Role**: Tất cả.

**JSON Gửi đi**:
```json
{
  "refresh": "eyJ0eX..."
}
```

**JSON Gửi về (200 OK)**:
```json
{
  "access": "eyJ0eX...",
  "refresh": "..." // (Optional)
}
```

### 1.3. Lấy thông tin cá nhân (Profile)
- **Endpoint**: `/api/v1/users/me/`
- **Method**: `GET`
- **Mô tả**: Lấy thông tin chi tiết của người dùng đang đăng nhập.
- **Role**: Đã đăng nhập.

**JSON Gửi về (200 OK)**:
```json
{
  "id": 1,
  "username": "manager",
  "role": "QUAN_LY",
  "cu_dan_id": null,
  "is_active": true,
  "date_joined": "2024-01-01T12:00:00Z"
}
```

---

## 2. Quản lý Cư dân & Căn hộ (Residents App)

### 2.1. Danh sách Căn hộ (Apartments)
- **Endpoint**: `/api/v1/apartments/`
- **Method**: `GET`
- **Mô tả**: Xem danh sách căn hộ. Quản lý xem tất cả, Cư dân chỉ xem căn hộ mình đang ở.
- **Role**: Tất cả (Đã đăng nhập).

**JSON Gửi về (200 OK)**:
```json
[
  {
    "ma_can_ho": 1,
    "phong": "101",
    "tang": 1,
    "toa_nha": "A",
    "dien_tich": 75.5,
    "trang_thai": "H", // E: Trống, S: Đã bán, H: Đang thuê
    "chu_so_huu": 10 // ID của Cư dân chủ sở hữu
  }
]
```

### 2.2. Tạo Căn hộ mới
- **Endpoint**: `/api/v1/apartments/`
- **Method**: `POST`
- **Mô tả**: Thêm căn hộ mới vào hệ thống.
- **Role**: Quản lý (QUAN_LY), Admin.

**JSON Gửi đi**:
```json
{
  "phong": "205",
  "tang": 2,
  "toa_nha": "B",
  "dien_tich": 80.0,
  "trang_thai": "E"
}
```

### 2.3. Danh sách Cư dân
- **Endpoint**: `/api/v1/residents/`
- **Method**: `GET`
- **Mô tả**: Xem danh sách cư dân.
- **Role**: Tất cả (Filter theo quyền).

**JSON Gửi về (200 OK)**:
```json
[
  {
    "ma_cu_dan": 1,
    "ho_ten": "Nguyễn Văn A",
    "gioi_tinh": "M", // M: Nam, F: Nữ
    "ngay_sinh": "1990-05-20",
    "so_cccd": "001090000001",
    "so_dien_thoai": "0901234567",
    "la_chu_ho": true,
    "trang_thai_cu_tru": "TT", // TT: Tạm trú, TH: Thường trú, TV: Tạm vắng
    "can_ho_dang_o": 1
  }
]
```

### 2.4. Thêm Cư dân mới
- **Endpoint**: `/api/v1/residents/`
- **Method**: `POST`
- **Mô tả**: Tạo hồ sơ cư dân mới.
- **Role**: Quản lý, Admin.

**JSON Gửi đi**:
```json
{
  "ho_ten": "Trần Thị B",
  "gioi_tinh": "F",
  "ngay_sinh": "1995-08-15",
  "so_cccd": "001095000002",
  "so_dien_thoai": "0912345678",
  "la_chu_ho": false,
  "trang_thai_cu_tru": "TT",
  "can_ho_dang_o": 1 // ID căn hộ
}
```

---

## 3. Tài chính & Phí (Finance App)

### 3.1. Danh mục Phí (Fee Categories)
- **Endpoint**: `/api/v1/finance/fees/`
- **Method**: `GET`
- **Mô tả**: Xem bảng giá các loại phí (Phí quản lý, gửi xe...).
- **Role**: Tất cả.

**JSON Gửi về (200 OK)**:
```json
[
  {
    "ma_loai_phi": 1,
    "ten_loai_phi": "Phí Quản Lý",
    "dong_gia_hien_tai": "7000.00",
    "don_vi_tinh": "m2",
    "loai_phi": "BAT_BUOC"
  }
]
```

### 3.2. Hóa đơn (Invoices)
- **Endpoint**: `/api/v1/finance/invoices/`
- **Method**: `GET`
- **Mô tả**: Xem hóa đơn hàng tháng.
- **Role**: Cư dân (xem của mình), Kế toán (xem tất cả).

**JSON Gửi về (200 OK)**:
```json
[
  {
    "ma_hoa_don": 101,
    "can_ho": 1,
    "tieu_de": "Hóa đơn tháng 12/2025",
    "tong_tien": "1500000.00",
    "ngay_tao": "2025-12-01",
    "ngay_het_han": "2025-12-10",
    "trang_thai": "CHUA_THANH_TOAN",
    "chi_tiet": [
      {
         "ten_phi": "Phí quản lý",
         "so_luong": 75.5,
         "thanh_tien": "528500.00"
      }
    ]
  }
]
```

### 3.3. Đóng góp & Thiện nguyện (Donations)
- **Endpoint**: `/api/v1/finance/donations/`
- **Method**: `POST`
- **Mô tả**: Ghi nhận đóng góp của cư dân cho một đợt vận động.
- **Role**: Kế toán, Quản lý.

**JSON Gửi đi**:
```json
{
  "dot_dong_gop": 1, // ID đợt vận động (Ví dụ: Ủng hộ bão lụt)
  "can_ho": 1,
  "so_tien": "500000"
}
```

---

## 4. Dịch vụ & Tiện ích (Services App)

### 4.1. Phương tiện (Vehicles)
- **Endpoint**: `/api/v1/services/vehicles/`
- **Method**: `POST`
- **Mô tả**: Đăng ký xe mới cho căn hộ.
- **Role**: Quản lý.

**JSON Gửi đi**:
```json
{
  "can_ho": 1,
  "bien_so": "29A-12345",
  "loai_xe": "C", // C: Ô tô, M: Xe máy, B: Xe đạp
  "mo_ta": "Xe Vios màu đen"
}
```

### 4.2. Gửi Phản ánh (Support Tickets)
- **Endpoint**: `/api/v1/services/support-tickets/`
- **Method**: `POST`
- **Mô tả**: Cư dân gửi yêu cầu/phản ánh đến Ban quản lý.
- **Role**: Cư dân.

**JSON Gửi đi**:
```json
{
  "tieu_de": "Báo hỏng đèn hành lang",
  "noi_dung": "Đèn hành lang tầng 2 bị nhấp nháy, xin kiểm tra."
}
```

**JSON Gửi về (201 Created)**:
```json
{
  "ma_yeu_cau": 55,
  "tieu_de": "Báo hỏng đèn hành lang",
  "trang_thai": "W", // W: Chờ xử lý
  "ngay_gui": "2025-12-27T10:00:00Z"
}
```

### 4.3. Xử lý Phản ánh
- **Endpoint**: `/api/v1/services/support-tickets/{id}/`
- **Method**: `PATCH`
- **Mô tả**: Ban quản lý trả lời hoặc cập nhật trạng thái yêu cầu.
- **Role**: Quản lý.

**JSON Gửi đi**:
```json
{
  "trang_thai": "P", // P: Đang xử lý, D: Đã xong
  "phan_hoi_bql": "Đã tiếp nhận, kỹ thuật sẽ lên kiểm tra trong chiều nay."
}
```

---
**Ghi chú**:
- **Format ngày tháng**: `YYYY-MM-DD` (Ví dụ: `2025-12-27`).
- **Phân trang**: Các API danh sách (`GET`) mặc định hỗ trợ phân trang (Pagination). Kết quả thường nằm trong trường `results`.
