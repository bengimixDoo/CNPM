## A. Đăng ký & quản lý user

1. **Signup / tạo user**: Admin hoặc self-register → `Users` (liên kết `CuDan` nếu là cư dân).
    
2. **Login** → token/session.
    
3. **Profile** → lấy thông tin user + resident + apartment.

---
## B. Quản lý căn hộ & cư dân

- **Thêm/sửa căn hộ** (Admin/Manager) → `CanHo` CRUD.
    
- **Thêm/sửa cư dân** → `CuDan` CRUD; thay đổi chỗ ở => tạo `BienDongDanCu` ghi lại biến động, cập nhật `MaCanHoDangO`.
    
- **Chuyển cư cư dân**:
    
    - Khi cư dân chuyển đi: set `MaCanHoDangO` null, tạo `BienDongDanCu` (LoaiBienDong=ChuyenDi).
        
    - Khi về ở mới: cập nhật `MaCanHoDangO` và nếu là chủ hộ, `LaChuHo=True`.

---
## C. Ghi chỉ số điện/nước

- Operator (hoặc tự động từ meter IoT) tạo `ChiSoDienNuoc` cho mỗi căn vào kỳ.
    
- Hệ thống có thể tự fill `ChiSoCu` lấy từ bản ghi `ChiSoDienNuoc` kỳ trước.
    
- Sau khi chốt (`NgayChot`) → mark read-only / generate invoices.

---
## D. Sinh & quản lý hoá đơn (Generate Invoice)

1. **Trigger** (manual or scheduled cron): Tại cuối kỳ, cho mỗi căn hộ:
    
    - Lấy `ChiSoDienNuoc` (kỳ) → tính lượng tiêu thụ.
        
    - Lấy `DanhMucPhi` liên quan → tính tiền từng loại (với công thức: `so_unit * don_gia` hoặc `don_gia*dien_tich` cho phí quản lý).
        
    - Tạo `HoaDon` (kỳ) và tạo các `ChiTietHoaDon` chứa `TenPhiSnapshot` & `DonGiaSnapshot`.
        
2. **Invoice total** = sum(`ChiTietHoaDon.ThanhTien`). Lưu `TongTien`.
    
3. **Notify** cư dân (email/push).

---
## E. Thanh toán hoá đơn

- Cư dân xem `HoaDon` → chọn `pay` (cổng thanh toán hoặc nộp tại quầy).
    
- Sau khi confirmed payment → cập nhật `HoaDon.TrangThai=1` (DaThu), ghi audit, tạo record `Payment` (nếu có model Payment).
    
- Có thể hỗ trợ partial payment → track `so_tien_da_thu`.

---
## F. Yêu cầu & dịch vụ

- Cư dân gửi `YeuCau` (maintenance, complaint).
    
- BQL xem, cập nhật `TrangThai`, thêm `PhanHoiBQL`.
    
- Gửi notification when status changes.

---
## G. Quản lý phương tiện

- Cư dân đăng ký `PhuongTien` (biển số).
    
- BQL duyệt/ghi chú (gắn vé gửi xe, tính phí nếu có trong `DanhMucPhi`).

---
## H. Tin tức / thông báo

- BQL tạo `TinTuc`, nội dung gửi tới cư dân hoặc public.