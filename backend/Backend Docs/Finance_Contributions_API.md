# Tài liệu API: Quản lý Đóng góp Tự nguyện (Finance - Contributions)

Tài liệu này mô tả chi tiết các API liên quan đến tính năng vận động và đóng góp tự nguyện.

**Authentication**: Tất cả API đều yêu cầu `Authorization: Bearer <token>`.

---

## 1. Quản lý Đợt vận động (Fundraising Drives)
**Tag**: `Finance - Fundraising Drives`
**Base URL**: `/api/v1/fundraising-drives/`

### 1.1. Lấy danh sách đợt vận động
*   **Method**: `GET`
*   **URL**: `/api/v1/fundraising-drives/`
*   **Permissions**: `Manager`, `Accountant`
*   **Response**:
    ```json
    [
        {
            "ma_dot": 1,
            "ten_dot": "Ủng hộ đồng bào lũ lụt miền Trung",
            "ngay_bat_dau": "2025-10-01",
            "ngay_ket_thuc": "2025-10-31",
            "mo_ta": "Quyên góp ủng hộ...",
            "tong_tien_dong_gop": 5000000.00,
            "so_luot_dong_gop": 50
        }
    ]
    ```

### 1.2. Tạo đợt vận động mới
*   **Method**: `POST`
*   **URL**: `/api/v1/fundraising-drives/`
*   **Permissions**: `Manager`, `Accountant`
*   **Body**:
    ```json
    {
        "ten_dot": "Tết Sum Vầy 2026",
        "ngay_bat_dau": "2026-01-01",
        "ngay_ket_thuc": "2026-02-01",
        "mo_ta": "Quyên góp trang trí Tết"
    }
    ```

### 1.3. Phát động quyên góp (Launch)
Tạo phiếu đóng góp ("Chờ xác nhận") gửi đến tất cả căn hộ đang có người ở.
*   **Method**: `POST`
*   **URL**: `/api/v1/fundraising-drives/{id}/launch/`
*   **Permissions**: `Manager`, `Accountant`
*   **Body** (Optional):
    ```json
    {
        "so_tien_goi_y": 50000
    }
    ```
*   **Response**:
    ```json
    {
        "message": "Đã phát động quyên góp tới 81 căn hộ."
    }
    ```

### 1.4. Xem thống kê đợt vận động
*   **Method**: `GET`
*   **URL**: `/api/v1/fundraising-drives/{id}/thong_ke/`
*   **Permissions**: `Manager`, `Accountant`
*   **Response**:
    ```json
    {
        "total_amount": 15000000.00,
        "count": 120
    }
    ```

---

## 2. Quản lý Phiếu đóng góp (Donations)
**Tag**: `Finance - Donations`
**Base URL**: `/api/v1/donations/`

### 2.1. Lấy danh sách phiếu đóng góp
*   **Method**: `GET`
*   **URL**: `/api/v1/donations/`
*   **Permissions**: `Authenticated`
    *   **Admin/Manager/Accountant**: Xem tất cả.
    *   **Resident**: Chỉ xem phiếu của căn hộ mình đang ở.
*   **Response**:
    ```json
    [
        {
            "ma_dong_gop": 101,
            "ten_can_ho": "A101",
            "ten_dot": "Tết Sum Vầy 2026",
            "so_tien": "50000.00",
            "ngay_dong": "2026-01-02T10:00:00Z",
            "hinh_thuc": "TM",
            "trang_thai": "CHO_XAC_NHAN",
            "dot_dong_gop": 2,
            "can_ho": 10
        }
    ]
    ```

### 2.2. Tạo phiếu đóng góp lẻ (Thủ công)
Dành cho Admin khi muốn tạo riêng lẻ cho 1 căn hộ (thay vì phát động hàng loạt).
*   **Method**: `POST`
*   **URL**: `/api/v1/donations/`
*   **Permissions**: `Manager`, `Accountant`
*   **Body**:
    ```json
    {
        "dot_dong_gop": 2,
        "can_ho": 10,
        "so_tien": 100000,
        "hinh_thuc": "TM"
    }
    ```
*   **Note**: Trạng thái mặc định sẽ là `CHO_XAC_NHAN`.

### 2.3. Cư dân phản hồi (Xác nhận/Từ chối)
Cư dân xác nhận đồng ý đóng góp (có thể sửa số tiền) hoặc từ chối.
*   **Method**: `POST`
*   **URL**: `/api/v1/donations/{id}/respond/`
*   **Permissions**: `Resident` (Chính chủ căn hộ)
*   **Body (Đồng ý)**:
    ```json
    {
        "decision": "agree",
        "so_tien": 100000  // (Tùy chọn) Nếu muốn thay đổi số tiền gợi ý
    }
    ```
*   **Body (Từ chối)**:
    ```json
    {
        "decision": "reject"
    }
    ```
*   **Response**:
    ```json
    {
        "message": "Đã xác nhận đóng góp."
    }
    ```

---

## 3. Quy trình hoạt động (Workflow)

1.  **Bước 1 (Admin)**: Tạo Đợt vận động mới (`POST /fundraising-drives/`).
2.  **Bước 2 (Admin)**: Vào chi tiết đợt, bấm "Phát động" (`POST /fundraising-drives/{id}/launch/`) với số tiền gợi ý.
3.  **Bước 3 (Hệ thống)**: Tự động tạo hàng loạt Phiếu đóng góp trạng thái `CHO_XAC_NHAN` cho cư dân.
4.  **Bước 4 (Cư dân)**:
    *   Mở App, thấy thông báo đóng góp.
    *   Gọi API `GET /donations/` để xem danh sách.
    *   Gọi API `POST /donations/{id}/respond/` để **Đồng ý** (kèm số tiền thực đóng) hoặc **Từ chối**.
5.  **Bước 5 (Admin)**: Theo dõi tiến độ qua API `GET /fundraising-drives/{id}/thong_ke/`.
