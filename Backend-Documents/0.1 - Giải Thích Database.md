## APP `users`

### Table `Users`

|Trường|Ý nghĩa|
|---|---|
|`id`|Khóa chính|
|`username`|Tên đăng nhập|
|`password`|Mật khẩu (hash)|
|`email`|Email|
|`role`|Vai trò hệ thống|
|`cu_dan_id`|Link tới cư dân nếu là cư dân|
|`is_active`|Kích hoạt / khóa tài khoản|

---

## APP `residents`

### Table `CanHo`

|Trường|Ý nghĩa|
|---|---|
|`MaCanHo`|ID căn hộ|
|`MaHienThi`|Mã hiển thị|
|`Tang`|Tầng|
|`ToaNha`|Tòa|
|`DienTich`|Diện tích|
|`MaChuSoHuu`|Chủ sở hữu|
|`TrangThai`|Trạng thái|

### Table `CuDan`

|Trường|Ý nghĩa|
|---|---|
|`MaCuDan`|ID cư dân|
|`HoTen`|Họ tên|
|`NgaySinh`|Ngày sinh|
|`SoCCCD`|CCCD|
|`SoDienThoai`|SĐT|
|`MaCanHoDangO`|Căn đang ở|
|`LaChuHo`|Chủ hộ|
|`TrangThaiCuTru`|Trạng thái cư trú|

### Table `BienDongDanCu`

|Trường|Ý nghĩa|
|---|---|
|`MaBienDong`|ID|
|`MaCuDan`|Cư dân|
|`LoaiBienDong`|Nhập / chuyển|
|`NgayThucHien`|Ngày|

---
## APP `finance`

### Table `DanhMucPhi`

|Trường|Ý nghĩa|
|---|---|
|`MaLoaiPhi`|ID|
|`TenLoaiPhi`|Tên phí|
|`DonGiaHienTai`|Đơn giá|
|`DonViTinh`|m², kWh|

### Table `ChiSoDienNuoc`

|Trường|Ý nghĩa|
|---|---|
|`MaChiSo`|ID|
|`MaCanHo`|Căn hộ|
|`LoaiDichVu`|Điện / nước|
|`Thang/Nam`|Chu kỳ|
|`ChiSoCu/Moi`|Chỉ số|
|`NgayChot`|Ngày chốt|

### Table `HoaDon`

|Trường|Ý nghĩa|
|---|---|
|`MaHoaDon`|ID|
|`MaCanHo`|Căn|
|`Thang/Nam`|Kỳ|
|`TongTien`|Tổng|
|`TrangThai`|Thu chưa|
|`NgayTao`|Ngày tạo|

### Table `ChiTietHoaDon`

|Trường|Ý nghĩa|
|---|---|
|`MaChiTiet`|ID|
|`MaHoaDon`|Hóa đơn|
|`MaLoaiPhi`|Loại phí|
|`TenPhiSnapshot`|Snapshot|
|`SoLuong`|SL|
|`DonGiaSnapshot`|Giá|
|`ThanhTien`|Thành tiền|

## APP `services`

### Table `PhuongTien`

|Trường|Ý nghĩa|
|---|---|
|`MaXe`|ID|
|`MaCanHo`|Căn|
|`BienSo`|Biển|
|`LoaiXe`|Xe|

### Table `YeuCau`

|Trường|Ý nghĩa|
|---|---|
|`MaYeuCau`|ID|
|`MaCuDan`|Người gửi|
|`TieuDe`|Tiêu đề|
|`NoiDung`|Nội dung|
|`TrangThai`|Trạng thái|
|`PhanHoiBQL`|Phản hồi|
|`NgayGui`|Ngày|

### Table `TinTuc`

|Trường|Ý nghĩa|
|---|---|
|`MaTin`|ID|
|`TieuDe`|Tiêu đề|
|`NoiDung`|Nội dung|
|`NguoiDang`|User|
|`NgayDang`|Ngày|
