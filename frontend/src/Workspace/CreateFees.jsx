import StatCard from "../components/StatCard";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useMemo } from "react";
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

const defaultPaginationModel = { page: 0, pageSize: 10 };
const columns = [
  {
    field: "fee_name",
    headerName: "Loại Phí",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "fee_code",
    headerName: "Mã Phí",
    width: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "calculation_type",
    headerName: "Loại Tính",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "rate_value",
    headerName: "Định mức",
    width: 120,
    type: "number",
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      params.value != null
        ? params.value.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })
        : "",
  },
  {
    field: "unit",
    headerName: "Đơn vị",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "billing_cycle",
    headerName: "Chu Kỳ",
    width: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "effective_date",
    headerName: "Ngày Áp dụng",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "is_active",
    headerName: "Trạng thái",
    width: 140,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) =>
      params.value ? "Đang hoạt động" : "Ngừng áp dụng",
  },
  {
    field: "description",
    headerName: "Ghi chú",
    width: 200,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "actions",
    headerName: "Hành động",
    type: "actions",
    width: 120,
    headerAlign: "center",
    getActions: () => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Sửa"
        onClick={() => {}}
        showInMenu={false}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Ngừng áp dụng"
        onClick={() => {}}
        showInMenu={false}
      />,
    ],
  },
];

const initialRows = [
  {
    id: "FEE-001",
    fee_name: "Phí Dịch vụ",
    fee_code: "DV-M2",
    calculation_type: "Diện tích (m²)",
    rate_value: 15000,
    unit: "đồng/m²/tháng",
    billing_cycle: "Hàng tháng",
    effective_date: "2025-01-01",
    is_active: true,
    description: "Áp dụng cho tất cả căn hộ",
  },
  {
    id: "FEE-002",
    fee_name: "Phí Quản lý",
    fee_code: "QL-M2",
    calculation_type: "Diện tích (m²)",
    rate_value: 8000,
    unit: "đồng/m²/tháng",
    billing_cycle: "Hàng tháng",
    effective_date: "2025-01-01",
    is_active: true,
    description: "Bao gồm quản lý chung cư và bảo vệ",
  },
  {
    id: "FEE-003",
    fee_name: "Phí Gửi xe",
    fee_code: "XEMAY-FIX",
    calculation_type: "Cố định/xe",
    rate_value: 200000,
    unit: "đồng/xe/tháng",
    billing_cycle: "Hàng tháng",
    effective_date: "2025-01-01",
    is_active: true,
    description: "Phí gửi xe máy hàng tháng",
  },
  {
    id: "FEE-004",
    fee_name: "Quỹ Đóng góp",
    fee_code: "QDF-FIXED",
    calculation_type: "Cố định",
    rate_value: 5000000,
    unit: "VND",
    billing_cycle: "Một lần",
    effective_date: "2025-01-15",
    is_active: true,
    description: "Quỹ bảo trì toà nhà - Thu một lần",
  },
  {
    id: "FEE-005",
    fee_name: "Phí Internet",
    fee_code: "INET-FIXED",
    calculation_type: "Cố định",
    rate_value: 150000,
    unit: "VND/tháng",
    billing_cycle: "Hàng tháng",
    effective_date: "2024-06-01",
    is_active: false,
    description: "Ngừng áp dụng từ 2024-12-31",
  },
  {
    id: "FEE-006",
    fee_name: "Phí Nước",
    fee_code: "WATER-UNIT",
    calculation_type: "Theo đơn vị",
    rate_value: 25000,
    unit: "đồng/m³",
    billing_cycle: "Hàng tháng",
    effective_date: "2025-01-01",
    is_active: true,
    description: "Tiền nước - Tính theo chỉ số đồng hồ",
  },
  {
    id: "FEE-007",
    fee_name: "Phí Điện",
    fee_code: "ELEC-UNIT",
    calculation_type: "Theo đơn vị",
    rate_value: 3500,
    unit: "đồng/kWh",
    billing_cycle: "Hàng tháng",
    effective_date: "2025-01-01",
    is_active: true,
    description: "Tiền điện - Tính theo chỉ số đồng hồ",
  },
  {
    id: "FEE-008",
    fee_name: "Phí Vệ sinh",
    fee_code: "CLEAN-M2",
    calculation_type: "Diện tích (m²)",
    rate_value: 5000,
    unit: "đồng/m²/tháng",
    billing_cycle: "Hàng tháng",
    effective_date: "2024-12-01",
    is_active: false,
    description: "Đã hợp nhất vào Phí dịch vụ",
  },
];

export default function CreateFees() {
  const [rows, setRows] = useState(initialRows);
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({
	title: "",
	amount: "",
	feetype: "Phí dịch vụ",
	paymentMethod: "Chuyển khoản",
	dateCreated: new Date().toISOString().slice(0, 10),
	dateDue: "",
	note: "",
	apartment: "",
	owner: "",
	status: "Chưa thanh toán",
  });

  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );

  const gridRows = useMemo(
    () => initialRows.map((r, i) => ({ ...r, _rowId: i })),
    []
  );

  const handlePaginationChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const containerHeight = useMemo(() => {
    const columnHeaderHeight = 56;
    const footerHeight = 74;
    const rowHeight = 52;
    const padding = 25;
    return (
      columnHeaderHeight +
      footerHeight +
      paginationModel.pageSize * rowHeight +
      padding
    );
  }, [paginationModel.pageSize]);

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
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            marginBottom: "16px",
            marginTop: "20px",
          }}
        >
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm theo mã căn hộ, tên chủ hộ..."
              sx={{ width: 400 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Tòa nhà</InputLabel>
              <Select label="Tòa nhà" defaultValue="all">
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="A">Tòa A</MenuItem>
                <MenuItem value="B">Tòa B</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Tầng</InputLabel>
              <Select label="Tầng" defaultValue="all">
                <MenuItem value="all">Tất cả</MenuItem>
                {[...Array(30)].map((_, i) => (
                  <MenuItem key={i} value={i + 1}>
                    Tầng {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterListIcon />}
              sx={{ width: 125, height: 40 }}
            >
              Trạng thái
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "var(--blue)",
              height: 40,
              marginLeft: "10px",
            }}
            onClick={() => setOpenCreate(true)}
          >
            Thêm Khoản Thu
          </Button>
        </Box>
      </div>

      <Paper
        sx={{
          height: containerHeight,
          borderRadius: "12px",
          transition: "height 0.2s ease",
          overflow: "hidden",
          marginTop: "16px",
        }}
      >
        <DataGrid
          rows={gridRows}
          getRowId={(row) => row._rowId}
          columns={columns}
          rowHeight={52}
          columnHeaderHeight={56}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{
            borderRadius: "12px",
            "& .MuiDataGrid-root": { height: "100%" },
          }}
        />
      </Paper>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tạo Khoản Thu Nhanh</DialogTitle>
        <DialogContent>
          <div style={{ marginTop: 8, color: "#6b7280", marginBottom: 12 }}>
            Điền thông tin dưới đây để tạo một khoản thu mới.
          </div>
          <TextField
            fullWidth
            label="Tên khoản thu"
            placeholder="Ví dụ: Phí dịch vụ tháng 10"
            margin="normal"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <TextField
            fullWidth
            label="Số tiền (VND)"
            placeholder="Nhập số tiền"
            margin="normal"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            inputProps={{ inputMode: "numeric" }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="feetype-label">Loại khoản thu</InputLabel>
            <Select
              labelId="feetype-label"
              value={form.feetype}
              label="Loại khoản thu"
              onChange={(e) =>
                setForm((f) => ({ ...f, feetype: e.target.value }))
              }
            >
              <MenuItem value={"Phí dịch vụ"}>Phí dịch vụ</MenuItem>
              <MenuItem value={"Phí quản lý"}>Phí quản lý</MenuItem>
              <MenuItem value={"Phí gửi xe"}>Phí gửi xe</MenuItem>
              <MenuItem value={"Khác"}>Khác</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="paymethod-label">Hình thức</InputLabel>
            <Select
              labelId="paymethod-label"
              value={form.paymentMethod}
              label="Hình thức"
              onChange={(e) =>
                setForm((f) => ({ ...f, paymentMethod: e.target.value }))
              }
            >
              <MenuItem value={"Chuyển khoản"}>Chuyển khoản</MenuItem>
              <MenuItem value={"Tiền mặt"}>Tiền mặt</MenuItem>
              <MenuItem value={"QR"}>QR</MenuItem>
            </Select>
          </FormControl>
          <div style={{ display: "flex", gap: 12 }}>
            <TextField
              label="Ngày tạo"
              type="date"
              value={form.dateCreated}
              onChange={(e) =>
                setForm((f) => ({ ...f, dateCreated: e.target.value }))
              }
              sx={{ mt: 2, flex: 1 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Hạn thanh toán"
              type="date"
              value={form.dateDue}
              onChange={(e) =>
                setForm((f) => ({ ...f, dateDue: e.target.value }))
              }
              sx={{ mt: 2, flex: 1 }}
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <TextField
            fullWidth
            label="Ghi chú"
            placeholder="Ghi chú thêm (tuỳ chọn)"
            margin="normal"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenCreate(false)} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={() => {
              // basic validation
              const amt = Number(String(form.amount).replace(/[^0-9]/g, ""));
              if (!form.title || !amt) {
                alert("Vui lòng nhập tên khoản thu và số tiền hợp lệ.");
                return;
              }
              const nextId = `F-${(rows.length + 1)
                .toString()
                .padStart(3, "0")}`;
              const newRow = {
                id: nextId,
                invoice: nextId,
                apartment: form.apartment || "A1-XXXX",
                owner: form.owner || "",
                feetype: form.feetype || "Phí dịch vụ",
                amount: amt,
                paymentMethod: form.paymentMethod || "Chuyển khoản",
                dateCreated:
                  form.dateCreated || new Date().toISOString().slice(0, 10),
                dateDue: form.dateDue || "",
                status: form.status || "Chưa thanh toán",
                note: form.note || "",
              };
              setRows((prev) => [newRow, ...prev]);
              setOpenCreate(false);
              // reset form
              setForm({
                title: "",
                amount: "",
                feetype: "Phí dịch vụ",
                paymentMethod: "Chuyển khoản",
                dateCreated: new Date().toISOString().slice(0, 10),
                dateDue: "",
                note: "",
              });
            }}
            variant="contained"
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
