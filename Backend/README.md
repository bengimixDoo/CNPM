# Hệ Thống Quản Lý Chung Cư - Backend

Backend API cho hệ thống Quản Lý Chung Cư (CNPM), được xây dựng bằng Django và Django REST Framework.

## Công Nghệ Sử Dụng
- **Framework**: Django 5.2, Django REST Framework
- **Database**: PostgreSQL (Neon Tech)
- **Xác thực**: JWT (Simple JWT)

## Yêu Cầu Tiên Quyết
- Python 3.10 trở lên
- PostgreSQL (hoặc chuỗi kết nối Neon)

## Hướng Dẫn Cài Đặt

1. **Clone repository**
   ```bash
   git clone <repository_url>
   cd Backend
   ```

2. **Tạo và kích hoạt môi trường ảo (Virtual Environment)**
   ```bash
   python -m venv .venv
   # Windows
   .\.venv\Scripts\activate
   # Linux/Mac
   source .venv/bin/activate
   ```

3. **Cài đặt các thư viện phụ thuộc**
   ```bash
   pip install -r requirements.txt
   ```

4. **Cấu hình Môi trường**
   Tạo file `.env` trong thư mục `Backend` với nội dung sau:
   ```env
   DATABASE_URL=postgres://user:password@ep-xyz.aws.neon.tech/dbname?sslmode=require
   ```

5. **Chạy Migrations (Khởi tạo Database)**
   ```bash
   python manage.py migrate
   ```

6. **Tạo tài khoản Admin (Superuser)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Chạy Server**
   ```bash
   python manage.py runserver
   ```

## Danh Sách API (Endpoints)

### Xác thực (Authentication)
- **Đăng nhập**: `POST /api/users/login/`
- **Lấy Token mới (Refresh)**: `POST /api/users/token/refresh/`

### Trang Quản Trị (Admin Interface)
- Truy cập tại: `http://127.0.0.1:8000/admin/`

## Cấu Trúc Ứng Dụng (Apps)
- **users**: Quản lý người dùng và xác thực.
- **residents**: Quản lý Cư dân (`CuDan`), Căn hộ (`CanHo`), Biến động dân cư (`BienDongDanCu`).
- **finance**: Quản lý Các loại phí (`DanhMucPhi`), Hóa đơn (`HoaDon`).
- **services**: Quản lý Điện nước (`ChiSoDienNuoc`), Tin tức (`TinTuc`), Yêu cầu (`YeuCau`), Phương tiện (`PhuongTien`).