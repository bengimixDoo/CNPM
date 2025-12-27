# Backend - Apartment Management System (CNPM)

Hệ thống Backend (API) cho Ứng dụng Quản lý Chung cư, được xây dựng bằng Django và Django REST Framework.

## 📋 Giới thiệu

Dự án cung cấp các API RESTful để quản lý toàn bộ hoạt động của một chung cư, bao gồm quản lý cư dân, căn hộ, các khoản phí, hóa đơn, dịch vụ tiện ích, và phản ánh của cư dân. Hệ thống hỗ trợ phân quyền chặt chẽ cho các vai trò: **Admin**, **Quản lý (Manager)**, **Kế toán (Accountant)**, và **Cư dân (Resident)**.

## 🛠️ Công nghệ sử dụng

- **Ngôn ngữ**: Python 3.10+
- **Framework**: Django 5.x
- **API Toolkit**: Django REST Framework (DRF)
- **Authentication**: JWT (JSON Web Tokens) via `djangorestframework-simplejwt`
- **Database**: SQLite (Môi trường Dev/Test), PostgreSQL (Khuyến nghị cho Production)
- **API Documentation**: Swagger/Redoc via `drf-spectacular`

## 📂 Cấu trúc dự án

- **`core/`**: Cấu hình chính của dự án (Settings, URLs).
- **`users/`**: Quản lý người dùng, xác thực (Login/Logout), phân quyền.
- **`residents/`**: Quản lý thông tin Căn hộ, Cư dân và Lịch sử biến động dân cư.
- **`finance/`**: Quản lý các khoản Phí, Chỉ số điện nước, Hóa đơn, Thống kê doanh thu, Vận động đóng góp.
- **`services/`**: Quản lý Phương tiện, Tin tức thông báo, Phản ánh (Support Tickets).

## 🚀 Cài đặt và Hướng dẫn chạy

### 1. Yêu cầu tiên quyết
- Python (phiên bản 3.10 trở lên) được cài đặt sẵn.
- `pip` (trình quản lý gói của Python).

### 2. Thiết lập môi trường

1.  **Clone repository** (nếu chưa có):
    ```bash
    git clone <repository_url>
    cd Backend
    ```

2.  **Tạo Virtual Environment (Môi trường ảo)**:
    ```bash
    # Windows
    python -m venv .venv
    .venv\Scripts\activate

    # Linux/Mac
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Cài đặt các thư viện phụ thuộc**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Cấu hình Database**:
    Mặc định dự án sử dụng SQLite. Bạn cần chạy migrations để khởi tạo database:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

5.  **Tạo tài khoản Superuser (Admin)**:
    ```bash
    python manage.py createsuperuser
    ```

### 3. Chạy Server
Khởi động server phát triển tại `http://localhost:8000`:
```bash
python manage.py runserver
```

## 🧪 Kiểm thử (Testing)

Dự án đã bao gồm bộ test API hoàn chỉnh cho các module chính. Để chạy toàn bộ test:

```bash
python manage.py test users.tests_api residents.tests_api finance.tests_api services.tests_api
```

Hoặc chạy test cho từng app riêng lẻ:
```bash
python manage.py test users.tests_api
```

## 📖 Tài liệu API

Dự án hỗ trợ tài liệu API tự động. Sau khi chạy server, bạn có thể truy cập:

- **Swagger UI**: [http://localhost:8000/swagger/](http://localhost:8000/swagger/)
- **API Schema**: [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)

Ngoài ra, tài liệu chi tiết dạng Markdown có sẵn tại file: [API Docs.md](./API%20Docs.md)

## 🔑 Tài khoản Test mặc định (Nếu có Seed Data)

Nếu bạn đã chạy script tạo dữ liệu mẫu, các tài khoản thường dùng:
- **Admin**: `admin` / `password123`
- **Quản lý**: `manager` / `password123`
- **Kế toán**: `accountant` / `password123`
- **Cư dân**: `resident` / `password123`

*(Lưu ý: Mật khẩu có thể khác tùy thuộc vào dữ liệu bạn khởi tạo)*