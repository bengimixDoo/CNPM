import "../styles/AdminDashboard.css";
import StatCard from "../components/StatCard";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import FilterListIcon from "@mui/icons-material/FilterList";
import Dialog from "@mui/material/Dialog";
import HomeIcon from '@mui/icons-material/Home';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HistoryIcon from "@mui/icons-material/History";
import PeopleIcon from "@mui/icons-material/People";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import { useState, useMemo, useEffect } from "react";
import { residentsService, apartmentsService } from "../api/services";
import Typography from "@mui/material/Typography";

const defaultPaginationModel = { page: 0, pageSize: 10 };

const makeColumns = () => [
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
    headerName: "Trạng thái",
    width: 100,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const statusColors = {
        "Đang cư trú": {
          bg: "var(--color-green-100)",
          text: "var(--color-green-800)",
        },
        "Đã chuyển đi": { bg: "#fee2e2", text: "#dc2626" },
        "Tạm vắng": { bg: "#fef3c7", text: "#d97706" },
      };
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
  const [apartments, setApartments] = useState([]);
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
  const [openEdit, setOpenEdit] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [editResident, setEditResident] = useState({
    ho_ten: "",
    gioi_tinh: "M",
    ngay_sinh: "",
    so_cccd: "",
    so_dien_thoai: "",
    can_ho_dang_o: "",
    la_chu_ho: false,
    trang_thai_cu_tru: "TH",
  });
  const [activeTab, setActiveTab] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const data = await residentsService.getResidents();
      // Ánh xạ dữ liệu từ API về định dạng của DataGrid
      const formattedData = data.map((item) => {
        const statusMap = {
          TH: "Đang cư trú", // Thường trú
          TT: "Tạm trú", // Tạm trú
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

  const fetchApartments = async () => {
    try {
      const data = await apartmentsService.getApartments();
      setApartments(data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách căn hộ:", error);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      console.log("Fetching history data...");
      const data = await residentsService.getHistory();
      console.log("History data received:", data);
      // Sort by ngay_thuc_hien descending (mới nhất lên đầu)
      const sorted = (data || []).sort(
        (a, b) => new Date(b.ngay_thuc_hien) - new Date(a.ngay_thuc_hien)
      );
      console.log("Sorted history:", sorted.length, "records");
      setHistoryData(sorted);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử biến động:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // 3. Effects
  useEffect(() => {
    fetchResidents();
    fetchApartments();
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      fetchHistory();
    }
  }, [activeTab]);

  // 4. form Handlers
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

  const validateForm = (data = newResident) => {
    const newErrors = {};

    if (!data.ho_ten || data.ho_ten.trim() === "") {
      newErrors.ho_ten = "Họ và tên không được để trống";
    } else if (data.ho_ten.length < 3) {
      newErrors.ho_ten = "Họ và tên phải có ít nhất 3 ký tự";
    }

    if (!data.ngay_sinh) {
      newErrors.ngay_sinh = "Ngày sinh không được để trống";
    } else {
      const birthDate = new Date(data.ngay_sinh);
      const today = new Date();
      if (birthDate > today) {
        newErrors.ngay_sinh = "Ngày sinh không hợp lệ (vượt quá ngày hiện tại)";
      }
    }

    if (!data.so_cccd) {
      newErrors.so_cccd = "Số CCCD không được để trống";
    } else if (!/^\d{12}$/.test(data.so_cccd)) {
      newErrors.so_cccd = "Số CCCD phải có đúng 12 chữ số";
    }

    if (!data.so_dien_thoai) {
      newErrors.so_dien_thoai = "Số điện thoại không được để trống";
    } else if (!/^\d+$/.test(data.so_dien_thoai)) {
      newErrors.so_dien_thoai = "Số điện thoại chỉ được chứa các chữ số";
    } else if (data.so_dien_thoai.length < 10) {
      newErrors.so_dien_thoai = "Số điện thoại phải có ít nhất 10 chữ số";
    }

    // Kiểm tra căn hộ dựa trên trạng thái
    if (data.trang_thai_cu_tru) {
      if (["TH", "TT", "TV"].includes(data.trang_thai_cu_tru)) {
        // Nếu TH/TT/TV thì BẮT BUỘC phải có căn hộ
        if (!data.can_ho_dang_o || data.can_ho_dang_o === "") {
          newErrors.can_ho_dang_o =
            "Cư dân ở trạng thái này bắt buộc phải chọn căn hộ";
        }
      }
      // Bỏ kiểm tra OUT vì submit sẽ force null anyway
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
      // Nếu trạng thái là OUT, can_ho_dang_o = null
      // Nếu trạng thái TH, TT thì can_ho_dang_o BẮT BUỘC phải có
      let can_ho = null;
      if (newResident.trang_thai_cu_tru === "OUT") {
        can_ho = null;
      } else if (newResident.can_ho_dang_o) {
        can_ho = parseInt(newResident.can_ho_dang_o);
      }

      const dataToSend = {
        ho_ten: newResident.ho_ten,
        gioi_tinh: newResident.gioi_tinh,
        ngay_sinh: newResident.ngay_sinh,
        so_cccd: newResident.so_cccd,
        so_dien_thoai: newResident.so_dien_thoai,
        la_chu_ho: newResident.la_chu_ho,
        trang_thai_cu_tru: newResident.trang_thai_cu_tru,
        can_ho_dang_o: can_ho,
      };

      await residentsService.createResident(dataToSend);
      handleCloseCreate();
      await fetchResidents();
      await fetchHistory(); // Refresh history
      alert("Thêm cư dân thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm cư dân:", error);
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
          alert("Thêm cư dân thất bại: " + serverErrors);
        }
      } else {
        alert("Lỗi: " + error.message);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleEditResident = (resident) => {
    setEditingResident(resident);
    // Map từ display data trở lại dữ liệu thật
    const statusReverseMap = {
      "Đang cư trú": "TH",
      "Tạm trú": "TT",
      "Tạm vắng": "TV",
      "Đã chuyển đi": "OUT",
    };
    setEditResident({
      ho_ten: resident.name,
      gioi_tinh: resident.sex === "Nam" ? "M" : "F",
      ngay_sinh: resident.birth,
      so_cccd: resident.cccd,
      so_dien_thoai: resident.sdt,
      can_ho_dang_o:
        resident.id_apartment === "Chưa có" ? "" : resident.id_apartment,
      la_chu_ho: resident.relationship === "Chủ hộ",
      trang_thai_cu_tru: statusReverseMap[resident.status] || "TH",
    });
    setOpenEdit(true);
    setErrors({});
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditingResident(null);
    setErrors({});
    setEditResident({
      ho_ten: "",
      gioi_tinh: "M",
      ngay_sinh: "",
      so_cccd: "",
      so_dien_thoai: "",
      can_ho_dang_o: "",
      la_chu_ho: false,
      trang_thai_cu_tru: "TH",
    });
  };

  const handleSaveEdit = async () => {
    if (!validateForm(editResident)) {
      return;
    }

    setLoadingSubmit(true);
    try {
      // Logic xác định can_ho_dang_o
      let can_ho = null;

      if (editResident.trang_thai_cu_tru === "OUT") {
        // Nếu OUT thì CHẮC CHẮN là null, bất kể state hiện tại
        can_ho = null;
      } else {
        // Nếu không phải OUT, lấy giá trị từ state (phải có validation pass)
        can_ho = editResident.can_ho_dang_o
          ? parseInt(editResident.can_ho_dang_o)
          : null;
      }

      const dataToSend = {
        ho_ten: editResident.ho_ten,
        gioi_tinh: editResident.gioi_tinh,
        ngay_sinh: editResident.ngay_sinh,
        so_cccd: editResident.so_cccd,
        so_dien_thoai: editResident.so_dien_thoai,
        la_chu_ho: editResident.la_chu_ho,
        trang_thai_cu_tru: editResident.trang_thai_cu_tru,
        can_ho_dang_o: can_ho,
      };

      console.log("=== DEBUG UPDATE RESIDENT ===");
      console.log("editResident state:", editResident);
      console.log("Data gửi lên:", JSON.stringify(dataToSend, null, 2));
      console.log("Resident ID:", editingResident.id);
      console.log("Detail fields:");
      console.log(
        "  - trang_thai_cu_tru:",
        dataToSend.trang_thai_cu_tru,
        typeof dataToSend.trang_thai_cu_tru
      );
      console.log(
        "  - can_ho_dang_o:",
        dataToSend.can_ho_dang_o,
        typeof dataToSend.can_ho_dang_o
      );
      console.log(
        "  - la_chu_ho:",
        dataToSend.la_chu_ho,
        typeof dataToSend.la_chu_ho
      );

      await residentsService.updateResident(editingResident.id, dataToSend);
      handleCloseEdit();
      await fetchResidents();
      await fetchHistory(); // Refresh history
      alert("Cập nhật cư dân thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật cư dân:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

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
          // Hiển thị lỗi chi tiết
          const errorMessages = Object.entries(formattedErrors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join("\n");
          alert(`Lỗi validation:\n${errorMessages}`);
        } else {
          alert("Cập nhật cư dân thất bại: " + serverErrors);
        }
      } else {
        alert("Lỗi: " + error.message);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteResident = async (resident) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa cư dân "${resident.name}"?`)) {
      return;
    }

    try {
      await residentsService.deleteResident(resident.id);
      alert("Xóa cư dân thành công!");
      await fetchResidents();
      await fetchHistory(); // Refresh history
    } catch (error) {
      console.error("Lỗi khi xóa cư dân:", error);
      alert(
        error.response?.data?.detail ||
          "Không thể xóa cư dân. Vui lòng thử lại."
      );
    }
  };

  const rows = useMemo(() => residents, [residents]);

  const stats = useMemo(() => {
    const total = residents.length;
    const present = residents.filter(
      (r) => r.status === "Đang cư trú" || r.status === "Tạm trú"
    ).length;
    const absent = residents.filter((r) => r.status === "Tạm vắng").length;
    const apartments = new Set(residents.map((r) => r.id_apartment)).size;
    return { total, present, absent, apartments };
  }, [residents]);

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

  // 6. Return JSX

  return (
    <>
      {/* Stat Cards */}
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
          title="Tổng Cư dân"
          value={stats.total}
          icon={<PeopleIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-blue)"
          trend="+5% tháng này"
        />
        <StatCard
          title="Đang ở"
          value={stats.present}
          icon={<PeopleIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-green)"
        />
        <StatCard
          title="Tạm vắng"
          value={stats.absent}
          icon={<GroupRemoveIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-yellow)"
        />
        <StatCard
          title="Số Hộ dân"
          value={stats.apartments}
          icon={<HomeIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-red)"
        />
      </div>

      <div className="dashboard-grid" style={{ width: "700px" }}>
        <Box
          sx={{
            borderRadius: "12px 12px 0 0",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            sx={{
              borderRadius: "12px 12px 0 0",
              "& .MuiTabs-indicator": {
                backgroundColor: "var(--blue)",
                height: 3,
                borderRadius: "12px 12px 0 0",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minHeight: "56px",
                width: "50%",
                opacity: 0.3, // Mờ hẳn đi
                backgroundColor: "transparent", // Không giữ nền
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  opacity: 1,
                  fontWeight: 700,
                  color: "var(--blue)",
                  borderRadius: "12px 12px 0 0",
                  backgroundColor: "white", // Nền nhẹ cho tab đang chọn (tùy chọn)
                },
                "&:hover": {
                  opacity: 0.7,
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                },
              },
            }}
          >
            <Tab
              icon={<PeopleIcon />}
              iconPosition="start"
              label="Quản lý Cư dân"
            />
            <Tab
              icon={<HistoryIcon />}
              iconPosition="start"
              label="Lịch sử Biến động"
            />
          </Tabs>
          {/* Tab Content */}
        </Box>
      </div>
      {activeTab === 0 && (
        <>
          {/* Tab Quản lý Cư dân - Code hiện tại */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              backgroundColor: "white",
              borderBottom: "none",
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
                  width: "160px",
                }}
                onClick={handleOpenCreate}
              >
                Thêm Cư dân
              </Button>
            </Box>
          </Box>

          <Paper
            sx={{
              height: containerHeight,
              borderRadius: "0 0 12px 12px",
              transition: "height 0.2s ease",
              overflow: "hidden",
              hover: "none",
            }}
          >
            <DataGrid
              rows={rows}
              getRowId={(row) => row._rowId}
              columns={[
                ...makeColumns(),
                {
                  field: "actions",
                  headerName: "Hành động",
                  type: "actions",
                  width: 150,
                  getActions: (params) => [
                    <GridActionsCellItem
                      icon={<EditIcon />}
                      label="Sửa"
                      onClick={() => handleEditResident(params.row)}
                      showInMenu={false}
                      sx={{
                        height: 40,
                        width: "50px",
                      }}
                    />,
                    <GridActionsCellItem
                      icon={<DeleteIcon />}
                      label="Xóa"
                      onClick={() => handleDeleteResident(params.row)}
                      showInMenu={false}
                      sx={{
                        height: 40,
                        width: "50px",
                        color: "red",
                      }}
                    />,
                  ],
                },
              ]}
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

      {activeTab === 1 && (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <DataGrid
            rows={historyData}
            getRowId={(row) => row.ma_bien_dong}
            columns={[
              {
                field: "ma_bien_dong",
                headerName: "Mã biến động",
                width: 120,
                headerAlign: "center",
                align: "center",
              },
              {
                field: "ho_ten",
                headerName: "Họ và tên",
                width: 200,
                valueGetter: (value, row) => row.cu_dan?.ho_ten || "N/A",
              },
              {
                field: "so_cccd",
                headerName: "Số CCCD",
                width: 140,
                valueGetter: (value, row) => row.cu_dan?.so_cccd || "N/A",
              },
              {
                field: "can_ho",
                headerName: "Căn hộ",
                width: 100,
                valueGetter: (value, row) => row.can_ho?.ma_can_ho || "N/A",
              },
              {
                field: "loai_bien_dong",
                headerName: "Loại biến động",
                width: 150,
                renderCell: (params) => {
                  const colors = {
                    "Thường trú": { bg: "#e8f5e9", text: "#2e7d32" },
                    "Tạm trú": { bg: "#e3f2fd", text: "#1976d2" },
                    "Tạm Vắng": { bg: "#fff3e0", text: "#f57c00" },
                    "Chuyển Đi": { bg: "#ffebee", text: "#c62828" },
                  };
                  const color = colors[params.value] || {
                    bg: "#f5f5f5",
                    text: "#616161",
                  };
                  return (
                    <span
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontWeight: "500",
                        fontSize: "13px",
                      }}
                    >
                      {params.value}
                    </span>
                  );
                },
              },
              {
                field: "ngay_thuc_hien",
                headerName: "Ngày thực hiện",
                width: 150,
                type: "date",
                valueGetter: (value) => new Date(value),
                valueFormatter: (value) => {
                  return new Date(value).toLocaleDateString("vi-VN");
                },
              },
            ]}
            loading={loadingHistory}
            pageSizeOptions={[10, 20, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #e0e0e0",
              },
            }}
          />
        </Box>
      )}

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
              <PersonAddIcon sx={{ fontSize: 30 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                Thêm Cư dân mới
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
            <TextField
              fullWidth
              label="Họ và tên"
              placeholder="VD: Nguyễn Văn A"
              value={newResident.ho_ten}
              onChange={(e) =>
                setNewResident({ ...newResident, ho_ten: e.target.value })
              }
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
                  onChange={(e) =>
                    setNewResident({
                      ...newResident,
                      gioi_tinh: e.target.value,
                    })
                  }
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
                onChange={(e) =>
                  setNewResident({ ...newResident, ngay_sinh: e.target.value })
                }
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
                onChange={(e) =>
                  setNewResident({ ...newResident, so_cccd: e.target.value })
                }
                error={!!errors.so_cccd}
                helperText={errors.so_cccd}
                required
              />

              <TextField
                fullWidth
                label="Số điện thoại"
                placeholder="VD: 0912345678"
                value={newResident.so_dien_thoai}
                onChange={(e) =>
                  setNewResident({
                    ...newResident,
                    so_dien_thoai: e.target.value,
                  })
                }
                error={!!errors.so_dien_thoai}
                helperText={errors.so_dien_thoai}
                required
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl
                fullWidth
                error={!!errors.can_ho_dang_o}
                required={newResident.trang_thai_cu_tru !== "OUT"}
              >
                <InputLabel>
                  Căn hộ {newResident.trang_thai_cu_tru !== "OUT" && "*"}
                </InputLabel>
                <Select
                  value={newResident.can_ho_dang_o}
                  label="Căn hộ"
                  disabled={newResident.trang_thai_cu_tru === "OUT"}
                  onChange={(e) =>
                    setNewResident({
                      ...newResident,
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

              <FormControl fullWidth>
                <InputLabel>Trạng thái cư trú</InputLabel>
                <Select
                  value={newResident.trang_thai_cu_tru}
                  label="Trạng thái cư trú"
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setNewResident({
                      ...newResident,
                      trang_thai_cu_tru: newStatus,
                      // Nếu chọn OUT, tự động xóa căn hộ
                      can_ho_dang_o:
                        newStatus === "OUT" ? "" : newResident.can_ho_dang_o,
                    });
                  }}
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
                onChange={(e) =>
                  setNewResident({ ...newResident, la_chu_ho: e.target.value })
                }
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

      {/* Dialog Chỉnh Sửa Cư dân */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
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
            <EditIcon />
            Chỉnh sửa Thông tin Cư dân
          </Box>
          <IconButton onClick={handleCloseEdit} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Họ và tên"
              placeholder="VD: Nguyễn Văn A"
              value={editResident.ho_ten}
              onChange={(e) =>
                setEditResident({ ...editResident, ho_ten: e.target.value })
              }
              error={!!errors.ho_ten}
              helperText={errors.ho_ten}
              required
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={editResident.gioi_tinh}
                  label="Giới tính"
                  onChange={(e) =>
                    setEditResident({
                      ...editResident,
                      gioi_tinh: e.target.value,
                    })
                  }
                >
                  <MenuItem value="M">Nam</MenuItem>
                  <MenuItem value="F">Nữ</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Ngày sinh"
                type="date"
                value={editResident.ngay_sinh}
                onChange={(e) =>
                  setEditResident({
                    ...editResident,
                    ngay_sinh: e.target.value,
                  })
                }
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
                value={editResident.so_cccd}
                onChange={(e) =>
                  setEditResident({ ...editResident, so_cccd: e.target.value })
                }
                error={!!errors.so_cccd}
                helperText={errors.so_cccd}
                required
              />

              <TextField
                fullWidth
                label="Số điện thoại"
                placeholder="VD: 0912345678"
                value={editResident.so_dien_thoai}
                onChange={(e) =>
                  setEditResident({
                    ...editResident,
                    so_dien_thoai: e.target.value,
                  })
                }
                error={!!errors.so_dien_thoai}
                helperText={errors.so_dien_thoai}
                required
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl
                fullWidth
                error={!!errors.can_ho_dang_o}
                required={editResident.trang_thai_cu_tru !== "OUT"}
              >
                <InputLabel>
                  Căn hộ {editResident.trang_thai_cu_tru !== "OUT" && "*"}
                </InputLabel>
                <Select
                  value={editResident.can_ho_dang_o}
                  label="Căn hộ"
                  disabled={editResident.trang_thai_cu_tru === "OUT"}
                  onChange={(e) =>
                    setEditResident({
                      ...editResident,
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

              <FormControl fullWidth>
                <InputLabel>Trạng thái cư trú</InputLabel>
                <Select
                  value={editResident.trang_thai_cu_tru}
                  label="Trạng thái cư trú"
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setEditResident({
                      ...editResident,
                      trang_thai_cu_tru: newStatus,
                      // Nếu chọn OUT, tự động xóa căn hộ
                      can_ho_dang_o:
                        newStatus === "OUT" ? "" : editResident.can_ho_dang_o,
                    });
                  }}
                >
                  <MenuItem value="TT">Tạm trú</MenuItem>
                  <MenuItem value="TH">Thường trú</MenuItem>
                  <MenuItem value="TV">Tạm vắng</MenuItem>
                  <MenuItem value="OUT">Đã chuyển đi</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Quan hệ với chủ hộ</InputLabel>
              <Select
                value={editResident.la_chu_ho}
                label="Quan hệ với chủ hộ"
                onChange={(e) =>
                  setEditResident({
                    ...editResident,
                    la_chu_ho: e.target.value,
                  })
                }
              >
                <MenuItem value={false}>Thành viên</MenuItem>
                <MenuItem value={true}>Chủ hộ</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseEdit} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={loadingSubmit}
            sx={{ backgroundColor: "var(--blue)" }}
          >
            {loadingSubmit ? "Đang xử lý..." : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
