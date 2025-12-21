# 🏢 Apartment Management System (AMS)

Hệ thống quản lý chung cư toàn diện, bao gồm quản lý cư dân, tính toán hóa đơn điện nước tự động và cổng thông tin dịch vụ tiện ích.

## 🚀 Giới thiệu
Dự án được xây dựng theo kiến trúc Monorepo, tách biệt rõ ràng giữa Backend (API) và Frontend (User Interface).

- **Backend:** Django REST Framework, PostgreSQL.
- **Frontend:** ReactJS.
- **Database:** Neon Tech (PostgreSQL).

## 📂 Cấu trúc dự án
Dưới đây là sơ đồ cây thư mục tổ chức mã nguồn:


CNPM/
├── .gitignore             # Cấu hình file ẩn của Git
├── LICENSE                # Giấy phép mã nguồn (MIT)
├── README.md              # Tài liệu tổng quan (Bạn đang đọc file này)
│
├── Backend/               # SOURCE CODE BACKEND
│   ├── core/              # Config gốc của Django (settings, urls tổng)
│   ├── users/             # App: Quản lý Auth & Phân quyền
│   ├── residents/         # App: Quản lý Căn hộ & Cư dân
│   ├── finance/           # App: Quản lý Tài chính & Hóa đơn
│   ├── services/          # App: Tiện ích & Tin tức
│   ├── requirements.txt   # Danh sách thư viện Python
│   ├── manage.py          # Trình quản lý Django
│   └── README.md          # Hướng dẫn chi tiết chạy Backend
│
└── Frontend/              # SOURCE CODE FRONTEND
    ├── public/
    ├── src/
    ├── package.json       # Danh sách thư viện JS
    └── README.md          # Hướng dẫn chi tiết chạy Frontend
