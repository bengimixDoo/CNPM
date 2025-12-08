import "../styles/AdminDashboard.css";
import StatCard from "../components/StatCard";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FilterListIcon from "@mui/icons-material/FilterList";

const statusColors = {
  "Đang cư trú": {
    bg: "var(--color-green-100)",
    text: "var(--color-green-800)",
  },
  "Đã chuyển đi": { bg: "#fee2e2", text: "#dc2626" },
  "Tạm vắng": { bg: "#fef3c7", text: "#d97706" },
};

const defaultPaginationModel = { page: 0, pageSize: 5 };
let columns = [
  { field: "id", headerName: "Mã cư dân", width: 120 },
  { field: "name", headerName: "Họ và tên", width: 150 },
  { field: "birth", headerName: "Ngày sinh", width: 100 },
  { field: "cccd", headerName: "Số CCCD", width: 140 },
  {
    field: "sdt",
    headerName: "Số điện thoại",
    width: 120,
    type: "number",
  },
  { field: "email", headerName: "Email", width: 120 },
  { field: "id_apartment", headerName: "Mã căn hộ", width: 130 },
  { field: "relationship", headerName: "Quan hệ ", width: 110 },
  {
    field: "status",
    headerName: "Trạng thái cư chú",
    width: 120,
    renderCell: (params) => {
      const color = statusColors[params.value] || statusColors["Đang cư trú"];
      return (
        <span
          style={{
            backgroundColor: color.bg,
            color: color.text,
            padding: "4px 8px",
            borderRadius: "11px",
            fontWeight: "500",
            fontSize: "12px",
          }}
        >
          {params.value}
        </span>
      );
    },
  },
];

const initialRows = [
  {
    id: "F-001",
    name: "Nguyễn Văn A",
    birth: "1990-01-01",
    cccd: "123456789",
    sdt: "0987654321",
    email: "nguyenvana@example.com",
    id_apartment: "A1-1203",
    relationship: "Chủ hộ",
    status: "Đang cư trú",
  },
  {
    id: "F-002",
    name: "Nguyễn Văn A",
    birth: "1990-01-01",
    cccd: "123456789",
    sdt: "0987654321",
    email: "nguyenvana@example.com",
    id_apartment: "A1-1203",
    relationship: "Chủ hộ",
    status: "Tạm vắng",
  },
  {
    id: "F-003",
    name: "Nguyễn Văn A",
    birth: "1990-01-01",
    cccd: "123456789",
    sdt: "0987654321",
    email: "nguyenvana@example.com",
    id_apartment: "A1-1203",
    relationship: "Chủ hộ",
    status: "Đang cư trú",
  },
  {
    id: "F-004",
    name: "Nguyễn Văn A",
    birth: "1990-01-01",
    cccd: "123456789",
    sdt: "0987654321",
    email: "nguyenvana@example.com",
    id_apartment: "A1-1203",
    relationship: "Chủ hộ",
    status: "Đang cư trú",
  },
  {
    id: "F-005",
    name: "Nguyễn Văn A",
    birth: "1990-01-01",
    cccd: "123456789",
    sdt: "0987654321",
    email: "nguyenvana@example.com",
    id_apartment: "A1-1203",
    relationship: "Chủ hộ",
    status: "Đang cư trú",
  },
];

export default function Residents() {
  return (
    <>
      <div className="dashboard-grid">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            backgroundColor: "white",
            borderBottom: "1px solid #e0e0e0",
            borderRadius: "12px",
          }}
        >
          {/* --- 1. Khu vực Tìm kiếm và Lọc Nâng cao --- */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              borderRadius: "12px",
            }}
          >
            {/* 1.1. Tìm kiếm (Dạng Input) */}
            <TextField
              // Tương đương với input.search-input
              variant="outlined"
              size="small"
              placeholder="Tìm theo mã căn hộ, tên chủ hộ..."
              sx={{ width: 500 }}
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
              sx={{
                width: 125,
                height: 40,
              }}
            >
              Trạng thái
            </Button>
          </Box>

          {/* --- 2. Khu vực Hành động (Buttons) --- */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ backgroundColor: "var(--blue)" }} // Màu xanh nổi bật
            >
              Thêm Căn hộ
            </Button>
          </Box>
        </Box>
      </div>

      <Paper sx={{ height: 700 }}>
        <DataGrid
          rows={initialRows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: defaultPaginationModel },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}
