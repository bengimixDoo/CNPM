# Tài Liệu API Chi Tiết - Hệ Thống Quản Lý Chung Cư

**Base URL**: `/api/v1`

---

## 1. AUTHENTICATION & USERS (Xác thực & Người dùng)
**Base Path**: `/users`

### 1.1. Đăng nhập (Login)
*   **Endpoint:** `/auth/token/`
*   **Method:** `POST`
*   **Role:** Tất cả (Khách)
*   **Mô tả:** Đăng nhập để nhận Access Token và Refresh Token.
*   **Request JSON:**
    ```json
    {
      "username": "manager",
      "password": "password123"
    }
    ```
*   **Response JSON (200 OK):**
    ```json
    {
      "refresh": "eyJ0eXAi...",
      "access": "eyJ0eXAi...",
      "role": "QUAN_LY",
      "cu_dan_id": null,
      "username": "manager"
    }
    ```

### 1.2. Làm mới Token (Refresh Token)
*   **Endpoint:** `/auth/token/refresh/`
*   **Method:** `POST`
*   **Role:** Tất cả
*   **Mô tả:** Cấp lại Access Token mới từ Refresh Token.
*   **Request JSON:**
    ```json
    {
      "refresh": "eyJ0eXAi..."
    }
    ```
*   **Response JSON (200 OK):**
    ```json
    {
      "access": "eyJ0eXAi...",
      "refresh": "eyJ0eXAi..." // (Tuỳ chọn)
    }
    ```

### 1.3. Lấy thông tin bản thân (Get Me)
*   **Endpoint:** `/users/me/`
*   **Method:** `GET`
*   **Role:** Đã đăng nhập
*   **Mô tả:** Xem thông tin tài khoản hiện tại.
*   **Response JSON (200 OK):**
    ```json
    {
      "id": 1,
      "username": "manager",
      "role": "QUAN_LY",
      "cu_dan_id": null,
      "is_active": true,
      "date_joined": "2024-01-01T00:00:00Z"
    }
    ```

### 1.4. Đổi mật khẩu
*   **Endpoint:** `/users/change-password/`
*   **Method:** `POST`
*   **Role:** Đã đăng nhập
*   **Request JSON:**
    ```json
    {
      "old_password": "password123",
      "new_password": "NewStrongPassword@123"
    }
    ```
*   **Response JSON (200 OK):**
    ```json
    {
      "message": "Đổi mật khẩu thành công"
    }
    ```

### 1.5. Tạo người dùng mới
*   **Endpoint:** `/users/users/`
*   **Method:** `POST`
*   **Role:** Quản lý (Manager)
*   **Mô tả:** Tạo tài khoản quản trị hoặc tài khoản cư dân.
*   **Request JSON:**
    ```json
    {
      "username": "resident101",
      "password": "password123",
      "role": "CU_DAN" // ADMIN, QUAN_LY, KE_TOAN, CU_DAN
    }
    ```
*   **Response JSON (201 Created):**
    ```json
    {
      "id": 5,
      "username": "resident101",
      "role": "CU_DAN"
    }
    ```

### 1.6. Liên kết User với Cư Dân
*   **Endpoint:** `/users/users/{id}/link-resident/`
*   **Method:** `POST`
*   **Role:** Quản lý (Manager)
*   **Mô tả:** Gắn tài khoản User vào một hồ sơ Cư Dân cụ thể.
*   **Request JSON:**
    ```json
    {
      "cu_dan_id": 10
    }
    ```
*   **Response JSON (200 OK):**
    ```json
    {
      "message": "Mapping thành công",
      "user": "resident101",
      "resident_linked": "Nguyễn Văn A",
      "resident_id": 10
    }
    ```

---

## 2. RESIDENTS APP (Cư dân & Căn hộ)

### 2.1. Quản lý Căn hộ (Apartments)
**Base Path:** `/apartments/`

#### 2.1.1. Danh sách Căn hộ
*   **Endpoint:** `/apartments/`
*   **Method:** `GET`
*   **Role:** Tất cả (Filter: Cư dân chỉ thấy nhà mình).
*   **Response JSON:**
    ```json
    [
      {
        "ma_can_ho": 1,
        "phong": "101",
        "tang": 1,
        "toa_nha": "A",
        "dien_tich": 70.0,
        "trang_thai": "H", // E=Trống, S=Đã bán, H=Đang thuê
        "chu_so_huu": 5 // ID Cư dân chủ hộ
      }
    ]
    ```

#### 2.1.2. Thống kê tổng quan (Dashboard)
*   **Endpoint:** `/apartments/thongke/`
*   **Method:** `GET`
*   **Role:** Quản lý, Kế toán
*   **Response JSON:**
    ```json
    {
      "tong_quan": {
        "tong_so_can_ho": 100,
        "so_can_trong_E": 10,
        "so_da_ban_S": 80,
        "so_dang_thue_H": 10
      },
      "chi_tiet": {
        "A": { "tong_can": 50, "trong": 5, ... }
      }
    }
    ```

#### 2.1.3. Chi tiết nhân khẩu 1 căn hộ
*   **Endpoint:** `/apartments/{id}/detail/`
*   **Method:** `GET`
*   **Role:** Quản lý, Kế toán
*   **Mô tả:** Xem ai đang ở trong căn hộ này.
*   **Response JSON:**
    ```json
    {
      "thong_tin_can_ho": { "phong": "101", ... },
      "thong_ke_nhan_khau": {
        "danh_sach_cu_dan": [ {"ma_cu_dan": 1, "ho_ten": "Nguyen Van A"} ],
        "tong_so_nguoi": 3
      }
    }
    ```

#### 2.1.4. Lịch sử thay đổi nhân khẩu của căn hộ
*   **Endpoint:** `/apartments/{id}/history/`
*   **Method:** `GET`
*   **Role:** Quản lý, Admin
*   **Response JSON:**
    ```json
    [
      {
        "ma_cu_dan": 1,
        "ten_cu_dan": "Nguyen Van A",
        "loai_bien_dong": "Tạm Trú",
        "ngay_thuc_hien": "2024-01-15"
      }
    ]
    ```

### 2.2. Quản lý Cư dân (Residents)
**Base Path:** `/residents/`

#### 2.2.1. Tạo hồ sơ Cư dân
*   **Endpoint:** `/residents/`
*   **Method:** `POST`
*   **Role:** Quản lý (Manager)
*   **Request JSON:**
    ```json
    {
      "ho_ten": "Nguyễn Văn B",
      "gioi_tinh": "M",
      "ngay_sinh": "1995-05-20",
      "so_cccd": "001234567890",
      "so_dien_thoai": "0987654321",
      "la_chu_ho": false,
      "trang_thai_cu_tru": "TT", // TT, TH, TV, OUT
      "can_ho_dang_o": 1
    }
    ```

#### 2.2.2. Lịch sử biến động cá nhân
*   **Endpoint:** `/residents/{id}/history/`
*   **Method:** `GET`
*   **Role:** Tất cả
*   **Mô tả:** Xem lại lịch sử chuyển đến/chuyển đi của 1 người.

### 2.3. Biến động Dân cư (History)
**Base Path:** `/history/`

#### 2.3.1. Ghi nhận biến động (Chuyển khẩu/Tạm vắng)
*   **Endpoint:** `/history/`
*   **Method:** `POST`
*   **Role:** Quản lý
*   **Request JSON:**
    ```json
    {
      "cu_dan": 1,
      "loai_bien_dong": "TV", // TV: Tạm vắng, OUT: Chuyển đi
      "ngay_thuc_hien": "2025-12-28",
      "ghi_chu": "Về quê ăn tết"
    }
    ```
---

## 3. FINANCE APP (Tài chính & Đóng góp)
**Base Path:** `/finance/`

### 3.1. Danh mục Phí (Fees)
*   **Endpoint:** `/finance/fees/`
*   **Method:** `GET`, `POST` (Manager/Accountant)
*   **Request JSON (Create):**
    ```json
    {
      "ten_loai_phi": "Phí Gửi Xe Ô Tô",
      "dong_gia_hien_tai": "1200000",
      "don_vi_tinh": "chiếc/tháng",
      "loai_phi": "BAT_BUOC" // BAT_BUOC, TU_NGUYEN, KHAC
    }
    ```

### 3.2. Hóa đơn (Invoices)
*   **Endpoint:** `/finance/invoices/`
*   **Method:** `GET`
*   **Role:** Cư dân (xem của mình), Kế toán (xem tất cả)
*   **Filter Params:** `?status=0` (Chưa TT), `?status=1` (Đã TT), `?month=12`

#### 3.2.1. Tạo hóa đơn hàng loạt
*   **Endpoint:** `/finance/invoices/generate/`
*   **Method:** `POST`
*   **Role:** Kế toán, Manager
*   **Request JSON:**
    ```json
    {
      "thang": 12,
      "nam": 2025
    }
    ```

#### 3.2.2. Xác nhận Thanh toán
*   **Endpoint:** `/finance/invoices/{id}/confirm-payment/`
*   **Method:** `POST`
*   **Role:** Kế toán (Xác nhận thu tiền), Cư dân (Báo đã chuyển khoản)
*   **Response JSON:**
    ```json
    { "message": "Xác nhận thanh toán thành công bởi Quản lý." }
    ```

### 3.3. Đợt vận động (Fundraising Drives)
*   **Endpoint:** `/finance/fundraising-drives/`
*   **Method:** `POST`
*   **Role:** Quản lý, Kế toán
*   **Request JSON:**
    ```json
    {
      "ten_dot": "Ủng hộ đồng bào lũ lụt",
      "ngay_bat_dau": "2025-10-01",
      "ngay_ket_thuc": "2025-10-31"
    }
    ```

#### 3.3.1. Phát động quyên góp (Launch)
*   **Endpoint:** `/finance/fundraising-drives/{id}/launch/`
*   **Method:** `POST`
*   **Role:** Quản lý
*   **Mô tả:** Tạo phiếu đóng góp cho tất cả các hộ dân.
*   **Request JSON:**
    ```json
    { "so_tien_goi_y": 50000 }
    ```

### 3.4. Đóng góp (Donations)
*   **Endpoint:** `/finance/donations/{id}/respond/`
*   **Method:** `POST`
*   **Role:** Cư dân
*   **Mô tả:** Cư dân xác nhận tham gia đóng góp.
*   **Request JSON:**
    ```json
    {
      "decision": "agree", // hoặc "reject"
      "so_tien": 100000 // Có thể đóng nhiều hơn gợi ý
    }
    ```

---

## 4. SERVICES APP (Dịch vụ & Tiện ích)
**Base Path:** `/services/`

### 4.1. Phương tiện (Vehicles)
*   **Endpoint:** `/services/vehicles/`
*   **Method:** `POST`
*   **Role:** Quản lý
*   **Request JSON:**
    ```json
    {
      "can_ho": 10,
      "bien_so": "30A-999.99",
      "loai_xe": "C", // C=Car, M=Motorbike, B=Bicycle
      "mo_ta": "Mercedes đen"
    }
    ```

### 4.2. Tin tức (News)
*   **Endpoint:** `/services/news/`
*   **Method:** `GET` (All), `POST` (Accountant/Manager)
*   **Request JSON:**
    ```json
    {
      "tieu_de": "Thông báo cắt điện",
      "noi_dung": "Cắt điện từ 8h-17h ngày 30/12 để bảo trì.",
      "loai_tin": "TB" // TB=Thông báo, SK=Sự kiện
    }
    ```

### 4.3. Bảng giá Dịch vụ (Pricing)
*   **Endpoint:** `/services/pricing/`
*   **Method:** `GET`, `POST` (Manager)
*   **Mô tả:** Quản lý bảng giá dịch vụ chung (Gym, BBQ,...).

### 4.4. Chỉ số Điện nước (Utilities)
*   **Endpoint:** `/services/utilities/`
*   **Method:** `POST`
*   **Role:** Kế toán, Manager
*   **Request JSON:**
    ```json
    {
      "can_ho": 1,
      "thang": 12,
      "nam": 2025,
      "chi_so_dien_cu": 1000,
      "chi_so_dien_moi": 1100,
      "chi_so_nuoc_cu": 50,
      "chi_so_nuoc_moi": 60
    }
    ```

### 4.5. Phản ánh & Yêu cầu (Support Tickets)
*   **Endpoint:** `/services/support-tickets/`
*   **Method:** `POST`
*   **Role:** Cư dân (Resident)
*   **Request JSON:**
    ```json
    {
      "tieu_de": "Vòi nước bị rò rỉ",
      "noi_dung": "Vòi nước bồn rửa bát bị rò rỉ nước, cần sửa gấp."
    }
    ```

#### 4.5.1. Xử lý phản ánh
*   **Endpoint:** `/services/support-tickets/{id}/`
*   **Method:** `PATCH`
*   **Role:** Quản lý (Manager)
*   **Request JSON:**
    ```json
    {
      "trang_thai": "P", // P=Processing, D=Done, C=Cancelled
      "phan_hoi_bql": "Kỹ thuật sẽ lên kiểm tra lúc 14h."
    }
    ```
