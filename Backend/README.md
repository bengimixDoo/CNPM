Quy ước đặt tên nhánh (Git Branching Strategy)
Để đảm bảo code không bị xung đột, toàn bộ team tuân thủ quy tắc đặt tên nhánh sau:

Công thức: loại-task/phạm-vi/tên-chức-năng

Loại task: feat (tính năng mới), fix (sửa lỗi), chore (cấu hình).

Phạm vi: be (Backend), fe (Frontend - nếu có).

### 📋 Danh sách các nhánh phát triển chính
Các thành viên vui lòng checkout từ nhánh `main` và tạo nhánh mới theo bảng dưới đây:

| App (Module) | Tên nhánh (Branch Name) | Nhiệm vụ chính | Người phụ trách |
| :--- | :--- | :--- | :--- |
| **Users** (Auth) | `feat/be/users/auth-api` | Login, Register, Profile, Change Password | @Member_A |
| **Residents** | `feat/be/residents/master-data` | CRUD Căn hộ, Cư dân, Nhập khẩu/Chuyển đi | @Member_B |
| **Finance** | `feat/be/finance/billing-engine` | Nhập chỉ số điện nước, **Tính toán hóa đơn**, Thanh toán | @Member_C |
| **Services** | `feat/be/services/interactions` | Đăng ký xe, Gửi yêu cầu (Ticket), Tin tức | @Member_D |