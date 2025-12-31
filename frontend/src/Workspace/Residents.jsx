import "../styles/AdminDashboard.css";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FilterListIcon from "@mui/icons-material/FilterList";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState, useMemo, useEffect } from "react";
import { residentsService } from "../api/services";

const statusColors = {
  "Đang cư trú": {
    bg: "var(--color-green-100)",
    text: "var(--color-green-800)",
  },
  "Đã chuyển đi": { bg: "#fee2e2", text: "#dc2626" },
  "Tạm vắng": { bg: "#fef3c7", text: "#d97706" },
};

const defaultPaginationModel = { page: 0, pageSize: 10 };
const columns = [
  {
    field: "id",
    headerName: "Mã cư dân",
    width: 90,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "name",
    headerName: "Họ và tên",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sex",
    headerName: "Giới tính",
    width: 90,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "birth",
    headerName: "Ngày sinh",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cccd",
    headerName: "Số CCCD",
    width: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sdt",
    headerName: "Số điện thoại",
    width: 120,
    type: "number",
    headerAlign: "center",
    align: "center",
  },
  {
    field: "id_apartment",
    headerName: "Mã căn hộ",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "relationship",
    headerName: "Quan hệ ",
    width: 110,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "status",
    headerName: "Trạng thái cư trú",
    width: 140,
    headerAlign: "center",
    align: "center",
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

export default function Residents() {
  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [errors, setErrors] = useState({});
  const [newResident, setNewResident] = useState({
    ho_ten: "",
    gioi_tinh: "M",
    ngay_sinh: "",
    so_cccd: "",
    so_dien_thoai: "",
    can_ho_dang_o: "",
    la_chu_ho: false,
    trang_thai_cu_tru: "TT",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const data = await residentsService.getResidents();
      // Ánh xạ dữ liệu từ API về định dạng của DataGrid
      const formattedData = data.map((item) => {
        const statusMap = {
          TH: "Đang cư trú", // Thường trú
          TT: "Đang cư trú", // Tạm trú
          TV: "Tạm vắng",
          OUT: "Đã chuyển đi",
        };

        return {
          _rowId: item.ma_cu_dan,
          id: item.ma_cu_dan,
          name: item.ho_ten,
          sex: item.gioi_tinh === "M" ? "Nam" : "Nữ",
          birth: item.ngay_sinh,
          cccd: item.so_cccd,
          sdt: item.so_dien_thoai,
          id_apartment: item.can_ho_dang_o ?? "Chưa có",
          relationship: item.la_chu_ho ? "Chủ hộ" : "Thành viên",
          status: statusMap[item.trang_thai_cu_tru] || "Đang cư trú",
        };
      });
      setResidents(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cư dân:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleOpenCreate = () => {
    setOpenCreate(true);
    setErrors({});
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setErrors({});
    setNewResident({
      ho_ten: "",
      gioi_tinh: "M",
      ngay_sinh: "",
      so_cccd: "",
      so_dien_thoai: "",
      can_ho_dang_o: "",
      la_chu_ho: false,
      trang_thai_cu_tru: "TT",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newResident.ho_ten || newResident.ho_ten.trim() === "") {
      newErrors.ho_ten = "Họ và tên không được để trống";
    } else if (newResident.ho_ten.length < 3) {
      newErrors.ho_ten = "Họ và tên phải có ít nhất 3 ký tự";
    }

    if (!newResident.ngay_sinh) {
      newErrors.ngay_sinh = "Ngày sinh không được để trống";
    } else {
      const birthDate = new Date(newResident.ngay_sinh);
      const today = new Date();
      if (birthDate > today) {
        newErrors.ngay_sinh = "Ngày sinh không hợp lệ (vượt quá ngày hiện tại)";
      }
    }

    if (!newResident.so_cccd) {
      newErrors.so_cccd = "Số CCCD không được để trống";
    } else if (!/^\d{12}$/.test(newResident.so_cccd)) {
      newErrors.so_cccd = "Số CCCD phải có đúng 12 chữ số";
    }

    if (!newResident.so_dien_thoai) {
      newErrors.so_dien_thoai = "Số điện thoại không được để trống";
    } else if (!/^\d+$/.test(newResident.so_dien_thoai)) {
      newErrors.so_dien_thoai = "Số điện thoại chỉ được chứa các chữ số";
    } else if (newResident.so_dien_thoai.length < 10) {
      newErrors.so_dien_thoai = "Số điện thoại phải có ít nhất 10 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateResident = async () => {
    if (!validateForm()) {
      return;
    }

    setLoadingSubmit(true);
    try {
      const dataToSend = {
        ho_ten: newResident.ho_ten,
        gioi_tinh: newResident.gioi_tinh,
        ngay_sinh: newResident.ngay_sinh,
        so_cccd: newResident.so_cccd,
        so_dien_thoai: newResident.so_dien_thoai,
        la_chu_ho: newResident.la_chu_ho,
        trang_thai_cu_tru: newResident.trang_thai_cu_tru,
        can_ho_dang_o: newResident.can_ho_dang_o || null,
      };

      await residentsService.createResident(dataToSend);
      handleCloseCreate();
      await fetchResidents();
      alert("Thêm cư dân thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm cư dân:", error);
      if (error.response?.data) {
        const serverErrors = error.response.data;
        if (typeof serverErrors === "object") {
          const formattedErrors = {};
          Object.entries(serverErrors).forEach(([field, messages]) => {
            formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages;
          });
          setErrors(formattedErrors);
        } else {
          alert("Thêm cư dân thất bại: " + serverErrors);
        }
      } else {
        alert("Lỗi: " + error.message);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const rows = useMemo(() => residents, [residents]);

  const handlePaginationChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const containerHeight = useMemo(() => {
    const columnHeaderHeight = 56;
    const footerHeight = 74;
    const rowHeight = 52;
    const padding = 12;
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
            onClick={handleOpenCreate}
          >
            Thêm Cư dân
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
          rows={rows}
          getRowId={(row) => row._rowId}
          columns={columns}
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

      {/* Dialog Thêm Cư dân */}
      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: "var(--blue)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonAddIcon />
            Thêm Cư dân Mới
          </Box>
          <IconButton onClick={handleCloseCreate} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Họ và tên"
              placeholder="VD: Nguyễn Văn A"
              value={newResident.ho_ten}
              onChange={(e) => setNewResident({ ...newResident, ho_ten: e.target.value })}
              error={!!errors.ho_ten}
              helperText={errors.ho_ten}
              required
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={newResident.gioi_tinh}
                  label="Giới tính"
                  onChange={(e) => setNewResident({ ...newResident, gioi_tinh: e.target.value })}
                >
                  <MenuItem value="M">Nam</MenuItem>
                  <MenuItem value="F">Nữ</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Ngày sinh"
                type="date"
                value={newResident.ngay_sinh}
                onChange={(e) => setNewResident({ ...newResident, ngay_sinh: e.target.value })}
                error={!!errors.ngay_sinh}
                helperText={errors.ngay_sinh}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Số CCCD"
                placeholder="VD: 001234567890"
                value={newResident.so_cccd}
                onChange={(e) => setNewResident({ ...newResident, so_cccd: e.target.value })}
                error={!!errors.so_cccd}
                helperText={errors.so_cccd}
                required
              />

              <TextField
                fullWidth
                label="Số điện thoại"
                placeholder="VD: 0912345678"
                value={newResident.so_dien_thoai}
                onChange={(e) => setNewResident({ ...newResident, so_dien_thoai: e.target.value })}
                error={!!errors.so_dien_thoai}
                helperText={errors.so_dien_thoai}
                required
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Mã căn hộ"
                placeholder="VD: CH101 (để trống nếu chưa có)"
                value={newResident.can_ho_dang_o}
                onChange={(e) => setNewResident({ ...newResident, can_ho_dang_o: e.target.value })}
                error={!!errors.can_ho_dang_o}
                helperText={errors.can_ho_dang_o}
              />

              <FormControl fullWidth>
                <InputLabel>Trạng thái cư trú</InputLabel>
                <Select
                  value={newResident.trang_thai_cu_tru}
                  label="Trạng thái cư trú"
                  onChange={(e) => setNewResident({ ...newResident, trang_thai_cu_tru: e.target.value })}
                >
                  <MenuItem value="TT">Tạm trú</MenuItem>
                  <MenuItem value="TH">Thường trú</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Quan hệ với chủ hộ</InputLabel>
              <Select
                value={newResident.la_chu_ho}
                label="Quan hệ với chủ hộ"
                onChange={(e) => setNewResident({ ...newResident, la_chu_ho: e.target.value })}
              >
                <MenuItem value={false}>Thành viên</MenuItem>
                <MenuItem value={true}>Chủ hộ</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseCreate} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleCreateResident}
            variant="contained"
            disabled={loadingSubmit}
            sx={{ backgroundColor: "var(--blue)" }}
          >
            {loadingSubmit ? "Đang xử lý..." : "Thêm Cư dân"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
