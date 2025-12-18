### 1. Nhánh Khởi tạo (Dành cho Tech Lead)

Đây là nhánh đầu tiên bạn làm để tạo bộ khung xương sống (Skeleton) như tôi đã hướng dẫn ở các bước trước.

- **Tên nhánh:** `chore/be/project-skeleton`
    
- **Người làm:** Tech Lead.
    
- **Nhiệm vụ:**
    
    - Cài Django, DRF, Database lib.
        
    - Tạo 4 apps (`users`, `residents`, `finance`, `services`).
        
    - Viết code `models.py` (khung sương) cho cả 4 app.
        
    - Config `settings.py` (Auth user, Database, Timezone).
        
    - Tạo file `core/permissions.py`.
        
- **Sau khi xong:** Merge vào `main` ngay lập tức để team clone về.
    

---

### 2. Các nhánh Chức năng (Feature Branches)

Sau khi có `main` chứa khung sương, các thành viên sẽ checkout ra các nhánh sau để làm việc song song:

#### A. Team Identity (App `users`)

- **Tên nhánh:** `feat/be/users/auth-api`
    
- **Nhiệm vụ:**
    
    - Viết `UserSerializer` (xử lý password, role).
        
    - API Login (`TokenObtainPairView`), Refresh Token.
        
    - API `GET /users/me/` (Xem profile bản thân).
        
    - API `POST /users/change-password/`.
        
    - API CRUD User (Dành cho Admin tạo tài khoản Manager).
        

#### B. Team Resident Manager (App `residents`)

- **Tên nhánh:** `feat/be/residents/master-data`
    
- **Nhiệm vụ:**
    
    - Hoàn thiện Model `CanHo`, `CuDan` (thêm các trường chi tiết).
        
    - Viết `CanHoViewSet`, `CuDanViewSet`.
        
    - API `POST /move-in` (Nhập khẩu) và `POST /move-out` (Chuyển đi) -> Logic ghi vào bảng `BienDongDanCu`.
        

#### C. Team Finance (App `finance`) - _Nhánh quan trọng nhất_

- **Tên nhánh:** `feat/be/finance/billing-engine`
    
- **Nhiệm vụ:**
    
    - CRUD `DanhMucPhi` (Chỉ Admin sửa).
        
    - API nhập chỉ số điện nước (`ChiSoDienNuocViewSet`).
        
    - **Core Logic:** Viết hàm `batch_generate` (Tạo hóa đơn hàng loạt, snapshot giá).
        
    - API xác nhận thanh toán (`confirm-payment`).
        
    - API xem danh sách/chi tiết hóa đơn.
        

#### D. Team Services (App `services`)

- **Tên nhánh:** `feat/be/services/interactions`
    
- **Nhiệm vụ:**
    
    - API Đăng ký/Quản lý Phương tiện (`PhuongTienViewSet`).
        
    - API Gửi yêu cầu/Báo hỏng (`YeuCauViewSet`): Cư dân gửi, BQL cập nhật trạng thái.
        
    - API Tin tức/Thông báo (`TinTucViewSet`).
        

---

### 3. Quy trình Merge (Thứ tự ưu tiên)

Vì các App có liên quan đến nhau, bạn nên Merge code vào `main` theo thứ tự này để hạn chế lỗi khi chạy thử:

1. **Ưu tiên 1:** `chore/be/project-skeleton` (Bắt buộc có trước).
    
2. **Ưu tiên 2:** `feat/be/users/auth-api` (Để có User/Login thì mới test được các cái khác).
    
3. **Ưu tiên 3:** `feat/be/residents/master-data` (Phải có Căn hộ/Cư dân thì mới tính tiền hay gửi xe được).
    
4. **Ưu tiên 4:** `feat/be/finance/billing-engine` và `feat/be/services/interactions` (Có thể merge song song sau cùng).

**📢 DANH SÁCH NHÁNH BACKEND** Mọi người checkout từ nhánh `main` (sau khi Tech Lead đã push khung project) và tạo nhánh theo nhiệm vụ:

1. **@Member_A (Làm User/Auth):** `feat/be/users/auth-api`
    
2. **@Member_B (Làm Cư dân/Căn hộ):** `feat/be/residents/master-data`
    
3. **@Member_C (Làm Tài chính/Hóa đơn):** `feat/be/finance/billing-engine`
    
4. **@Member_D (Làm Tiện ích/Xe/Vé):** `feat/be/services/interactions`