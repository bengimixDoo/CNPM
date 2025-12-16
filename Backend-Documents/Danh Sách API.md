## APP `users` (identity & access)

1. `POST /api/v1/auth/login`
    
    - body: `{ username, password }`
        
    - trả về: token/session. (Auth via JWT/djangorestframework-simplejwt)
        
2. `POST /api/v1/auth/logout`
    
    - invalidate token.
        
3. `POST /api/v1/auth/register`
    
    - Tạo user (Admin only or open with email verification).
        
4. `GET /api/v1/users/me`
    
    - Lấy profile (kèm Resident và Apartment nếu liên kết).
        
5. `GET /api/v1/users/` (ADMIN)
    
    - Danh sách user, filter theo role, active.
        
6. `POST /api/v1/users/` (ADMIN)
    
    - Tạo user (liên kết resident optional).
        
7. `PATCH /api/v1/users/{id}/` (ADMIN)
    
    - Update role/status.
        
8. `POST /api/v1/users/{id}/link-resident`
    
    - Gắn user ↔ resident.
        
9. `POST /api/v1/users/{id}/change-password`
    
    - Đổi mật khẩu.
        

**Giải thích**: quản lý authentication, profile, mapping user → resident.

---

## APP `residents` (apartment & people)

1. `GET /api/v1/apartments/`
    
    - Danh sách căn hộ (filter by toa/ tang/ trangthai).
        
2. `GET /api/v1/apartments/{id}/`
    
    - Chi tiết căn hộ (kèm chủ sở hữu, phương tiện, current resident(s)).
        
3. `POST /api/v1/apartments/` (MANAGER/ADMIN)
    
    - Tạo căn hộ.
        
4. `PATCH /api/v1/apartments/{id}/` (MANAGER/ADMIN)
    
    - Cập nhật thông tin / trạng thái.
        
5. `GET /api/v1/residents/`
    
    - Danh sách cư dân (search by name/CCCD).
        
6. `GET /api/v1/residents/{id}/`
    
    - Chi tiết cư dân (kèm lịch sử `BienDongDanCu`, current apartment).
        
7. `POST /api/v1/residents/` (MANAGER/ADMIN)
    
    - Tạo cư dân.
        
8. `POST /api/v1/residents/{id}/move`
    
    - Move-in / move-out: tạo `BienDongDanCu` và cập nhật `MaCanHoDangO`.
        
9. `GET /api/v1/resident-movements/`
    
    - Lịch sử biến động.
        

**Giải thích**: quản lý tài sản con người và mapping căn hộ ↔ cư dân; endpoint move thực hiện business logic: update resident.apartment + record movement.

---

## APP `finance`

1. `GET /api/v1/fees/`
    
    - Danh mục phí (`DanhMucPhi`) (admin CRUD).
        
2. `POST /api/v1/fees/` (ADMIN)
    
    - Tạo loại phí.
        
3. `GET /api/v1/meters/`
    
    - Lấy `ChiSoDienNuoc` theo căn, tháng,năm.
        
4. `POST /api/v1/meters/` (OPERATOR)
    
    - Tạo / import chỉ số (có thể batch upload csv).
        
5. `POST /api/v1/invoices/generate` (MANAGER)
    
    - **Quan trọng**: endpoint tạo hóa đơn hàng loạt:
        
        - Input: `{ month, year, apartment_ids? }`
            
        - Logic: for each apartment → lấy meter readings, fee category → tạo `HoaDon` + `ChiTietHoaDon`.
            
        - Trả về list hóa đơn được tạo (hoặc báo lỗi).
            
    - Đảm bảo dùng `transaction.atomic` để rollback nếu lỗi.
        
6. `GET /api/v1/invoices/`
    
    - Lọc theo apartment, status, month, year.
        
7. `GET /api/v1/invoices/{id}/`
    
    - Chi tiết hóa đơn kèm `ChiTietHoaDon`.
        
8. `POST /api/v1/invoices/{id}/pay`
    
    - Ghi nhận thanh toán (cập nhật `TrangThai`, tạo record Payment nếu cần).
        
9. `GET /api/v1/invoices/{id}/download`
    
    - Xuất PDF hoá đơn (generate via report lib).
        
10. `GET /api/v1/reports/usage?apartment=&month=&year=`
    
    - Báo cáo tiêu thụ điện/nước.
        
11. `POST /api/v1/invoices/adjust` (MANAGER)
    
    - Điều chỉnh (credit/debit) một hóa đơn (ghi chi tiết điều chỉnh vào `ChiTietHoaDon` hoặc tạo hóa đơn phụ).
        

**Giải thích**: `generate` là core business endpoint. Meter readings, fee catalog → invoice items (snapshot) → invoice.

---

## APP `services`

1. `GET /api/v1/vehicles/?apartment=`
    
    - Danh sách xe theo căn.
        
2. `POST /api/v1/vehicles/`
    
    - Đăng ký xe (cư dân).
        
3. `DELETE /api/v1/vehicles/{id}/`
    
    - Xoá / hủy đăng ký.
        
4. `GET /api/v1/requests/`
    
    - Danh sách yêu cầu (filter by status).
        
5. `POST /api/v1/requests/`
    
    - Tạo yêu cầu (cư dân).
        
6. `PATCH /api/v1/requests/{id}/reply` (MANAGER)
    
    - BQL phản hồi -> cập nhật `PhanHoiBQL` & `TrangThai`.
        
7. `GET /api/v1/announcements/`
    
    - Lấy tin tức (public).
        
8. `POST /api/v1/announcements/` (MANAGER)
    
    - Tạo tin tức.
        
9. `POST /api/v1/uploads/`
    
    - Upload file (CCCD, hợp đồng, ảnh đính kèm cho yêu cầu).
        

**Giải thích**: services xử lý interaction giữa cư dân và BQL.

---

## CROSS-CUTTING APIs (hữu ích)

- `GET /api/v1/dashboard/manager` — Thống kê (số hoá đơn chưa thu, yêu cầu đang xử lý, occupancy rate).
    
- `GET /api/v1/dashboard/resident` — Hoá đơn chưa thanh toán, yêu cầu của tôi.
    
- `POST /api/v1/notifications/send` — Gửi email/push (MANAGER).
    
- `GET /api/v1/audit-logs/` — Lịch sử tác động (ADMIN).