## 1. Authentication (Xác thực)

### 1.1. Đăng Nhập
*   **Endpoint**: `POST /auth/token/`
*   **Input**:
    ```json
    {
        "username": "admin",
        "password": "password123"
    }
    ```
*   **Output (200 OK)**:
    ```json
    {
        "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### 1.2. Refresh Token
*   **Endpoint**: `POST /auth/token/refresh/`
*   **Input**:
    ```json
    {
        "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Output (200 OK)**:
    ```json
    {
        "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### 1.3. Đăng Xuất (Logout)
*   **Endpoint**: `POST /auth/logout/`
*   **Input**:
    ```json
    {
        "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Output (200 OK)**:
    ```json
    {}
    ```

---

## 2. Users (Người dùng)

### 2.1. Lấy thông tin User hiện tại (Get Me)
*   **Endpoint**: `GET /users/me/`
*   **Output (200 OK)**:
    ```json
    {
        "id": 1,
        "username": "manager01",
        "email": "manager@example.com",
        "role": "manager",
        "cu_dan": null,
        "is_active": true,
        "date_joined": "2023-10-20T10:00:00Z"
    }
    ```
    *Lưu ý: Nếu là Resident, trường `cu_dan` sẽ là ID hồ sơ cư dân (VD: `5`).*

### 2.2. Đổi Mật Khẩu
*   **Endpoint**: `POST /users/change-password/`
*   **Input**:
    ```json
    {
        "old_password": "old_password123",
        "new_password": "new_password123"
    }
    ```
*   **Output (200 OK)**:
    ```json
    {
        "message": "Đổi mật khẩu thành công."
    }
    ```

---

## 3. Residents (Quản lý Cư dân)

### 3.1. Danh sách Căn hộ
*   **Endpoint**: `GET /apartments/`
*   **Output (200 OK)**:
    ```json
    [
        {
            "ma_can_ho": 1,
            "ma_hien_thi": "A101",
            "tang": 1,
            "toa_nha": "Block A",
            "dien_tich": 75.5,
            "trang_thai": "Trong"
        },
        {
            "ma_can_ho": 2,
            "ma_hien_thi": "A102",
            "tang": 1,
            "toa_nha": "Block A",
            "dien_tich": 80.0,
            "trang_thai": "DangO"
        }
    ]
    ```

### 3.2. Chi tiết Căn hộ (Kèm cư dân)
*   **Endpoint**: `GET /apartments/{id}/`
*   **Output (200 OK)**:
    ```json
    {
        "ma_can_ho": 2,
        "ma_hien_thi": "A102",
        "tang": 1,
        "toa_nha": "Block A",
        "dien_tich": 80.0,
        "trang_thai": "DangO",
        "cu_dan_hien_tai": [
            {
                "ma_cu_dan": 5,
                "ho_ten": "Nguyen Van B",
                "so_dien_thoai": "0912345678",
                "la_chu_ho": true
            }
        ]
    }
    ```

### 3.3. Chuyển đến (Move In)
*   **Endpoint**: `POST /residents/{id}/move-in/`
*   **Input**:
    ```json
    {
        "apartment_id": 1,
        "la_chu_ho": true
    }
    ```
*   **Output (200 OK)**:
    ```json
    {
        "message": "Cư dân Nguyen Van A đã chuyển vào A101"
    }
    ```

### 3.4. Chuyển đi (Move Out)
*   **Endpoint**: `POST /residents/{id}/move-out/`
*   **Input**: *(Không cần body)*
*   **Output (200 OK)**:
    ```json
    {
        "message": "Cư dân Nguyen Van A đã chuyển đi."
    }
    ```

---

## 4. Finance (Tài chính)

### 4.1. Cấu hình Phí
*   **Endpoint**: `GET /fee-categories/`
*   **Output (200 OK)**:
    ```json
    [
        {
            "ma_loai_phi": 1,
            "ten_loai_phi": "Tien Dien",
            "dong_gia_hien_tai": "3000.00",
            "don_vi_tinh": "kwh"
        },
        {
            "ma_loai_phi": 2,
            "ten_loai_phi": "Phi Quan Ly",
            "dong_gia_hien_tai": "10000.00",
            "don_vi_tinh": "m2"
        }
    ]
    ```

### 4.2. Nhập chỉ số Điện/Nước (Batch)
*   **Endpoint**: `POST /utility-readings/batch/`
*   **Input**:
    ```json
    [
        {
            "can_ho": 1,
            "loai_dich_vu": "Dien",
            "thang": 12,
            "nam": 2023,
            "chi_so_cu": 100,
            "chi_so_moi": 250,
            "ngay_chot": "2023-12-20"
        },
        {
            "can_ho": 1,
            "loai_dich_vu": "Nuoc",
            "thang": 12,
            "nam": 2023,
            "chi_so_cu": 50,
            "chi_so_moi": 60,
            "ngay_chot": "2023-12-20"
        }
    ]
    ```
*   **Output (201 Created)**:
    ```json
    {
        "message": "Đã nhập 2 chỉ số."
    }
    ```

### 4.3. Tạo Hóa Đơn (Batch Generate)
*   **Endpoint**: `POST /invoices/batch-generate/`
*   **Input**:
    ```json
    {
        "thang": 12,
        "nam": 2023
    }
    ```
*   **Output (200 OK)**:
    ```json
    {
        "message": "Đã tạo 10 hóa đơn cho tháng 12/2023."
    }
    ```

### 4.4. Chi tiết Hóa đơn
*   **Endpoint**: `GET /invoices/{id}/`
*   **Output (200 OK)**:
    ```json
    {
        "ma_hoa_don": 15,
        "can_ho": 1,
        "can_ho_info": "A101",
        "thang": 12,
        "nam": 2023,
        "tong_tien": "1500000.00",
        "trang_thai": 0,
        "ngay_tao": "2023-12-21T10:00:00Z",
        "chi_tiet": [
            {
                "ten_phi_snapshot": "Tiền Điện (T12)",
                "so_luong": 150,
                "dong_gia_snapshot": "3000.00",
                "thanh_tien": "450000.00"
            },
            {
                "ten_phi_snapshot": "Phí Quản lý (75.5m2)",
                "so_luong": 75,
                "dong_gia_snapshot": "10000.00",
                "thanh_tien": "755000.00"
            }
        ]
    }
    ```

### 4.5. Xác nhận Thanh toán
*   **Endpoint**: `POST /invoices/{id}/confirm-payment/`
*   **Input**: *(Không cần body)*
*   **Output (200 OK)**:
    ```json
    {
        "message": "Xác nhận thanh toán thành công."
    }
    ```

---

## 5. Services (Tiện ích)

### 5.1. Đăng ký Xe
*   **Endpoint**: `POST /vehicles/`
*   **Input**:
    ```json
    {
        "can_ho": 1,
        "bien_so": "30A-123.45",
        "loai_xe": "Oto"
    }
    ```
*   **Output (201 Created)**:
    ```json
    {
        "ma_xe": 1,
        "bien_so": "30A-123.45",
        "loai_xe": "Oto",
        "can_ho": 1
    }
    ```

### 5.2. Gửi Yêu cầu (Support Ticket)
*   **Endpoint**: `POST /support-tickets/`
*   **Input**:
    ```json
    {
        "tieu_de": "Hỏng đèn hành lang",
        "noi_dung": "Đèn hành lang tầng 3 nhấp nháy liên tục."
    }
    ```
*   **Output (201 Created)**:
    ```json
    {
        "ma_yeu_cau": 5,
        "tieu_de": "Hỏng đèn hành lang",
        "trang_thai": "ChoXuLy",
        "ngay_gui": "2023-12-21T14:30:00Z"
    }
    ```

### 5.3. Tin Tức (News)
*   **Endpoint**: `GET /news/`
*   **Output (200 OK)**:
    ```json
    [
        {
            "ma_tin": 1,
            "tieu_de": "Thông báo cắt nước",
            "noi_dung": "Cắt nước từ 8h-17h ngày 22/12...",
            "nguoi_dang_ten": "admin",
            "ngay_dang": "2023-12-20T08:00:00Z"
        }
    ]
    ```

---

## 6. Dashboard & Quản Trị

### 6.1. Manager Dashboard
*   **Endpoint**: `GET /v1/dashboard/manager`
*   **Output (200 OK)**:
    ```json
    {
        "unpaid_invoices_count": 5,
        "total_unpaid_amount": 12500000.00,
        "pending_tickets": 3,
        "occupancy_rate": 85.5,
        "total_apartments": 100
    }
    ```

### 6.2. Resident Dashboard
*   **Endpoint**: `GET /v1/dashboard/resident`
*   **Output (200 OK)**:
    ```json
    {
        "unpaid_invoices": [
            {
                "ma_hoa_don": 15,
                "thang": 12,
                "nam": 2023,
                "tong_tien": "1500000.00"
            }
        ],
        "my_tickets_status": [
            { "trang_thai": "ChoXuLy", "count": 1 },
            { "trang_thai": "DaXuLy", "count": 2 }
        ]
    }
    ```

### 6.3. Biểu đồ Doanh thu
*   **Endpoint**: `GET /analytics/monthly-revenue/?year=2023`
*   **Output (200 OK)**:
    ```json
    {
        "nam": "2023",
        "data": [
            { "thang": 1, "phat_sinh": 50000000, "thuc_thu": 48000000 },
            { "thang": 2, "phat_sinh": 52000000, "thuc_thu": 52000000 },
            ...
            { "thang": 12, "phat_sinh": 60000000, "thuc_thu": 15000000 }
        ]
    }
    ```

### 6.4. Gửi Thông Báo (Notification)
*   **Endpoint**: `POST /v1/notifications/send`
*   **Input**:
    ```json
    {
        "title": "Thông báo khẩn",
        "message": "Họp tổ dân phố..."
    }
    ```
*   **Output (200 OK)**:
    ```json
    {
        "message": "Đã gửi thông báo..."
    }
    ```

### 6.5. Nhật Ký Hệ Thống (Audit Logs)
*   **Endpoint**: `GET /v1/audit-logs/`
*   **Output (200 OK)**:
    ```json
    [
        { "action": "LOGIN", "user": "admin", "time": "2023-10-20 10:00" },
        { "action": "CREATE_USER", "user": "admin", "time": "2023-10-20 10:05" }
    ]
    ```
