# Tài Liệu API Backend (Cập Nhật Mới Nhất)

Tài liệu này mô tả chi tiết các API endpoint hiện có trong hệ thống, dựa trên mã nguồn thực tế đã được cài đặt và kiểm tra.

## 1. App: Users (Quản lý Người dùng & Xác thực)

### Authentication
*   **Login**
    *   **Endpoint:** `POST /api/auth/token/`
    *   **Mô tả:** Đăng nhập hệ thống.
    *   **Input:** `{ "username": "...", "password": "..." }`
    *   **Output:** `{ "access": "...", "refresh": "..." }` (JWT Tokens)
*   **Refresh Token**
    *   **Endpoint:** `POST /api/auth/token/refresh/`
    *   **Mô tả:** Lấy Access Token mới khi token cũ hết hạn.
    *   **Input:** `{ "refresh": "..." }`
*   **Logout**
    *   **Endpoint:** `POST /api/auth/logout/`
    *   **Mô tả:** Đăng xuất (Blacklist Refresh Token).
    *   **Input:** `{ "refresh": "..." }`

### User Management
*   **Get Current User**
    *   **Endpoint:** `GET /api/users/me/`
    *   **Quyền:** Authenticated User.
    *   **Mô tả:** Lấy thông tin user đang đăng nhập (Role, Email, Link Cư dân...).
*   **Change Password**
    *   **Endpoint:** `POST /api/users/change-password/`
    *   **Quyền:** Authenticated User.
    *   **Input:** `{ "old_password": "...", "new_password": "..." }`
    *   **Logic:** Kiểm tra pass cũ -> Set pass mới (hash).
*   **List/Create Users**
    *   **Endpoint:** `GET /api/users/` | `POST /api/users/`
    *   **Quyền:** Admin.
    *   **Filter:** `?role=manager` (Lọc theo vai trò).
*   **User Detail / Update**
    *   **Endpoint:** `PATCH /api/users/{id}/`
    *   **Quyền:** Admin.
    *   **Mô tả:** Khóa tài khoản (`is_active=False`), đổi Role.
*   **Link Resident Profile**
    *   **Endpoint:** `POST /api/users/{id}/link-resident/`
    *   **Quyền:** Admin/Manager.
    *   **Input:** `{ "cu_dan_id": 123 }`
    *   **Logic:** Liên kết tài khoản User với một hồ sơ Cư dân cụ thể.

---

## 2. App: Residents (Cư dân & Căn hộ)

### Apartments (Căn hộ)
*   **List Apartments**
    *   **Endpoint:** `GET /api/apartments/`
    *   **Quyền:** Authenticated.
*   **Apartment Detail**
    *   **Endpoint:** `GET /api/apartments/{id}/`
    *   **Mô tả:** Xem chi tiết căn hộ, bao gồm **danh sách cư dân hiện tại**.
*   **Apartment History**
    *   **Endpoint:** `GET /api/apartments/{id}/history/`
    *   **Quyền:** Manager/Admin.
    *   **Logic:** Truy vấn bảng `BienDongDanCu` theo trường `can_ho`. Trả về lịch sử ai đã đến/đi khỏi căn hộ này.

### Residents (Cư dân)
*   **List Residents**
    *   **Endpoint:** `GET /api/residents/`
    *   **Filter:** `?name=...` (Tên), `?cccd=...` (Số CCCD).
*   **Move In (Chuyển đến)**
    *   **Endpoint:** `POST /api/residents/{id}/move-in/`
    *   **Quyền:** Manager.
    *   **Input:** `{ "apartment_id": 1, "la_chu_ho": true/false }`
    *   **Logic:**
        1.  Update `CuDan`: Gán `can_ho_dang_o`, set `la_chu_ho`.
        2.  Tạo `BienDongDanCu`: Loại 'ChuyenDen', lưu `can_ho`.
        3.  Update `CanHo`: Trạng thái 'DangO'.
*   **Move Out (Chuyển đi)**
    *   **Endpoint:** `POST /api/residents/{id}/move-out/`
    *   **Quyền:** Manager.
    *   **Logic:**
        1.  Update `CuDan`: `can_ho_dang_o = Null`.
        2.  Tạo `BienDongDanCu`: Loại 'ChuyenDi', lưu `can_ho` (căn vừa rời đi).

---

## 3. App: Finance (Tài chính & Hóa đơn)

### Fee Categories (Danh mục phí)
*   **Manage Fees**
    *   **Endpoint:** `/api/fee-categories/`
    *   **Quyền:** Manager (Edit), All (View).
    *   **Mô tả:** Quản lý đơn giá Điện, Nước, Phí quản lý, Gửi xe.

### Utility Readings (Chỉ số Điện/Nước)
*   **List Readings**
    *   **Endpoint:** `GET /api/utility-readings/`
*   **Batch Upload**
    *   **Endpoint:** `POST /api/utility-readings/batch/`
    *   **Quyền:** Manager.
    *   **Input:** List JSON `[{ "can_ho": 1, "loai_dich_vu": "Dien", "chi_so_moi": 100, ... }]`.

### Invoices (Hóa đơn)
*   **List Invoices**
    *   **Endpoint:** `GET /api/invoices/`
    *   **Filter:** `?status=0` (Chưa trả), `?month=12`.
*   **Batch Generate (Tạo hóa đơn hàng loạt)**
    *   **Endpoint:** `POST /api/invoices/batch-generate/`
    *   **Quyền:** Manager.
    *   **Input:** `{ "thang": 12, "nam": 2023 }`
    *   **Logic Chi Tiết:**
        1.  Lấy đơn giá hiện tại từ `DanhMucPhi` (Check an toàn: Điện, Nước, QL, Xe).
        2.  Loop tất cả căn hộ:
            *   Tính tiền Điện/Nước: `(Mới - Cũ) * Đơn giá`.
            *   Tính phí Quản lý: `Diện tích * Đơn giá`.
            *   Tính phí Gửi xe: `Số lượng xe * Đơn giá`.
        3.  Tạo `HoaDon` (Tổng tiền) và các dòng `ChiTietHoaDon` (Snapshot giá tại thời điểm tạo).
*   **Confirm Payment (Xác nhận thu tiền)**
    *   **Endpoint:** `POST /api/invoices/{id}/confirm-payment/`
    *   **Quyền:** Manager.
    *   **Logic:**
        *   Update `trang_thai = 1` (Đã thanh toán).
        *   Update `ngay_thanh_toan = Timezone.now()`.

### Analytics
*   **Monthly Revenue**
    *   **Endpoint:** `GET /api/analytics/monthly-revenue/?year=2023`
    *   **Output:** Bảng số liệu doanh thu (Phát sinh vs Thực thu) theo 12 tháng.

---

## 4. App: Services (Tiện ích & Phản ánh)

### Vehicles (Phương tiện)
*   **Manage Vehicles**
    *   **Endpoint:** `/api/vehicles/`
    *   **Mô tả:** Quản lý xe của cư dân (Biển số, Loại xe). Dùng để tính phí gửi xe.

### Support Tickets (Phản ánh/Yêu cầu)
*   **List Tickets**
    *   **Endpoint:** `GET /api/support-tickets/`
    *   **Logic:** Resident chỉ thấy ticket của mình. Manager thấy toàn bộ.
*   **Create Ticket**
    *   **Endpoint:** `POST /api/support-tickets/`
    *   **Quyền:** Resident (Owner).
    *   **Logic:** Tự động gán `cu_dan` dựa trên user đang login.
*   **Update Ticket**
    *   **Endpoint:** `PATCH /api/support-tickets/{id}/`
    *   **Quyền:** Manager.
    *   **Mô tả:** Cập nhật trạng thái (DangXuLy, DaXuLy) và nội dung phản hồi.

### News (Tin tức)
*   **Manage News**
    *   **Endpoint:** `/api/news/`
    *   **Mô tả:** Bảng tin chung cư.

---

## 5. App: Dashboard (Thống kê & Cross-cutting)

### Manager Dashboard
*   **Endpoint:** `GET /api/v1/dashboard/manager`
*   **Quyền:** Manager/Admin.
*   **Data:**
    *   Số hóa đơn chưa thu & Tổng tiền nợ.
    *   Số yêu cầu đang chờ xử lý.
    *   Tỉ lệ lấp đầy căn hộ (Occupancy Rate).

### Resident Dashboard
*   **Endpoint:** `GET /api/v1/dashboard/resident`
*   **Quyền:** Resident.
*   **Data:**
    *   Danh sách hóa đơn chưa thanh toán của chính mình.
    *   Thống kê trạng thái các yêu cầu đã gửi.

### Notifications
*   **Endpoint:** `POST /api/v1/notifications/send`
*   **Mô tả:** Gửi thông báo (Email/Push) tới cư dân (Logic mô phỏng).

### Audit Logs
*   **Endpoint:** `GET /api/v1/audit-logs/`
*   **Quyền:** Admin.
*   **Mô tả:** Xem lịch sử tác động hệ thống.
