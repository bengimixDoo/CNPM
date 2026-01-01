import "../styles/AdminDashboard.css";
import StatCard from "../components/StatCard";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import FilterListIcon from "@mui/icons-material/FilterList";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useState, useMemo, useEffect } from "react";
import { utilitiesService, apartmentsService } from "../api/services";

const defaultPaginationModel = { page: 0, pageSize: 10 };

const makeColumns = (onDelete) => [
  {
    field: "id",
    headerName: "Mã xe",
    width: 90,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bien_so",
    headerName: "Biển số",
    width: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "loai_xe",
    headerName: "Loại xe",
    width: 140,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const vehicleTypeColors = {
        "Ô tô": {
          bg: "var(--color-blue-100)",
          text: "var(--color-blue-800)",
        },
        "Xe máy": {
          bg: "var(--color-green-100)",
          text: "var(--color-green-800)",
        },
        "Xe đạp": {
          bg: "var(--color-yellow-100)",
          text: "var(--color-yellow-800)",
        },
        Khác: { bg: "#f3f4f6", text: "#374151" },
      };
      const color =
        vehicleTypeColors[params.value] || vehicleTypeColors["Khác"];
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
  {
    field: "ma_can_ho",
    headerName: "Căn hộ",
    width: 200,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      if (!params.value || params.value === "N/A") {
        return (
          <span style={{ color: "#999", fontStyle: "italic" }}>Chưa có</span>
        );
      }
      return (
        <span style={{ fontWeight: "500", color: "#333" }}>
          Căn hộ {params.value}
        </span>
      );
    },
  },
  {
    field: "ngay_dang_ky",
    headerName: "Ngày đăng ký",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 150,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const statusColors = {
        "Đang sử dụng": {
          bg: "var(--color-green-100)",
          text: "var(--color-green-800)",
        },
        "Ngừng hoạt động": { bg: "#fee2e2", text: "#dc2626" },
      };
      const color = statusColors[params.value] || statusColors["Đang sử dụng"];
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
  {
    field: "actions",
    headerName: "Hành động",
    type: "actions",
    width: 100,
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

export default function Vehicles() {
  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [errors, setErrors] = useState({});
  const [newVehicle, setNewVehicle] = useState({
    can_ho_dang_o: "",
    bien_so: "",
    loai_xe: "M",
    dang_hoat_dong: true,
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Filters state (frontend filtering for demo, can be API based)
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await utilitiesService.getVehicles();
      const formattedData = data.map((item) => {
        const typeMap = {
          C: "Ô tô",
          M: "Xe máy",
          B: "Xe đạp",
          O: "Khác",
        };

        return {
          id: item.ma_xe,
          bien_so: item.bien_so || "Không có",
          loai_xe: typeMap[item.loai_xe] || "Khác",
          ma_can_ho: item.ma_can_ho || "N/A",
          ngay_dang_ky: item.ngay_dang_ky,
          status: item.dang_hoat_dong ? "Đang sử dụng" : "Ngừng hoạt động",
          _raw: item, // keep raw data for filtering references if needed
        };
      });
      setVehicles(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phương tiện:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApartments = async () => {
    try {
      const data = await apartmentsService.getApartments();
      setApartments(data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách căn hộ:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchApartments();
  }, []);

  const handleOpenCreate = () => {
    setOpenCreate(true);
    setErrors({});
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setErrors({});
    setNewVehicle({
      can_ho_dang_o: "",
      bien_so: "",
      loai_xe: "M",
      dang_hoat_dong: true,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate can_ho
    if (!newVehicle.can_ho_dang_o) {
      newErrors.can_ho_dang_o = "Mã căn hộ không được để trống";
    }

    // Validate loai_xe (Ô tô hoặc Xe máy phải có biển số)
    if (["C", "M"].includes(newVehicle.loai_xe)) {
      if (!newVehicle.bien_so) {
        newErrors.bien_so = `Biển số bắt buộc cho ${
          newVehicle.loai_xe === "C" ? "Ô tô" : "Xe máy"
        }`;
      } else if (!/^\d{2}[A-Z]-\d{4,5}$/.test(newVehicle.bien_so)) {
        newErrors.bien_so = "Biển số không hợp lệ (VD: 59A-12345)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateVehicle = async () => {
    if (!validateForm()) {
      return;
    }

    setLoadingSubmit(true);
    try {
      const dataToSend = {
        can_ho: newVehicle.can_ho_dang_o
          ? parseInt(newVehicle.can_ho_dang_o)
          : null,
        bien_so: newVehicle.bien_so || null,
        loai_xe: newVehicle.loai_xe,
        dang_hoat_dong: newVehicle.dang_hoat_dong,
      };

      await utilitiesService.createVehicle(dataToSend);
      handleCloseCreate();
      await fetchVehicles();
      alert("Thêm phương tiện thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm phương tiện:", error);
      if (error.response?.data) {
        const serverErrors = error.response.data;
        if (typeof serverErrors === "object") {
          const formattedErrors = {};
          Object.entries(serverErrors).forEach(([field, messages]) => {
            formattedErrors[field] = Array.isArray(messages)
              ? messages[0]
              : messages;
          });
          setErrors(formattedErrors);
        } else {
          alert("Lỗi: " + serverErrors);
        }
      } else {
        alert("Lỗi: " + error.message);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteVehicle = async (vehicle) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa phương tiện biển số "${vehicle.bien_so}"?`
      )
    ) {
      return;
    }

    try {
      await utilitiesService.deleteVehicle(vehicle.id);
      alert("Xóa phương tiện thành công!");
      await fetchVehicles();
    } catch (error) {
      console.error("Lỗi khi xóa phương tiện:", error);
      alert(
        error.response?.data?.detail ||
          "Không thể xóa phương tiện. Vui lòng thử lại."
      );
    }
  };

  // Filter logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Search Text: Match bien_so or ma_can_ho
      const matchText =
        v.bien_so.toLowerCase().includes(searchText.toLowerCase()) ||
        v.ma_can_ho.toLowerCase().includes(searchText.toLowerCase());

      // Filter Type
      const matchType = filterType === "all" || v.loai_xe === filterType;

      return matchText && matchType;
    });
  }, [vehicles, searchText, filterType]);

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

  // Statistics Logic
  const stats = useMemo(() => {
    const total = vehicles.length;
    const cars = vehicles.filter((v) => v.loai_xe === "Ô tô").length;
    const motorbikes = vehicles.filter((v) => v.loai_xe === "Xe máy").length;
    const others = total - cars - motorbikes;
    return { total, cars, motorbikes, others };
  }, [vehicles]);

  return (
    <>
      {/* Stat Cards Row */}
      <div
        className="stats-grid"
        style={{
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        <StatCard
          title="Tổng Phương tiện"
          value={stats.total}
          icon={<DirectionsCarIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-blue)"
        />
        <StatCard
          title="Ô tô"
          value={stats.cars}
          icon={<DirectionsCarIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-green)"
        />
        <StatCard
          title="Xe máy"
          value={stats.motorbikes}
          icon={<TwoWheelerIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-yellow)"
        />
        <StatCard
          title="Xe đạp/Khác"
          value={stats.others}
          icon={<PedalBikeIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-red)"
        />
      </div>

      <div className="dashboard-grid">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            backgroundColor: "white",
            borderRadius: "12px 12px 0 0",
            border: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {" "}
            {/* Adjusted gap */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm theo biển số, căn hộ..."
              sx={{ width: 600 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "var(--blue)",
              height: 40,
              marginLeft: "10px",
              width: "150px",
            }}
            onClick={handleOpenCreate}
          >
            Thêm Xe
          </Button>
        </Box>
      </div>

      <Paper
        sx={{
          height: containerHeight,
          borderRadius: "0 0 12px 12px",
          transition: "height 0.2s ease",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredVehicles}
          getRowId={(row) => row.id}
          columns={makeColumns(handleDeleteVehicle)}
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

      {/* Dialog Thêm Phương tiện */}
      <Dialog
        open={openCreate}
        onClose={handleCloseCreate}
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
              <DirectionsCarIcon sx={{ fontSize: 30 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                Thêm Phương tiện mới
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={handleCloseCreate}
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
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth error={!!errors.can_ho_dang_o} required>
              <InputLabel>Căn hộ</InputLabel>
              <Select
                value={newVehicle.can_ho_dang_o}
                label="Căn hộ"
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    can_ho_dang_o: e.target.value,
                  })
                }
              >
                <MenuItem value="">Chọn căn hộ</MenuItem>
                {apartments.map((apt) => (
                  <MenuItem key={apt.ma_can_ho} value={apt.ma_can_ho}>
                    Căn hộ {apt.ma_can_ho}
                  </MenuItem>
                ))}
              </Select>
              {errors.can_ho_dang_o && (
                <FormHelperText>{errors.can_ho_dang_o}</FormHelperText>
              )}
            </FormControl>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Loại xe</InputLabel>
                <Select
                  value={newVehicle.loai_xe}
                  label="Loại xe"
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, loai_xe: e.target.value })
                  }
                >
                  <MenuItem value="C">Ô tô</MenuItem>
                  <MenuItem value="M">Xe máy</MenuItem>
                  <MenuItem value="B">Xe đạp</MenuItem>
                  <MenuItem value="O">Khác</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={newVehicle.dang_hoat_dong}
                  label="Trạng thái"
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      dang_hoat_dong: e.target.value,
                    })
                  }
                >
                  <MenuItem value={true}>Đang sử dụng</MenuItem>
                  <MenuItem value={false}>Ngừng hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {["C", "M"].includes(newVehicle.loai_xe) && (
              <TextField
                fullWidth
                label="Biển số xe"
                placeholder="VD: 59A-12345.89"
                value={newVehicle.bien_so}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, bien_so: e.target.value })
                }
                error={!!errors.bien_so}
                helperText={errors.bien_so}
                required
              />
            )}

            {!["C", "M"].includes(newVehicle.loai_xe) && (
              <TextField
                fullWidth
                label="Biển số xe (tùy chọn)"
                placeholder="VD: 59A-12345.89 hoặc để trống"
                value={newVehicle.bien_so}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, bien_so: e.target.value })
                }
              />
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseCreate} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleCreateVehicle}
            variant="contained"
            disabled={loadingSubmit}
            sx={{ backgroundColor: "var(--blue)" }}
          >
            {loadingSubmit ? "Đang xử lý..." : "Thêm Phương tiện"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
