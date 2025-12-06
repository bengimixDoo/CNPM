import StatCard from "../components/StatCard";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

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

const defaultPaginationModel = { page: 0, pageSize: 5 };

export default function Fees() {
  const [rows, setRows] = useState(initialRows);
  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );

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

  const handleDelete = useCallback((id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // We map actions to call handlers via DataGrid API when necessary.

  return (
    <>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          padding: "0 16px",
          overflow: "auto",
        }}
      >
        <div
          className="stats-row"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          <StatCard
            title="Tổng thu tháng này"
            value={rows
              .reduce(
                (s, r) => s + (r.status === "Đã thanh toán" ? r.amount : 0),
                0
              )
              .toLocaleString()} // raw sum
            colorBackground="var(--green)"
          />
          <StatCard
            title="Tổng nợ quá hạn"
            value={rows.filter((r) => r.status !== "Đã thanh toán").length}
            colorBackground="var(--blue)"
          />
          <StatCard
            title="Tổng khoản"
            value={rows.length}
            colorBackground="var(--yellow)"
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="medium"
            disableElevation
            style={{ fontSize: "15px", width: "220px", padding: 8 }}
            onClick={() => setOpenCreate(true)}
          >
            Tạo khoản thu mới
          </Button>

          <TextField
            variant="outlined"
            size="small"
            placeholder="Tìm theo mã, căn hộ, chủ hộ..."
            sx={{ width: "40%" }}
            onChange={(e) => {
              const q = e.target.value.trim().toLowerCase();
              if (!q) {
                setRows(initialRows);
                return;
              }
              setRows(
                initialRows.filter((r) =>
                  (r.invoice + r.apartment + r.owner).toLowerCase().includes(q)
                )
              );
            }}
          />
        </div>

        <Paper sx={{ height: 520, width: "100%" }} style={{ marginTop: 12 }}>
          <DataGrid
            rows={rows}
            columns={columns.map((col) => {
              if (col.field === "actions") {
                return {
                  ...col,
                  getActions: (params) => [
                    <GridActionsCellItem
                      icon={<EditIcon />}
                      label="Sửa"
                      onClick={() => alert(`Sửa ${params.id} - chức năng demo`)}
                      showInMenu={false}
                    />,
                    <GridActionsCellItem
                      icon={<DeleteIcon />}
                      label="Xóa"
                      onClick={() => handleDelete(params.id)}
                      showInMenu={false}
                    />,
                  ],
                };
              }
              return col;
            })}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>
        {/* Create Fee Modal */}
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
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            <TextField
              fullWidth
              label="Số tiền (VND)"
              placeholder="Nhập số tiền"
              margin="normal"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
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
      </div>
    </>
  );
}

export function CreateFees() {
  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        size="medium"
        disableElevation
        style={{ fontSize: "15px", width: "200px", padding: 5, right: 0 }}
      >
        Tạo khoản thu mới
      </Button>
      <div
        style={{
          margin: "0 auto",
          width: "100%",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 8,
            marginTop: 20,
          }}
        >
          <TextField
            // Tương đương với input.search-input
            variant="outlined"
            size="small"
            placeholder="Tìm theo mã căn hộ, tên chủ hộ..."
            sx={{ width: "100%" }}
          />

          <Paper sx={{ height: 700, width: "100%" }} style={{ marginTop: 20 }}>
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
        </div>
      </div>
    </>
  );
}
