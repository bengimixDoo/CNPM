### 1. 🛡️ ADMIN (Quản trị viên hệ thống)
- **Là ai?** Là người cài đặt hệ thống, IT, hoặc Trưởng ban quản lý cấp cao nhất.
- **Quyền hạn:** "Quyền sinh sát". Có quyền truy cập vào mọi ngóc ngách của dữ liệu.
- **Nhiệm vụ trong API:**
    - **Cấu hình hệ thống:** Tạo các loại phí (`POST /fee-categories/`), thiết lập giá điện nước.
        
    - **Quản lý nhân sự:** Tạo tài khoản cho nhân viên BQL (`POST /users/`), khóa tài khoản vi phạm.
        
    - **Audit:** Xem nhật ký hoạt động của hệ thống để kiểm tra xem nhân viên có gian lận không.

- **Tại sao cần Role này?** Để đảm bảo các thiết lập cốt lõi (như giá tiền) không bị nhân viên vận hành sửa đổi tùy tiện.

### 2. 💼 MANAGER (Ban Quản Lý - BQL)
- **Là ai?** Là nhân viên vận hành hàng ngày: Kế toán, Lễ tân, Bảo vệ, Nhân viên kỹ thuật.
- **Quyền hạn:** Quyền "Tác nghiệp". Được phép Xem/Thêm/Sửa dữ liệu vận hành, nhưng **không** được sửa cấu hình hệ thống.
- **Nhiệm vụ trong API:**
    - **Quản lý cư dân:** Nhập hồ sơ người mới (`POST /residents/`), làm thủ tục chuyển đến/đi (`move-in`, `move-out`).
        
    - **Tài chính:** Nhập chỉ số điện nước (`POST /utility-readings/`), bấm nút tạo hóa đơn hàng tháng (`POST /invoices/batch-generate/`), xác nhận đã thu tiền (`confirm-payment`).
        
    - **Dịch vụ:** Phản hồi các yêu cầu báo hỏng của dân, đăng thông báo mới.

- **Giới hạn:** Manager không thể thay đổi giá điện (phải nhờ Admin), không thể xóa user Admin.

### 3. 🏠 RESIDENT (Cư Dân)
- **Là ai?** Người đang sinh sống trong căn hộ (Chủ hộ hoặc Khách thuê có tài khoản).
- **Quyền hạn:** Rất hạn chế. Chủ yếu là **Read-only** (Chỉ xem) và chỉ được xem **dữ liệu của chính mình** (Data Owner).
- **Nhiệm vụ trong API:**
    - **Xem thông tin:** Xem hóa đơn _của nhà mình_, xem lịch sử dùng điện nước _của nhà mình_.
        
    - **Gửi yêu cầu:** Gửi ticket báo hỏng (`POST /support-tickets/`), đăng ký xe (`POST /vehicles/`).

- **Giới hạn (Privacy):** Tuyệt đối **không** gọi được API danh sách cư dân (`GET /residents/`) để tránh lộ thông tin hàng xóm. Không xem được hóa đơn nhà khác.

### 4. 🌐 PUBLIC / AUTH (Công khai / Đã đăng nhập)
- **Public:** Bất kỳ ai cũng gọi được.
    
    - Ví dụ: API Đăng nhập (`/auth/token/`), Đăng ký (nếu cho phép).

- **Auth (Authenticated):** Bất kỳ ai **đã đăng nhập** (có Token hợp lệ) đều gọi được, không phân biệt là Admin hay Cư dân.
    - Ví dụ: API Đổi mật khẩu (`/change-password/`), API Xem tin tức (`/news/`), API Xem danh sách các loại phí (`/fee-categories/` - vì ai cũng cần biết giá điện bao nhiêu).

### Bảng so sánh nhanh quyền hạn

|**Hành động (Action)**|**🛡️ ADMIN**|**💼 MANAGER**|**🏠 RESIDENT**|
|---|---|---|---|
|**Sửa giá điện/nước**|✅|❌|❌|
|**Tạo tài khoản User**|✅|❌|❌|
|**Nhập chỉ số điện nước**|❌|✅|❌|
|**Tạo hóa đơn tháng**|❌|✅|❌|
|**Xác nhận thu tiền**|❌|✅|❌|
|**Xem danh sách tất cả cư dân**|✅|✅|❌ (Bảo mật)|
|**Xem hóa đơn nhà mình**|✅|✅|✅|
|**Gửi báo hỏng**|❌|❌|✅|
|**Trả lời báo hỏng**|✅|✅|❌|

### Ví Dụ
Giả sử có API: `GET /invoices/{id}/` (Xem chi tiết hóa đơn số `{id}`).

1. **Nếu ADMIN gọi `GET /invoices/500/`**: Hệ thống cho phép xem ngay.
    
2. **Nếu MANAGER gọi `GET /invoices/500/`**: Hệ thống cho phép xem (để còn thu tiền).
    
3. **Nếu RESIDENT (ở phòng 101) gọi `GET /invoices/500/`**:
    
    - Backend kiểm tra: "Hóa đơn 500 này là của phòng nào?" -> Kết quả: Phòng 202.
        
    - Backend so sánh: "User này ở phòng 101, mà hóa đơn của phòng 202".
        
    - Kết quả: Trả về lỗi `403 Forbidden` (Bạn không có quyền xem tài nguyên này).