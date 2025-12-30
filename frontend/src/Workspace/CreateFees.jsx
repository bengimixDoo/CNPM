import StatCard from "../components/StatCard";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useMemo, useEffect } from "react";
import { financeService } from "../api/services";
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
import formatFee from "../util/FormatFee";
import Typography from "@mui/material/Typography";

const defaultPaginationModel = { page: 0, pageSize: 5 };

// Cột khớp API: ten_loai_phi, dong_gia_hien_tai, don_vi_tinh
const makeColumns = (onEdit, onDelete) => [
  {
    field: "ma_phi",
    headerName: "Mã loại phí",
    width: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "ten_phi",
    headerName: "Tên phí",
    minWidth: 160,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "don_gia",
    headerName: "Đơn giá",
    width: 160,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "don_vi_tinh",
    headerName: "Đơn vị tính",
    width: 160,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "loai_phi",
    headerName: "Loại phí",
    width: 160,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "actions",
    headerName: "Hành động",
    type: "actions",
    width: 120,
    headerAlign: "center",
    getActions: (params) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Sửa"
        onClick={() => onEdit(params.row)}
        showInMenu={false}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Xóa"
        onClick={() => onDelete(params.row)}
        showInMenu={false}
      />,
    ],
  },
];

const makeContributionColumns = () => [
  {
    field: "stt",
    headerName: "STT",
    width: 80,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "ten_dong_gop",
    headerName: "Tên khoản đóng góp",
    minWidth: 200,
    headerAlign: "center",
  },
  {
    field: "ngay_bat_dau",
    headerName: "Ngày bắt đầu",
    width: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "ngay_ket_thuc",
    headerName: "Ngày kết thúc",
    width: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "so_tien_du_kien",
    headerName: "Số tiền dự kiến",
    width: 160,
    headerAlign: "right",
    align: "right",
    valueFormatter: (value) => {
      if (!value) return "0 VND";
      return Number(value).toLocaleString("vi-VN") + " VND";
    },
  },
];

export default function CreateFees() {
  const [rows, setRows] = useState([]);
  const [contributions, setContributions] = useState([]); // State cho bảng Đóng góp
  const [loading, setLoading] = useState(false);
  const [loadingContrib, setLoadingContrib] = useState(false);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const data = await financeService.getFeeCategories();
      const mapped = data.map((f) => ({
        ...f,
        _rowId: f.ma_phi,
        dong_gia_hien_tai: f.dong_gia_hien_tai,
      }));
      setRows(mapped);
    } catch (error) {
      console.error("Lỗi khi tải danh sách loại phí:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContributions = async () => {
    setLoadingContrib(true);
    try {
      const resp = await financeService.getContributions();
      console.log("Fundraising data:", resp);

      // Xử lý trường hợp phân trang (DRF often returns { results: [...] })
      const rawData = Array.isArray(resp) ? resp : resp.results || [];

      const mapped = rawData.map((d, index) => ({
        id: d.ma_dot || d.id || `temp-id-${index}`, // Ưu tiên ID thực từ backend (ma_dot/id) hoặc tạo tạm index
        stt: index + 1,
        ten_dong_gop: d.ten_dot || d.name, // Support cả field cũ/mới nếu API thay đổi
        ngay_bat_dau: d.ngay_bat_dau || d.start_date,
        ngay_ket_thuc: d.ngay_ket_thuc || d.end_date,
        so_tien_du_kien: d.so_tien_du_kien || d.expected_amount,
      }));
      setContributions(mapped);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đóng góp:", error);
    } finally {
      setLoadingContrib(false);
    }
  };

  useEffect(() => {
    fetchFees();
    fetchContributions();
  }, []);
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    ten_loai_phi: "",
    dong_gia_hien_tai: "",
    don_vi_tinh: "",
  });

  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );

  const gridRows = useMemo(() => rows, [rows]);

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
            Thêm Loại Phí
          </Button>
        </Box>
      </div>

      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mt: 3, mb: 2, color: "var(--blue)" }}
      >
        CÁC KHOẢN PHÍ
      </Typography>
      <Paper
        sx={{
          height: containerHeight,
          borderRadius: "12px",
          transition: "height 0.2s ease",
          overflow: "hidden",
          mb: 4,
        }}
      >
        <DataGrid
          rows={gridRows}
          getRowId={(row) => row._rowId}
          columns={makeColumns(
            (row) => {
              setEditing(row);
              setForm({
                ten_loai_phi: row.ten_loai_phi,
                dong_gia_hien_tai: formatFee(row.dong_gia_hien_tai) || 0,
                don_vi_tinh: row.don_vi_tinh,
              });
              setOpenCreate(true);
            },
            async (row) => {
              if (confirm(`Xóa loại phí "${row.ten_loai_phi}"?`)) {
                try {
                  await financeService.deleteFeeCategory(row.ma_loai_phi);
                  await fetchFees();
                } catch (e) {
                  console.error("Xóa loại phí thất bại:", e);
                  alert("Không thể xóa. Vui lòng thử lại hoặc kiểm tra quyền.");
                }
              }
            }
          )}
          loading={loading}
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

      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 2, color: "var(--color-yellow-800)" }}
      >
        ĐÓNG GÓP
      </Typography>
      <Paper
        sx={{
          height: 400, // Chiều cao cố định hoặc tính toán tương tự
          borderRadius: "12px",
          overflow: "hidden",
          mb: 4,
        }}
      >
        <DataGrid
          rows={contributions}
          columns={makeContributionColumns()}
          loading={loadingContrib}
          getRowId={(row) => row.id} // Đảm bảo lấy đúng ID
          pageSizeOptions={[5, 10, 100]} // Thêm 100 để fix lỗi MUI X nếu cần
          pagination
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
        <DialogTitle>{editing ? "Sửa loại phí" : "Thêm loại phí"}</DialogTitle>
        <DialogContent>
          <div style={{ marginTop: 8, color: "#6b7280", marginBottom: 12 }}>
            Nhập thông tin loại phí để {editing ? "cập nhật" : "tạo mới"}.
          </div>
          <TextField
            fullWidth
            label="Tên loại phí"
            placeholder="Ví dụ: Phí Quản lý, Tiền Nước"
            margin="normal"
            value={form.ten_loai_phi}
            onChange={(e) =>
              setForm((f) => ({ ...f, ten_loai_phi: e.target.value }))
            }
          />
          <TextField
            fullWidth
            label="Đơn giá (VND)"
            placeholder="Nhập đơn giá"
            margin="normal"
            value={form.dong_gia_hien_tai}
            onChange={(e) =>
              setForm((f) => ({ ...f, dong_gia_hien_tai: e.target.value }))
            }
            inputProps={{ inputMode: "decimal" }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="unit-label">Đơn vị tính</InputLabel>
            <Select
              labelId="unit-label"
              value={form.don_vi_tinh}
              label="Đơn vị tính"
              onChange={(e) =>
                setForm((f) => ({ ...f, don_vi_tinh: e.target.value }))
              }
            >
              <MenuItem value={"m2"}>m²</MenuItem>
              <MenuItem value={"kWh"}>kWh</MenuItem>
              <MenuItem value={"m3"}>m³</MenuItem>
              <MenuItem value={"xe"}>xe</MenuItem>
              <MenuItem value={"tháng"}>tháng</MenuItem>
              <MenuItem value={"khác"}>khác</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setOpenCreate(false);
              setEditing(null);
            }}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={async () => {
              if (
                !form.ten_loai_phi ||
                !form.dong_gia_hien_tai ||
                !form.don_vi_tinh
              ) {
                alert("Vui lòng nhập đủ Tên loại phí, Đơn giá và Đơn vị tính.");
                return;
              }
              const payload = {
                ten_loai_phi: form.ten_loai_phi,
                dong_gia_hien_tai: parseFloat(form.dong_gia_hien_tai) || 0,
                don_vi_tinh: form.don_vi_tinh,
              };
              try {
                if (editing) {
                  await financeService.updateFeeCategory(
                    editing.ma_loai_phi,
                    payload
                  );
                } else {
                  await financeService.createFeeCategory(payload);
                }
                setOpenCreate(false);
                setEditing(null);
                setForm({
                  ten_loai_phi: "",
                  dong_gia_hien_tai: "",
                  don_vi_tinh: "",
                });
                await fetchFees();
              } catch (e) {
                console.error("Lưu loại phí thất bại:", e);
                alert(
                  "Không thể lưu loại phí. Vui lòng thử lại hoặc kiểm tra quyền."
                );
              }
            }}
            variant="contained"
          >
            {editing ? "Cập nhật" : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
