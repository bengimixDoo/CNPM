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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HandshakeIcon from "@mui/icons-material/Handshake";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const defaultPaginationModel = { page: 0, pageSize: 5 };

// Cột khớp API: ten_phi, don_gia, don_vi_tinh, loai_phi
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
    width: 200,
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

const makeContributionColumns = (onDelete) => [
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
  {
    field: "actions",
    headerName: "Hành động",
    type: "actions",
    width: 100,
    headerAlign: "center",
    getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Xóa"
        onClick={() => onDelete(params.row)}
        showInMenu={false}
      />,
    ],
  },
];

export default function CreateFees() {
  const [rows, setRows] = useState([]);
  const [contributions, setContributions] = useState([]); // State cho bảng Đóng góp
  const [loading, setLoading] = useState(false);
  const [loadingContrib, setLoadingContrib] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 = Các khoản phí, 1 = Đóng góp

  const fetchFees = async () => {
    setLoading(true);
    try {
      const data = await financeService.getFeeCategories();
      const mapped = data.map((f) => ({
        ...f,
        _rowId: f.ma_phi,
        don_gia: f.don_gia,
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

  const handleDeleteContribution = async (contrib) => {
    if (!confirm(`Xóa khoản đóng góp "${contrib.ten_dong_gop}"?`)) return;
    try {
      await financeService.deleteContribution(contrib.id);
      alert("Xóa khoản đóng góp thành công!");
      await fetchContributions();
    } catch (error) {
      console.error("Xóa khoản đóng góp thất bại:", error);
      alert(error.response?.data?.detail || "Không thể xóa. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchFees();
    fetchContributions();
  }, []);

  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateContrib, setOpenCreateContrib] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    ten_phi: "",
    don_gia: "",
    don_vi_tinh: "",
    loai_phi: "",
  });
  const [formContrib, setFormContrib] = useState({
    ten_dot: "",
    ngay_bat_dau: "",
    ngay_ket_thuc: "",
    so_tien_du_kien: "",
  });
  const [errorsContrib, setErrorsContrib] = useState({});

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
        {/* Tabs Navigation */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "12px 12px 0 0",
            borderBottom: "1px solid #e0e0e0",
            width: "fit-content",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: "15px",
                minHeight: "56px",
                minWidth: "auto",
                paddingX: "24px",
              },
            }}
          >
            <Tab
              icon={<ReceiptIcon />}
              iconPosition="start"
              label="Các khoản phí"
            />
            <Tab
              icon={<HandshakeIcon />}
              iconPosition="start"
              label="Đóng góp"
            />
          </Tabs>
          {activeTab === 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Box sx={{ display: "flex", gap: 26, alignItems: "center" }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Tìm theo mã căn hộ, tên chủ hộ..."
                    sx={{ width: 700 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      backgroundColor: "var(--blue)",
                      height: 40,
                      marginLeft: "10px",
                      width: "200px",
                    }}
                    onClick={() => setOpenCreate(true)}
                  >
                    Thêm Loại Phí
                  </Button>
                </Box>
              </Box>

              <Paper
                sx={{
                  height: containerHeight,
                  borderRadius: "12px",
                  transition: "height 0.2s ease",
                  overflow: "hidden",
                }}
              >
                <DataGrid
                  rows={gridRows}
                  getRowId={(row) => row._rowId}
                  columns={makeColumns(
                    (row) => {
                      setEditing(row);
                      setForm({
                        ten_phi: row.ten_phi,
                        don_gia: formatFee(row.don_gia) || 0,
                        don_vi_tinh: row.don_vi_tinh,
                        loai_phi: row.loai_phi || "",
                      });
                      setOpenCreate(true);
                    },
                    async (row) => {
                      if (confirm(`Xóa loại phí "${row.ten_phi}"?`)) {
                        try {
                          await financeService.deleteFeeCategory(row.ma_phi);
                          await fetchFees();
                        } catch (e) {
                          console.error("Xóa loại phí thất bại:", e);
                          alert(
                            "Không thể xóa. Vui lòng thử lại hoặc kiểm tra quyền."
                          );
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
                    borderRadius: "0 0 12px 12px",
                    "& .MuiDataGrid-root": { height: "100%" },
                  }}
                />
              </Paper>
            </>
          )}

          {/* Tab 1: Đóng góp */}
          {activeTab === 1 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Box sx={{ display: "flex", gap: 26, alignItems: "center" }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Tìm theo mã căn hộ, tên chủ hộ..."
                    sx={{ width: 700 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      backgroundColor: "var(--blue)",
                      height: 40,
                      marginLeft: "10px",
                      width: "200px",
                    }}
                    onClick={() => setOpenCreate(true)}
                  >
                    Thêm Loại Phí
                  </Button>
                </Box>
              </Box>

              <Paper
                sx={{
                  height: containerHeight,
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <DataGrid
                  rows={contributions}
                  columns={makeContributionColumns(handleDeleteContribution)}
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
            </>
          )}
        </Box>
      </div>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f1f5f9",
            padding: "10px",
            background: "linear-gradient(to right, #bcd9f2ff, #f8fafc)",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                backgroundColor: "var(--blue)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <ReceiptIcon sx={{ fontSize: 30 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                {editing ? "Sửa loại phí" : "Thêm loại phí"}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setOpenCreate(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
              "&:hover": {
                color: (theme) => theme.palette.grey[900],
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ color: "#6b7280", fontSize: "0.875rem" }}>
              Nhập thông tin loại phí để {editing ? "cập nhật" : "tạo mới"}.
            </Box>
            <TextField
              fullWidth
              label="Tên loại phí"
              placeholder="Ví dụ: Phí Quản lý, Tiền Nước"
              value={form.ten_phi}
              onChange={(e) =>
                setForm((f) => ({ ...f, ten_phi: e.target.value }))
              }
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Đơn giá (VND)"
                placeholder="Nhập đơn giá"
                value={form.don_gia}
                onChange={(e) =>
                  setForm((f) => ({ ...f, don_gia: e.target.value }))
                }
                inputProps={{ inputMode: "decimal" }}
              />
              <FormControl fullWidth>
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
            </Box>
            <TextField
              fullWidth
              label="Loại phí (tùy chọn)"
              placeholder="Ví dụ: Nước, Điện, Quản lý"
              value={form.loai_phi}
              onChange={(e) =>
                setForm((f) => ({ ...f, loai_phi: e.target.value }))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
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
              if (!form.ten_phi || !form.don_gia || !form.don_vi_tinh) {
                alert("Vui lòng nhập đủ Tên loại phí, Đơn giá và Đơn vị tính.");
                return;
              }
              const payload = {
                ten_phi: form.ten_phi,
                don_gia: parseFloat(form.don_gia) || 0,
                don_vi_tinh: form.don_vi_tinh,
                loai_phi: form.loai_phi,
              };
              try {
                if (editing) {
                  await financeService.updateFeeCategory(
                    editing.ma_phi,
                    payload
                  );
                } else {
                  await financeService.createFeeCategory(payload);
                }
                setOpenCreate(false);
                setEditing(null);
                setForm({
                  ten_phi: "",
                  don_gia: "",
                  don_vi_tinh: "",
                  loai_phi: "",
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
            sx={{ backgroundColor: "var(--blue)" }}
          >
            {editing ? "Cập nhật" : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Thêm Khoản Đóng Góp */}
      <Dialog
        open={openCreateContrib}
        onClose={() => {
          setOpenCreateContrib(false);
          setFormContrib({
            ten_dot: "",
            ngay_bat_dau: "",
            ngay_ket_thuc: "",
            so_tien_du_kien: "",
          });
          setErrorsContrib({});
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f1f5f9",
            padding: "10px",
            background: "linear-gradient(to right, #bcd9f2ff, #f8fafc)",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                backgroundColor: "var(--blue)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <HandshakeIcon sx={{ fontSize: 30 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                Thêm Khoản Đóng Góp
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setOpenCreateContrib(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
              "&:hover": {
                color: (theme) => theme.palette.grey[900],
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ color: "#6b7280", fontSize: "0.875rem" }}>
              Nhập thông tin khoản đóng góp mới.
            </Box>
            <TextField
              fullWidth
              label="Tên khoản đóng góp"
              placeholder="Ví dụ: Sửa chữa chung cư"
              value={formContrib.ten_dot}
              onChange={(e) =>
                setFormContrib((f) => ({ ...f, ten_dot: e.target.value }))
              }
              error={!!errorsContrib.ten_dot}
              helperText={errorsContrib.ten_dot}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Ngày bắt đầu"
                type="date"
                value={formContrib.ngay_bat_dau}
                onChange={(e) =>
                  setFormContrib((f) => ({
                    ...f,
                    ngay_bat_dau: e.target.value,
                  }))
                }
                error={!!errorsContrib.ngay_bat_dau}
                helperText={errorsContrib.ngay_bat_dau}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Ngày kết thúc"
                type="date"
                value={formContrib.ngay_ket_thuc}
                onChange={(e) =>
                  setFormContrib((f) => ({
                    ...f,
                    ngay_ket_thuc: e.target.value,
                  }))
                }
                error={!!errorsContrib.ngay_ket_thuc}
                helperText={errorsContrib.ngay_ket_thuc}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <TextField
              fullWidth
              label="Số tiền dự kiến (VND)"
              placeholder="Nhập số tiền"
              value={formContrib.so_tien_du_kien}
              onChange={(e) =>
                setFormContrib((f) => ({
                  ...f,
                  so_tien_du_kien: e.target.value,
                }))
              }
              error={!!errorsContrib.so_tien_du_kien}
              helperText={errorsContrib.so_tien_du_kien}
              inputProps={{ inputMode: "decimal" }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => {
              setOpenCreateContrib(false);
              setFormContrib({
                ten_dot: "",
                ngay_bat_dau: "",
                ngay_ket_thuc: "",
                so_tien_du_kien: "",
              });
              setErrorsContrib({});
            }}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={async () => {
              const newErrors = {};

              if (!formContrib.ten_dot || formContrib.ten_dot.trim() === "") {
                newErrors.ten_dot = "Tên khoản đóng góp không được để trống";
              }

              if (!formContrib.ngay_bat_dau) {
                newErrors.ngay_bat_dau = "Ngày bắt đầu không được để trống";
              }

              if (!formContrib.ngay_ket_thuc) {
                newErrors.ngay_ket_thuc = "Ngày kết thúc không được để trống";
              }

              if (
                formContrib.ngay_bat_dau &&
                formContrib.ngay_ket_thuc &&
                formContrib.ngay_bat_dau > formContrib.ngay_ket_thuc
              ) {
                newErrors.ngay_ket_thuc = "Ngày kết thúc phải sau ngày bắt đầu";
              }

              if (!formContrib.so_tien_du_kien) {
                newErrors.so_tien_du_kien =
                  "Số tiền dự kiến không được để trống";
              } else if (isNaN(parseFloat(formContrib.so_tien_du_kien))) {
                newErrors.so_tien_du_kien = "Số tiền phải là số";
              }

              if (Object.keys(newErrors).length > 0) {
                setErrorsContrib(newErrors);
                return;
              }

              try {
                const payload = {
                  ten_dot: formContrib.ten_dot,
                  ngay_bat_dau: formContrib.ngay_bat_dau,
                  ngay_ket_thuc: formContrib.ngay_ket_thuc,
                  so_tien_du_kien:
                    parseFloat(formContrib.so_tien_du_kien) || 0,
                };
                await financeService.createContribution(payload);
                setOpenCreateContrib(false);
                setFormContrib({
                  ten_dot: "",
                  ngay_bat_dau: "",
                  ngay_ket_thuc: "",
                  so_tien_du_kien: "",
                });
                setErrorsContrib({});
                await fetchContributions();
                alert("Thêm khoản đóng góp thành công!");
              } catch (e) {
                console.error("Lưu khoản đóng góp thất bại:", e);
                alert(
                  "Không thể lưu khoản đóng góp. Vui lòng thử lại hoặc kiểm tra quyền."
                );
              }
            }}
            variant="contained"
            sx={{ backgroundColor: "var(--blue)" }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
