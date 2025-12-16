## 1. APP: USERS (Identity & Access)

_Quản lý danh tính, xác thực và liên kết hồ sơ._

| **Method** | **Endpoint**                 | **Quyền (Role)** | **Mô tả & Logic xử lý**                                                      |
| ---------- | ---------------------------- | ---------------- | ---------------------------------------------------------------------------- |
| `POST`     | `/auth/token/`               | Public           | **Login.** Gửi `{username, password}` -> Trả về Access/Refresh Token (JWT).  |
| `POST`     | `/auth/token/refresh/`       | Public           | Lấy Access Token mới từ Refresh Token.                                       |
| `POST`     | `/auth/logout/`              | Authenticated    | Blacklist refresh token hiện tại.                                            |
| `GET`      | `/users/me/`                 | Owner            | Lấy thông tin bản thân (kèm `cu_dan_id`, `role`, thông tin căn hộ đang ở).   |
| `POST`     | `/users/change-password/`    | Owner            | Đổi mật khẩu. Input: `{old_pass, new_pass}`.                                 |
| `GET`      | `/users/`                    | Admin            | List user hệ thống. Filter: `?role=QUAN_LY`.                                 |
| `POST`     | `/users/`                    | Admin            | Tạo user mới (cho nhân viên BQL hoặc Admin khác).                            |
| `PATCH`    | `/users/{id}/`               | Admin            | Khóa tài khoản (`is_active=False`), đổi Role.                                |
| `POST`     | `/users/{id}/link-resident/` | Admin/Manager    | **Mapping.** Input: `{cu_dan_id}`. Liên kết tài khoản User với hồ sơ Cư dân. |

## 2. APP: RESIDENTS (Tòa nhà & Con người)

_Quản lý Master Data về Bất động sản và Nhân khẩu._

|**Method**|**Endpoint**|**Quyền (Role)**|**Mô tả & Logic xử lý**|
|---|---|---|---|
|`GET`|`/apartments/`|Auth (All)|List căn hộ. Cư dân chỉ thấy căn của mình (hoặc list public dạng rút gọn). Manager thấy hết.|
|`POST`|`/apartments/`|Manager/Admin|Thêm căn hộ mới vào hệ thống.|
|`GET`|`/apartments/{id}/`|Manager/Owner|Chi tiết căn hộ: Diện tích, Chủ sở hữu, **Danh sách người đang ở (List Cư dân)**.|
|`GET`|`/apartments/{id}/history/`|Manager|Lịch sử sở hữu hoặc lịch sử người thuê (Query bảng `BienDongDanCu` join `CuDan`).|
|`GET`|`/residents/`|Manager|List toàn bộ cư dân. Search: `?name=...&cccd=...`.|
|`POST`|`/residents/`|Manager|Tạo hồ sơ cư dân mới (chưa có tài khoản User).|
|`GET`|`/residents/{id}/`|Manager/Owner|Xem hồ sơ chi tiết. Cư dân chỉ xem được hồ sơ chính mình.|
|`PATCH`|`/residents/{id}/`|Manager/Owner|Sửa SDT, Email. Manager được sửa hết. Owner chỉ sửa thông tin liên lạc.|
|`POST`|`/residents/{id}/move-in/`|Manager|**Nghiệp vụ Chuyển đến.** Input: `{apartment_id, role_in_house}`.<br><br>  <br><br>1. Update `CuDan.MaCanHoDangO`.<br><br>  <br><br>2. Tạo `BienDongDanCu` (Loại: Nhập khẩu/Đến ở).|
|`POST`|`/residents/{id}/move-out/`|Manager|**Nghiệp vụ Chuyển đi.**<br><br>  <br><br>1. Set `CuDan.MaCanHoDangO = Null`.<br><br>  <br><br>2. Tạo `BienDongDanCu` (Loại: Chuyển đi).|

## 3. APP: FINANCE (Tài chính - Core Logic)

_Xử lý tính toán, hóa đơn và thanh toán._

|**Method**|**Endpoint**|**Quyền (Role)**|**Mô tả & Logic xử lý**|
|---|---|---|---|
|`GET`|`/fee-categories/`|Auth (All)|Xem bảng giá phí dịch vụ hiện hành.|
|`POST`|`/fee-categories/`|Admin|Tạo loại phí mới.|
|`GET`|`/utility-readings/`|Manager/Owner|Xem chỉ số điện nước. Owner chỉ xem của phòng mình.|
|`POST`|`/utility-readings/batch/`|Manager|**Nhập liệu.** Upload CSV hoặc JSON Array chỉ số điện nước nhiều phòng cùng lúc.|
|`POST`|`/invoices/batch-generate/`|Manager|**Core Logic (Transaction Atomic):**<br><br>  <br><br>Input: `{month, year}`.<br><br>  <br><br>1. Loop tất cả căn hộ.<br><br>  <br><br>2. Lấy chỉ số điện/nước -> Tính tiền.<br><br>  <br><br>3. Lấy phí cố định (QL, Gửi xe).<br><br>  <br><br>4. Snapshot giá -> Lưu `ChiTietHoaDon`.<br><br>  <br><br>5. Sum tiền -> Lưu `HoaDon`.|
|`GET`|`/invoices/`|Manager/Owner|List hóa đơn. Filter: `?month=12&status=0` (Chưa trả).|
|`GET`|`/invoices/{id}/`|Manager/Owner|Xem chi tiết hóa đơn (kèm các dòng chi tiết).|
|`POST`|`/invoices/{id}/confirm-payment/`|Manager|**Xác nhận thanh toán.**<br><br>  <br><br>Update `TrangThai=1`, `NgayThanhToan=Now`. (Có thể mở rộng tạo bảng `PaymentHistory` ở đây).|
|`GET`|`/analytics/monthly-revenue/`|Manager/Admin|Báo cáo doanh thu theo tháng/năm.|

## 4. APP: SERVICES (Tiện ích & Tương tác)

_Cầu nối giữa BQL và Cư dân._

| **Method** | **Endpoint**             | **Quyền (Role)** | **Mô tả & Logic xử lý**                                                                         |
| ---------- | ------------------------ | ---------------- | ----------------------------------------------------------------------------------------------- |
| `GET`      | `/vehicles/`             | Manager/Owner    | List xe.                                                                                        |
| `POST`     | `/vehicles/`             | Manager          | Đăng ký xe mới cho cư dân (Cư dân có thể request, Manager duyệt - hoặc Manager nhập trực tiếp). |
| `GET`      | `/support-tickets/`      | Manager/Owner    | List yêu cầu. Owner chỉ thấy của mình.                                                          |
| `POST`     | `/support-tickets/`      | Owner            | Gửi yêu cầu mới (Báo hỏng, khiếu nại).                                                          |
| `PATCH`    | `/support-tickets/{id}/` | Manager          | BQL xử lý: Update `TrangThai` (DangXuLy/Xong) và `PhanHoiBQL`.                                  |
| `GET`      | `/news/`                 | Public/Auth      | Xem bảng tin.                                                                                   |
| `POST`     | `/news/`                 | Manager          | Đăng thông báo mới.                                                                             |

## CROSS-CUTTING APIs (hữu ích)

- `GET /api/v1/dashboard/manager` — Thống kê (số hoá đơn chưa thu, yêu cầu đang xử lý, occupancy rate).
    
- `GET /api/v1/dashboard/resident` — Hoá đơn chưa thanh toán, yêu cầu của tôi.
    
- `POST /api/v1/notifications/send` — Gửi email/push (MANAGER).
    
- `GET /api/v1/audit-logs/` — Lịch sử tác động (ADMIN).
