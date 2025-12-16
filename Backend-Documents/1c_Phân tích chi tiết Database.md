Hệ thống được chia thành 4 Django Apps riêng biệt để đảm bảo tính module hóa.
### 1. App: `users` (Quản trị người dùng & Phân quyền)

Chịu trách nhiệm xác thực và định danh người dùng trong hệ thống.

- **Table `Users`**
    
    - **Mô tả:** Bảng tài khoản đăng nhập trung tâm.
        
    - `id`: Khóa chính tự tăng.
        
    - `username`, `password`: Tên đăng nhập và mật khẩu (Django hash password).
        
    - `email`: Email dùng để khôi phục mật khẩu hoặc nhận thông báo.
        
    - `role`: **[Quan trọng]** Phân quyền.
        
        - `ADMIN`: Quản trị viên hệ thống (full quyền).
            
        - `QUAN_LY`: Ban quản lý (tạo hóa đơn, nhập liệu, duyệt yêu cầu).
            
        - `CU_DAN`: Người dùng cuối (chỉ xem hóa đơn, gửi yêu cầu).
            
    - `cu_dan_id`: **[Liên kết logic]** Khóa ngoại trỏ đến bảng `CuDan`.
        
        - Nếu `role` là `CU_DAN`, trường này bắt buộc phải có giá trị để hệ thống biết tài khoản này thuộc về hồ sơ công dân nào.
            
        - Nếu là `ADMIN` hoặc `QUAN_LY`, trường này có thể NULL.
            
    - `is_active`: Cờ kiểm soát (True/False). Dùng để khóa tài khoản mà không cần xóa dữ liệu.


### 2. App: `residents` (Quản lý Cư dân & Tòa nhà)

Chịu trách nhiệm quản lý dữ liệu gốc (Master Data) về bất động sản và nhân khẩu.

- **Table `CanHo` (Căn Hộ)**
    
    - `MaCanHo`: ID nội bộ (Primary Key) dùng để liên kết các bảng khác.
        
    - `MaHienThi`: Mã phòng thực tế (VD: A-101). Tách riêng để dễ dàng đổi tên phòng mà không ảnh hưởng ID hệ thống.
        
    - `MaChuSoHuu`: Link tới `CuDan`. Xác định ai là chủ sở hữu pháp lý (Sổ đỏ).
        
    - `TrangThai`: (Trống, Đã Bán, Đang Cho Thuê). Giúp lọc nhanh các căn hộ chưa có người.

- **Table `CuDan` (Cư Dân)**
    
    - `MaCanHoDangO`: **[Quan trọng]** Xác định nơi ở thực tế. Lưu ý: Một người có thể là chủ sở hữu phòng A (trong trường `MaChuSoHuu` bảng `CanHo`) nhưng đang thuê trọ ở phòng B (trường này).
        
    - `LaChuHo`: Đánh dấu người đại diện chính của căn hộ đó (để gửi thông báo họp, đóng tiền).
        
    - `TrangThaiCuTru`: (Thường trú/Tạm trú) - Phục vụ báo cáo công an.

- **Table `BienDongDanCu`**
    
    - **Mô tả:** Log lịch sử.
        
    - `LoaiBienDong`: (Nhập khẩu, Chuyển đi, Mất...).
        
    - **Hoạt động:** Mỗi khi thêm/xóa/sửa trạng thái ở bảng `CuDan`, hệ thống sẽ tự động (hoặc thủ công) tạo một dòng ở đây để lưu vết.


### 3. App: `finance` (Tài chính & Kế toán)

Module phức tạp nhất, xử lý tiền nong.

- **Table `DanhMucPhi`**
    
    - **Mô tả:** Bảng cấu hình giá.
        
    - `DonGiaHienTai`: Giá áp dụng tại thời điểm hiện tại.
        
    - **Lưu ý:** Admin có thể thay đổi giá ở đây bất cứ lúc nào.

- **Table `ChiSoDienNuoc`**
    
    - **Mô tả:** Dữ liệu đầu vào hàng tháng.
        
    - `ChiSoCu`, `ChiSoMoi`: Dùng để tính lượng tiêu thụ (`Moi` - `Cu`).
        
    - `NgayChot`: Ngày ghi số điện.

- **Table `HoaDon` (Invoice Header)**
    
    - **Mô tả:** Đại diện cho "tờ hóa đơn".
        
    - `TongTien`: Tổng giá trị cần thanh toán. Được update sau khi cộng tổng các `ChiTietHoaDon`.
        
    - `TrangThai`: `0` (Chưa thu), `1` (Đã thu).

- **Table `ChiTietHoaDon` (Invoice Lines) - [CỰC KỲ QUAN TRỌNG]**
    
    - **Mô tả:** Chi tiết từng dòng tiền.
        
    - `DonGiaSnapshot`: **Cơ chế Snapshot**. Khi tạo dòng này, hệ thống sẽ copy `DonGiaHienTai` từ bảng `DanhMucPhi` và lưu cứng vào đây. Giúp hóa đơn không bị sai lệch khi giá thị trường thay đổi sau này.
        
    - `ThanhTien`: `SoLuong` * `DonGiaSnapshot`.

### 4. App: `services` (Tiện ích)

- **Table `YeuCau`:** Ticket hỗ trợ. `TrangThai` giúp theo dõi tiến độ xử lý.
    
- **Table `TinTuc`:** CMS đơn giản để BQL đăng thông báo.