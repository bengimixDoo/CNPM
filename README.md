# 🏢 Apartment Management System (AMS)

Hệ thống quản lý chung cư toàn diện, hiện đại, tối ưu hóa quy trình vận hành và nâng cao trải nghiệm cư dân.

## 🚀 Giới thiệu

Dự án được xây dựng theo kiến trúc **Monorepo**, tách biệt rõ ràng giữa Backend (API) và Frontend (User Interface), đảm bảo khả năng mở rộng và bảo trì dễ dàng.

## 🛠️ Công nghệ sử dụng

### Backend
- **Framework**: Django 5.x, Django REST Framework (DRF)
- **Database**: PostgreSQL (Production), SQLite (Dev)
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger UI, Redoc via `drf-spectacular`

### Frontend
- **Framework**: ReactJS
- **Build Tool**: Vite
- **HTTP Client**: Axios/Fetch

## 📂 Cấu trúc dự án

```text
CNPM/
├── Backend/               # Django Backend Source Code
├── Backend Docs/          # Tài liệu đặc tả API chi tiết
├── Frontend/              # React Frontend Source Code
├── .gitignore             # Git configuration
├── LICENSE                # MIT License
└── README.md              # Project Overview (File này)
```

## ⚡ Hướng dẫn cài đặt (Getting Started)

### 1. Backend Setup

Di chuyển vào thư mục Backend và thiết lập môi trường:

```bash
cd Backend

# 1. Tạo môi trường ảo (Virtual Environment)
# Windows
python -m venv .venv
.venv\Scripts\activate
# Mac/Linux
# python3 -m venv .venv
# source .venv/bin/activate

# 2. Cài đặt thư viện
pip install -r requirements.txt

# 3. Khởi tạo Database & Migrations
python manage.py makemigrations
python manage.py migrate

# 4. Tạo tài khoản Admin
python manage.py createsuperuser

# 5. Chạy Server
python manage.py runserver
```

- **API Root**: `http://localhost:8000`
- **Swagger UI**: `http://localhost:8000/swagger/`

### 2. Frontend Setup

Di chuyển vào thư mục Frontend và khởi chạy:

```bash
cd Frontend

# 1. Cài đặt dependencies
npm install

# 2. Chạy Dev Server
npm run dev
```

- **Web App**: `http://localhost:5173` (Mặc định của Vite)

## 🧩 Các tính năng chính (Key Modules)

1.  **Users (Người dùng)**:
    - Quản lý xác thực, đăng nhập/đăng xuất (JWT).
    - Phân quyền người dùng: Admin, Manager, Accountant, Resident.
2.  **Residents (Cư dân)**:
    - Quản lý danh sách chung cư, căn hộ.
    - Quản lý thông tin cư dân và lịch sử biến động (tạm trú, tạm vắng).
3.  **Finance (Tài chính)**:
    - Quản lý các khoản phí (phí dịch vụ, gửi xe, đóng góp).
    - Ghi nhận chỉ số điện nước, tính toán hóa đơn tự động.
    - Thanh toán và thống kê doanh thu.
4.  **Services (Dịch vụ)**:
    - Đăng ký và quản lý phương tiện.
    - Gửi và xử lý phản ánh (Support Tickets) từ cư dân.
    - Tin tức, thông báo từ Ban quản lý.

## 📚 Tài liệu tham khảo

- [Backend Documentation](./Backend/README.md) - Hướng dẫn chi tiết dành cho Backend Developer.
- [API Documentation](./Backend%20Docs/API%20Docs.md) - Đặc tả chi tiết Request/Response của các API.

---
**Developed by [Your Team Name]**