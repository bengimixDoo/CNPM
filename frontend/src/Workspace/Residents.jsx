
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

const defaultPaginationModel = { page: 0, pageSize: 5 }; 
const columns = [
  { field: "invoice", headerName: "Mã khoản thu", width: 120 },
  { field: "apartment", headerName: "Căn hộ", width: 100 },
  { field: "owner", headerName: "Chủ hộ", width: 160 },
  { field: "feetype", headerName: "Loại phí", width: 140 },
  {
    field: "amount",
    headerName: "Số tiền",
    width: 120,
    type: "number",
    valueFormatter: (params) =>
      params.value != null
        ? params.value.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })
        : "",
  },
  { field: "paymentMethod", headerName: "Hình thức", width: 120 },
  { field: "dateCreated", headerName: "Ngày tạo", width: 130 },
  { field: "dateDue", headerName: "Hạn thanh toán", width: 140 },
  { field: "status", headerName: "Trạng thái", width: 120 },
  {
    field: "actions",
    headerName: "Hành động",
    type: "actions",
    width: 110,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Sửa"
        onClick={() => {}}
        showInMenu={false}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Xóa"
        onClick={() =>
          params.api.getRow(params.id) &&
          params.api.updateRows([{ id: params.id, _action: "delete" }])
        }
        showInMenu={false}
      />,
    ],
  },
];

const initialRows = [
  {
    id: "F-001",
    invoice: "F-001",
    apartment: "A1-1203",
    owner: "Nguyễn Văn An",
    feetype: "Phí dịch vụ",
    amount: 1000000,
    paymentMethod: "Chuyển khoản",
    dateCreated: "2024-01-01",
    dateDue: "2024-01-31",
    status: "Đã thanh toán",
    note: "Thanh toán đầy đủ",
  },
  {
    id: "F-002",
    invoice: "F-002",
    apartment: "A1-1204",
    owner: "Trần Thị B",
    feetype: "Phí quản lý",
    amount: 1500000,
    paymentMethod: "Tiền mặt",
    dateCreated: "2024-02-01",
    dateDue: "2024-02-28",
    status: "Chưa thanh toán",
    note: "Nhắc nợ 2 lần",
  },
  {
    id: "F-003",
    invoice: "F-003",
    apartment: "A1-1205",
    owner: "Lê Văn C",
    feetype: "Phí gửi xe",
    amount: 200000,
    paymentMethod: "Chuyển khoản",
    dateCreated: "2024-03-01",
    dateDue: "2024-03-15",
    status: "Đã thanh toán",
    note: "Thanh toán trước hạn",
  },
  {
    id: "F-004",
    invoice: "F-004",
    apartment: "A1-1206",
    owner: "Phạm Thị D",
    feetype: "Phí dịch vụ",
    amount: 1200000,
    paymentMethod: "Tiền mặt",
    dateCreated: "2024-04-01",
    dateDue: "2024-04-30",
    status: "Chưa thanh toán",
    note: "Đang chờ xác nhận",
  },
  {
    id: "F-005",
    invoice: "F-005",
    apartment: "A1-1207",
    owner: "Hoàng Văn E",
    feetype: "Phí dịch vụ",
    amount: 1800000,
    paymentMethod: "Chuyển khoản",
    dateCreated: "2024-05-01",
    dateDue: "2024-05-31",
    status: "Đã thanh toán",
    note: "Kèm biên lai",
  },
  {
    id: "F-006",
    invoice: "F-006",
    apartment: "A1-1208",
    owner: "Nguyễn Văn F",
    feetype: "Phí quản lý",
    amount: 1100000,
    paymentMethod: "Chuyển khoản",
    dateCreated: "2024-06-01",
    dateDue: "2024-06-30",
    status: "Chưa thanh toán",
    note: "Đã gửi email",
  },
  {
    id: "F-007",
    invoice: "F-007",
    apartment: "A1-1209",
    owner: "Nguyễn Văn G",
    feetype: "Phí gửi xe",
    amount: 130000,
    paymentMethod: "Tiền mặt",
    dateCreated: "2024-07-01",
    dateDue: "2024-07-31",
    status: "Đã thanh toán",
    note: "",
  },
  {
    id: "F-008",
    invoice: "F-008",
    apartment: "A1-1210",
    owner: "Trương Thị H",
    feetype: "Phí dịch vụ",
    amount: 1400000,
    paymentMethod: "Chuyển khoản",
    dateCreated: "2024-08-01",
    dateDue: "2024-08-31",
    status: "Chưa thanh toán",
    note: "Yêu cầu gia hạn",
  },
  {
    id: "F-009",
    invoice: "F-009",
    apartment: "A1-1211",
    owner: "Võ Văn I",
    feetype: "Phí dịch vụ",
    amount: 1600000,
    paymentMethod: "Chuyển khoản",
    dateCreated: "2024-09-01",
    dateDue: "2024-09-30",
    status: "Đã thanh toán",
    note: "Thanh toán bằng QR",
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

      <Paper sx={{ height: 700, width: "100%" }} >
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
