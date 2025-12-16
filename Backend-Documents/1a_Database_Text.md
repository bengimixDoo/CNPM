// --- APP 1: NGƯỜI DÙNG & HỆ THỐNG ---
// --- APP NAME: users ---
Table Users {
  id int [pk, increment]
  username varchar
  password varchar
  email varchar
  role varchar [note: "ADMIN, QUAN_LY, CU_DAN"]
  cu_dan_id int [ref: - CuDan.MaCuDan, null, note: "Link nếu user là cư dân"]
  is_active boolean
}


// --- APP 2: QUẢN LÍ TÒA NHÀ, CƯ DÂN ---
// --- APP NAME: residents ---
Table CanHo {
  MaCanHo int [pk, increment]
  MaHienThi varchar [unique, note: "A-101, B-205..."]
  Tang int
  ToaNha varchar
  DienTich float
  MaChuSoHuu int [ref: > CuDan.MaCuDan, null]
  TrangThai varchar [note: "Trong, DaBan, ChoThue"]
}

Table CuDan {
  MaCuDan int [pk, increment]
  HoTen varchar
  NgaySinh date
  SoCCCD varchar
  SoDienThoai varchar
  MaCanHoDangO int [ref: > CanHo.MaCanHo, null]
  LaChuHo boolean
  TrangThaiCuTru varchar [note: "ThuongTru, TamTru"]
}

Table BienDongDanCu {
  MaBienDong int [pk, increment]
  MaCuDan int [ref: > CuDan.MaCuDan]
  LoaiBienDong varchar [note: "NhapKhau, ChuyenDi..."]
  NgayThucHien date
}


// --- APP 3: CÁC DỊCH VỤ TÀI CHÍNH ---
// --- APP NAME: finance ---
Table DanhMucPhi {
  MaLoaiPhi int [pk, increment]
  TenLoaiPhi varchar
  DonGiaHienTai decimal
  DonViTinh varchar
}

Table ChiSoDienNuoc {
  MaChiSo int [pk, increment]
  MaCanHo int [ref: > CanHo.MaCanHo]
  LoaiDichVu varchar
  Thang int
  Nam int
  ChiSoCu int
  ChiSoMoi int
  NgayChot date
}

Table HoaDon {
  MaHoaDon int [pk, increment]
  MaCanHo int [ref: > CanHo.MaCanHo]
  Thang int
  Nam int
  TongTien decimal
  TrangThai int [note: "0: ChuaThu, 1: DaThu"]
  NgayTao datetime
}

Table ChiTietHoaDon {
  MaChiTiet int [pk, increment]
  MaHoaDon int [ref: > HoaDon.MaHoaDon]
  MaLoaiPhi int [ref: > DanhMucPhi.MaLoaiPhi]
  TenPhiSnapshot varchar [note: "Lưu cứng tên phí lúc tạo"]
  SoLuong int
  DonGiaSnapshot decimal [note: "Lưu cứng giá lúc tạo"]
  ThanhTien decimal
}


// --- APP 4: TIỆN TÍCH VÀ DỊCH VỤ ---
// --- APP NAME: services ---
Table PhuongTien {
  MaXe int [pk, increment]
  MaCanHo int [ref: > CanHo.MaCanHo]
  BienSo varchar
  LoaiXe varchar
}

Table YeuCau {
  MaYeuCau int [pk, increment]
  MaCuDan int [ref: > CuDan.MaCuDan]
  TieuDe varchar
  NoiDung text
  TrangThai varchar [note: "Moi, DangXuLy, HoanThanh"]
  PhanHoiBQL text
  NgayGui datetime
}

Table TinTuc {
  MaTin int [pk, increment]
  TieuDe varchar
  NoiDung text
  NguoiDang int [ref: > Users.id]
  NgayDang datetime
}
