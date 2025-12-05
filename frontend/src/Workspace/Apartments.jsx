import StatCard from "../components/StatCard.jsx";
import "../styles/AdminDashboard.css";
import { 
    GridToolbarContainer, 
    GridToolbarFilterButton, 
    GridToolbarExport 
} from '@mui/x-data-grid'; // Các tool mặc định của DataGrid
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { 
    Button, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel,
    Box
} from '@mui/material'; // Các components cơ bản của MUI

import AddIcon from '@mui/icons-material/Add'; // Icon Thêm mới
import FilterListIcon from '@mui/icons-material/FilterList'; // Icon Lọc/Sắp xếp
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // Icon Xuất file


export default function Apartments() {
  return (
    <>
      <div className="stats-row">
        <StatCard
          title="Tổng số căn hộ"
          value="1,234"
          colorBackground="var(--color-bg-white)"
        />
        <StatCard
          title="Đang ở"
          value="₫567,890"
          colorBackground="var(--card)"
        />
        <StatCard title="Trống" value="345" colorBackground="var(--card)" />
        <StatCard
          title="Đang sửa chữa"
          value="78"
          colorBackground="var(--card)"
        />
      </div>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
          marginBottom: "16px",
          marginTop: "20px",
        }}
      >
        {/* --- 1. Khu vực Tìm kiếm và Lọc Nâng cao --- */}
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          {/* 1.1. Tìm kiếm (Dạng Input) */}
          <TextField
            // Tương đương với input.search-input
            variant="outlined"
            size="small"
            placeholder="Tìm theo mã căn hộ, tên chủ hộ..."
            sx={{ width: 300 }}
          />

          {/* 1.2. Lọc theo Tòa nhà */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Tòa nhà</InputLabel>
            <Select label="Tòa nhà" defaultValue="all">
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="A">Tòa A</MenuItem>
              <MenuItem value="B">Tòa B</MenuItem>
            </Select>
          </FormControl>

          {/* 1.3. Lọc theo Tầng */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Tầng</InputLabel>
            <Select label="Tầng" defaultValue="all">
              <MenuItem value="all">Tất cả</MenuItem>
              {/* Thêm các tầng từ 1 đến 30 */}
              {[...Array(30)].map((_, i) => (
                <MenuItem key={i} value={i + 1}>
                  Tầng {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 1.4. Lọc theo Trạng thái (Tái sử dụng ý tưởng từ DataGrid) */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
          >
            Trạng thái
          </Button>
        </Box>

        {/* --- 2. Khu vực Hành động (Buttons) --- */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {/* 2.2. Nút Xuất file (Download) */}
          <Button variant="outlined" sx={{ minWidth: "40px", padding: "8px" }}>
            <FileDownloadIcon />
          </Button>

          {/* 2.3. Nút Thêm Mới (Primary Action) */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: "var(--blue)" }} // Màu xanh nổi bật
          >
            Thêm Căn hộ
          </Button>
        </Box>
      </Box>

      <div
        className="apartment-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div className="apartment-card">
          <div className="header-section">
            <div className="header-info">
              <h3 className="text-lg font-bold">Căn hộ A-0702</h3>
              <p className="text-sm">Tòa A, Tầng 7</p>
            </div>
            <span className="status-tag">Đang ở</span>
          </div>

          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">Chủ hộ:</span>
              <span className="detail-value">Lê Văn C</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Diện tích:</span>
              <span className="detail-value">75 m²</span>
            </div>
          </div>

          <div className="action-section">
            <button className="action-button action-button-main">
              Xem Chi tiết
            </button>
            <button className="action-button">
              <span className="material-symbols-outlined text-lg">
                <MoreVertIcon />
              </span>
            </button>
          </div>
        </div>

        <div className="apartment-card">
          <div className="header-section">
            <div className="header-info">
              <h3 className="text-lg font-bold">Căn hộ A-0702</h3>
              <p className="text-sm">Tòa A, Tầng 7</p>
            </div>
            <span className="status-tag">Đang ở</span>
          </div>

          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">Chủ hộ:</span>
              <span className="detail-value">Lê Văn C</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Diện tích:</span>
              <span className="detail-value">75 m²</span>
            </div>
          </div>

          <div className="action-section">
            <button className="action-button action-button-main">
              Xem Chi tiết
            </button>
            <button className="action-button">
              <span className="material-symbols-outlined text-lg">
                <MoreVertIcon />
              </span>
            </button>
          </div>
        </div>

        <div className="apartment-card">
          <div className="header-section">
            <div className="header-info">
              <h3 className="text-lg font-bold">Căn hộ A-0702</h3>
              <p className="text-sm">Tòa A, Tầng 7</p>
            </div>
            <span className="status-tag">Đang ở</span>
          </div>

          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">Chủ hộ:</span>
              <span className="detail-value">Lê Văn C</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Diện tích:</span>
              <span className="detail-value">75 m²</span>
            </div>
          </div>

          <div className="action-section">
            <button className="action-button action-button-main">
              Xem Chi tiết
            </button>
            <button className="action-button">
              <span className="material-symbols-outlined text-lg">
                <MoreVertIcon />
              </span>
            </button>
          </div>
        </div>
        <div className="apartment-card">
          <div className="header-section">
            <div className="header-info">
              <h3 className="text-lg font-bold">Căn hộ A-0702</h3>
              <p className="text-sm">Tòa A, Tầng 7</p>
            </div>
            <span className="status-tag">Đang ở</span>
          </div>

          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">Chủ hộ:</span>
              <span className="detail-value">Lê Văn C</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Diện tích:</span>
              <span className="detail-value">75 m²</span>
            </div>
          </div>

          <div className="action-section">
            <button className="action-button action-button-main">
              Xem Chi tiết
            </button>
            <button className="action-button">
              <span className="material-symbols-outlined text-lg">
                <MoreVertIcon />
              </span>
            </button>
          </div>
        </div>
        <div className="apartment-card">
          <div className="header-section">
            <div className="header-info">
              <h3 className="text-lg font-bold">Căn hộ A-0702</h3>
              <p className="text-sm">Tòa A, Tầng 7</p>
            </div>
            <span className="status-tag">Đang ở</span>
          </div>

          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">Chủ hộ:</span>
              <span className="detail-value">Lê Văn C</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Diện tích:</span>
              <span className="detail-value">75 m²</span>
            </div>
          </div>

          <div className="action-section">
            <button className="action-button action-button-main">
              Xem Chi tiết
            </button>
            <button className="action-button">
              <span className="material-symbols-outlined text-lg">
                <MoreVertIcon />
              </span>
            </button>
          </div>
        </div>
        <div className="apartment-card">
          <div className="header-section">
            <div className="header-info">
              <h3 className="text-lg font-bold">Căn hộ A-0702</h3>
              <p className="text-sm">Tòa A, Tầng 7</p>
            </div>
            <span className="status-tag">Đang ở</span>
          </div>

          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">Chủ hộ:</span>
              <span className="detail-value">Lê Văn C</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Diện tích:</span>
              <span className="detail-value">75 m²</span>
            </div>
          </div>

          <div className="action-section">
            <button className="action-button action-button-main">
              Xem Chi tiết
            </button>
            <button className="action-button">
              <span className="material-symbols-outlined text-lg">
                <MoreVertIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
