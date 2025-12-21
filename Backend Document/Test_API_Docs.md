# Hướng Dẫn Test API Với Bruno

Tài liệu này hướng dẫn chi tiết từng bước để kiểm thử (test) toàn bộ API của hệ thống bằng công cụ Bruno (hoặc Postman).

## 1. Cấu Hình Chung (Environment Setup)

Tạo một Environment mới trong Bruno (ví dụ: `CNPM_Local`) với các biến sau:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `baseUrl` | `http://127.0.0.1:8000/api` | URL gốc của Backend |
| `adminToken` | *(Để trống ban đầu)* | Access Token của Admin |
| `managerToken` | *(Để trống ban đầu)* | Access Token của Manager |
| `residentToken` | *(Để trống ban đầu)* | Access Token của Cư dân |

---

## 2. App: Users (Xác thực & User)

### 2.1. Auth - Login (Lấy Token)
*   **Tên Request:** `Login Admin`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/auth/token/`
*   **Body (JSON):**
    ```json
    {
      "username": "admin",
      "password": "admin_password"
    }
    ```
*   **Test Script (Post Response):**
    ```js
    // Lưu token vào biến môi trường
    bru.setEnvVar("adminToken", res.body.access);
    ```

### 2.2. Auth - Refresh Token
*   **Tên Request:** `Refresh Token`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/auth/token/refresh/`
*   **Body (JSON):**
    ```json
    {
      "refresh": "YOUR_REFRESH_TOKEN_HERE"
    }
    ```

### 2.3. Get Current User Info
*   **Tên Request:** `Get Me`
*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/users/me/`
*   **Auth:** Bearer Token (`{{adminToken}}`)

### 2.4. Create User (Admin Only)
*   **Tên Request:** `Create Manager User`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/users/`
*   **Auth:** Bearer Token (`{{adminToken}}`)
*   **Body (JSON):**
    ```json
    {
      "username": "manager01",
      "password": "password123",
      "role": "manager",
      "email": "manager@example.com"
    }
    ```

### 2.5. Link User to Resident Profile
*   **Tên Request:** `Link User-Resident`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/users/2/link-resident/` (Thay `2` bằng ID user vừa tạo)
*   **Auth:** Bearer Token (`{{adminToken}}`)
*   **Body (JSON):**
    ```json
    {
      "cu_dan_id": 1
    }
    ```

---

## 3. App: Residents (Cư dân & Căn hộ)

### 3.1. Create Apartment
*   **Tên Request:** `Create Apartment`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/apartments/`
*   **Auth:** Bearer Token (`{{adminToken}}`)
*   **Body (JSON):**
    ```json
    {
      "ma_hien_thi": "A101",
      "tang": 1,
      "toa_nha": "Block A",
      "dien_tich": 75.5,
      "trang_thai": "Trong"
    }
    ```

### 3.2. Create Resident Profile
*   **Tên Request:** `Create Resident`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/residents/`
*   **Auth:** Bearer Token (`{{adminToken}}`)
*   **Body (JSON):**
    ```json
    {
      "ho_ten": "Nguyen Van A",
      "ngay_sinh": "1990-01-01",
      "so_cccd": "0123456789",
      "so_dien_thoai": "0987654321"
    }
    ```

### 3.3. Move In (Chuyển đến)
*   **Tên Request:** `Resident Move In`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/residents/1/move-in/` (Thay `1` bằng ID Resident)
*   **Auth:** Bearer Token (`{{adminToken}}`)
*   **Body (JSON):**
    ```json
    {
      "apartment_id": 1,
      "la_chu_ho": true
    }
    ```

### 3.4. View Apartment History
*   **Tên Request:** `Apartment History`
*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/apartments/1/history/`
*   **Auth:** Bearer Token (`{{adminToken}}`)

---

## 4. App: Finance (Tài chính)

### 4.1. Setup Fee Categories (Quan trọng)
*   **Tên Request:** `Create Fee - Dien`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/fee-categories/`
*   **Auth:** Bearer Token (`{{adminToken}}`)
*   **Body (JSON):**
    ```json
    { "ten_loai_phi": "Tien Dien", "dong_gia_hien_tai": 3000, "don_vi_tinh": "kwh" }
    ```
*   *Lặp lại cho: "Tien Nuoc" (20000/m3), "Phi Quan Ly" (10000/m2), "Phi Gui Xe" (150000/xe).*

### 4.2. Upload Utility Readings (Chỉ số điện nước)
*   **Tên Request:** `Batch Upload Readings`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/utility-readings/batch/`
*   **Auth:** Bearer Token (`{{adminToken}}`)
*   **Body (JSON):**
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

### 4.3. Generate Invoices (Tạo hóa đơn)
*   **Tên Request:** `Generate Invoices`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/invoices/batch-generate/`
*   **Auth:** Bearer Token (`{{adminToken}}`)
*   **Body (JSON):**
    ```json
    {
      "thang": 12,
      "nam": 2023
    }
    ```

### 4.4. View Invoice Detail
*   **Tên Request:** `Get Invoice Detail`
*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/invoices/1/`
*   **Auth:** Bearer Token (`{{adminToken}}`)
*   **Expected:** Kiểm tra trường `chi_tiet` xem có đủ dòng phí Điện, Nước, Quản lý không.

### 4.5. Confirm Payment
*   **Tên Request:** `Confirm Payment`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/invoices/1/confirm-payment/`
*   **Auth:** Bearer Token (`{{adminToken}}`)

---

## 5. App: Services (Dịch vụ)

### 5.1. Register Vehicle
*   **Tên Request:** `Add Vehicle`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/vehicles/`
*   **Auth:** Bearer Token (`{{adminToken}}`)
*   **Body (JSON):**
    ```json
    {
      "can_ho": 1,
      "bien_so": "29A-12345",
      "loai_xe": "Oto"
    }
    ```

### 5.2. Create Support Ticket
*   **Tên Request:** `Create Ticket`
*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/support-tickets/`
*   **Auth:** Bearer Token (`{{residentToken}}`) (Lưu ý: Phải dùng user đã link với cư dân)
*   **Body (JSON):**
    ```json
    {
      "tieu_de": "Hỏng đèn hành lang",
      "noi_dung": "Đèn hành lang tầng 1 bị nhấp nháy."
    }
    ```

---

## 6. App: Dashboard

### 6.1. Manager Dashboard
*   **Tên Request:** `Manager Dashboard`
*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/v1/dashboard/manager`
*   **Auth:** Bearer Token (`{{adminToken}}`)

### 6.2. Resident Dashboard
*   **Tên Request:** `Resident Dashboard`
*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/v1/dashboard/resident`
*   **Auth:** Bearer Token (`{{residentToken}}`)
