### 1. Luồng Authentication & Authorization (Đăng nhập)

1. Người dùng gửi `username`, `password` lên API.
    
2. Hệ thống kiểm tra trong bảng `Users`.
    
3. Nếu đúng: Trả về Token (JWT hoặc Session ID) kèm theo thông tin `role` và `cu_dan_id`.
    
4. Frontend dựa vào `role` để điều hướng:
    
    - `ADMIN/QUAN_LY`: Vào trang Dashboard quản trị.
        
    - `CU_DAN`: Vào trang Cư dân cá nhân.

### 2. Luồng Tính toán & Phát hành Hóa đơn (Billing Cycle)

Đây là chức năng quan trọng nhất.

1. **Thu thập dữ liệu:** Ban quản lý nhập chỉ số điện nước vào bảng `ChiSoDienNuoc` (API `POST`).
    
2. **Kích hoạt tính toán:** Ban quản lý bấm "Tạo hóa đơn tháng X".
    
3. **Backend xử lý (Logic):**
    
    - Tạo 1 record `HoaDon` (Tổng tiền = 0).
        
    - Tìm `ChiSoDienNuoc` của tháng đó -> Tính tiền -> Tạo `ChiTietHoaDon` (Lưu snapshot giá Điện/Nước).
        
    - Quét bảng `CanHo` lấy diện tích -> Tính phí quản lý -> Tạo `ChiTietHoaDon` (Lưu snapshot giá Quản lý).
        
    - Quét bảng `PhuongTien` -> Tính phí gửi xe -> Tạo `ChiTietHoaDon` (Lưu snapshot giá Gửi xe).
        
    - `SUM` toàn bộ `ThanhTien` trong `ChiTietHoaDon` -> Update ngược lại cột `TongTien` của `HoaDon`.
        
4. **Kết quả:** Cư dân mở app thấy hóa đơn mới.

### 3. Luồng Xử lý Yêu cầu (Support Ticket)

1. Cư dân gửi yêu cầu (POST `YeuCau`) -> Trạng thái `Moi`.
    
2. Ban quản lý nhận notify, xem danh sách.
    
3. Ban quản lý cập nhật trạng thái `DangXuLy` (PUT `YeuCau`).
    
4. Sau khi sửa xong, cập nhật `HoanThanh` + Ghi chú `PhanHoiBQL`.

## PHẦN 3: DATA FLOW & TƯƠNG TÁC API

**Nguyên lý chung:** Client (Web/App) <-> Django API <-> ORM (Models) <-> PostgreSQL (Neon).

### Tổng quan luồng dữ liệu của một API (Ví dụ: Xem hóa đơn)

1. **Request:** Cư dân (User ID: 5) gửi `GET /api/finance/bills/`.
    
2. **Middleware:** Django kiểm tra Token. Xác định User ID = 5.
    
3. **View (Controller):**
    
    - Từ User ID 5 -> Query bảng `Users` -> Lấy `cu_dan_id` (Ví dụ: 10).
        
    - Từ `cu_dan_id` = 10 -> Query bảng `CuDan` -> Lấy `MaCanHoDangO` (Ví dụ: ID 101).
        
    - Query bảng `HoaDon` với điều kiện `MaCanHo = 101`.
        
4. **Database:** Trả về danh sách các row thỏa mãn.
    
5. **Serializer:** Chuyển dữ liệu từ Python Object sang JSON.
    
6. **Response:** Trả về JSON cho Client hiển thị.