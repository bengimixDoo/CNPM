import { useState, useRef, useEffect } from "react";
import { residentsService } from "../api/services";
import StatCard from "../components/StatCard.jsx";
import "../styles/AdminDashboard.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupsIcon from "@mui/icons-material/Groups";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ApartmentIcon from "@mui/icons-material/Apartment";

export default function Apartments() {
  const statusColors = {
    Trống: "var(--color-yellow-100)",
    "Đã bán": "var(--color-green-100)",
    "Đang thuê": "var(--color-green-100)",
  };

  const [apartmentsData, setApartmentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    occupied: 0,
    empty: 0,
    fixing: 0,
  });

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const data = await residentsService.getApartments();
      const formattedData = data.map((apt) => {
        const statusMap = { E: "Trống", S: "Đã bán", H: "Đang thuê" };
        return {
          id: apt.ma_can_ho,
          building: apt.toa_nha,
          floor: apt.tang,
          owner:
            apt.danh_sach_cu_dan?.find((r) => r.la_chu_ho)?.ho_ten ||
            apt.chu_so_huu_info?.ho_ten ||
            "Chưa có",
          residents: apt.danh_sach_cu_dan ? apt.danh_sach_cu_dan.length : 0,
          area: `${apt.dien_tich} m²`,
          status: statusMap[apt.trang_thai] || apt.trang_thai,
          phone: "N/A",
          email: "N/A",
          note: "",
          residentsList: (apt.danh_sach_cu_dan || []).map((r) => ({
            name: r.ho_ten,
            dob: r.ngay_sinh
              ? new Date(r.ngay_sinh).toLocaleDateString("vi-VN")
              : "N/A",
            relation: r.la_chu_ho
              ? "Chủ hộ"
              : r.trang_thai_cu_tru === "TT"
              ? "Tạm trú"
              : r.trang_thai_cu_tru === "TH"
              ? "Thường trú"
              : r.trang_thai_cu_tru === "TV"
              ? "Tạm vắng"
              : "Thành viên",
            phone: r.so_dien_thoai || "N/A",
            // Keep raw fields if needed for finding owner logic later
            la_chu_ho: r.la_chu_ho,
            so_dien_thoai: r.so_dien_thoai,
            ho_ten: r.ho_ten,
          })),
        };
      });
      setApartmentsData(formattedData);

      // Gọi thống kê tổng quan từ API
      try {
        const statsApi = await residentsService.getApartmentStats();
        const total =
          statsApi?.tong_quan?.tong_so_can_ho || formattedData.length;
        const empty = statsApi?.tong_quan?.so_can_trong_E || 0;
        const sold = statsApi?.tong_quan?.so_da_ban_S || 0;
        const rented = statsApi?.tong_quan?.so_dang_thue_H || 0;
        setStats({ total, empty, occupied: sold + rented, fixing: 0 });
      } catch (_) {
        // fallback nếu thống kê lỗi
        const byCode = (code) =>
          data.filter((a) => a.trang_thai === code).length;
        setStats({
          total: data.length,
          empty: byCode("E"),
          occupied: byCode("S") + byCode("H"),
          fixing: 0,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách căn hộ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // State cho dialog thêm căn hộ
  const [openCreate, setOpenCreate] = useState(false);
  const [newApartment, setNewApartment] = useState({
    ma_can_ho: "",
    toa_nha: "A",
    tang: "",
    phong: "",
    dien_tich: "",
    trang_thai: "E",
  });
  const gridRef = useRef(null);

  // Tính toán dữ liệu hiển thị theo trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApartments = apartmentsData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(apartmentsData.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll đến vị trí đầu grid với offset
    if (gridRef.current) {
      const yOffset = -20; // Offset 20px từ top
      const y =
        gridRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleOpenDetail = (apt) => {
    setSelected(apt);
    setOpenDetail(true);

    const danhSach = apt.residentsList || [];
    const ownerObj = danhSach.find((r) => r.la_chu_ho === true);

    setSelected((prev) => ({
      ...prev,
      owner: ownerObj ? ownerObj.name : prev.owner || "Chưa có",
      phone: ownerObj
        ? ownerObj.phone
        : prev.phone !== "N/A"
        ? prev.phone
        : "N/A",
      // residents và residentsList đã có trong apt được set vào selected ở dòng đầu
    }));
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleDeleteApartment = async () => {
    if (!selected) return;

    if (!confirm(`Bạn có chắc chắn muốn xóa căn hộ ${selected.id}?`)) {
      return;
    }

    try {
      await residentsService.deleteApartment(selected.id);
      alert("Xóa căn hộ thành công!");
      setOpenDetail(false);
      fetchApartments(); // Reload list
    } catch (error) {
      console.error("Lỗi khi xóa căn hộ:", error);
      alert(
        error.response?.data?.detail ||
          "Không thể xóa căn hộ. Có thể căn hộ đang có cư dân hoặc hóa đơn."
      );
    }
  };

  const handleEditApartment = () => {
    alert("Chức năng chỉnh sửa thông tin đang được phát triển");
  };

  const handleAddResident = () => {
    alert("Chức năng thêm nhân khẩu đang được phát triển");
  };

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setNewApartment({
      ma_can_ho: "",
      toa_nha: "A",
      tang: "",
      phong: "",
      dien_tich: "",
      trang_thai: "E",
    });
  };

  const handleCreateApartment = async () => {
    try {
      await residentsService.createApartment(newApartment);
      alert("Thêm căn hộ thành công!");
      handleCloseCreate();
      fetchApartments(); // Refresh list
    } catch (error) {
      console.error("Lỗi khi thêm căn hộ:", error);
      alert(
        "Lỗi khi thêm căn hộ: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <>
      <div className="stats-row">
        <StatCard
          title="Tổng số căn hộ"
          value={stats.total}
          colorBackground="var(--background-blue)"
          typeCard="Home"
        />
        <StatCard
          title="Đang ở"
          value={stats.occupied}
          colorBackground="var(--background-green)"
          typeCard="Done"
        />
        <StatCard
          title="Trống"
          value={stats.empty}
          colorBackground="var(--background-yellow)"
          typeCard="Empty"
        />
        <StatCard
          title="Đang sửa chữa"
          value={stats.fixing}
          colorBackground="var(--background-red)"
          typeCard="Fix"
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
          onClick={handleOpenCreate}
          sx={{
            backgroundColor: "var(--blue)",
            height: 40,
            marginLeft: "10px",
          }}
        >
          Thêm Căn hộ
        </Button>
      </Box>

      <div
        ref={gridRef}
        className="apartment-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
          minHeight: "600px",
          alignContent: "start",
        }}
      >
        {currentApartments.map((apt) => (
          <div className="apartment-card" key={apt.id}>
            <div className="header-section">
              <div className="header-info">
                <h3 className="text-lg font-bold">Căn hộ {apt.id}</h3>
                <p className="text-sm">
                  Tòa {apt.building}, Tầng {apt.floor}
                </p>
              </div>
              <span
                className="status-tag"
                style={{ backgroundColor: statusColors[apt.status] || "#ddd" }}
              >
                {apt.status}
              </span>
            </div>

            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">Chủ hộ:</span>
                <span className="detail-value">{apt.owner}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số nhân khẩu:</span>
                <span className="detail-value">{apt.residents}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Diện tích:</span>
                <span className="detail-value">{apt.area}</span>
              </div>
            </div>

            <div className="action-section">
              <button
                className="action-button action-button-main"
                onClick={() => handleOpenDetail(apt)}
              >
                Xem Chi tiết
              </button>
              <button className="action-button" aria-label="More actions">
                <MoreVertIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          marginBottom: "20px",
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
          color="primary"
          size="small"
          showFirstButton
          showLastButton
        />
      </Box>

      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
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
        {selected && (
          <>
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
                  <ApartmentIcon sx={{ fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, lineHeight: 1.2 }}
                  >
                    Căn hộ {selected.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tòa {selected.building} • Tầng {selected.floor}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  onClick={handleCloseDetail}
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

            <DialogContent
              sx={{
                backgroundColor: "#f8fafc",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* Thông tin chung */}
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: "#1e293b" }}
                  >
                    Thông tin cơ bản
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: "1px",
                      backgroundColor: "#e2e8f0",
                      ml: 1,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                  }}
                >
                  {[
                    {
                      label: "Chủ hộ",
                      value: selected.owner,
                      icon: <PersonIcon sx={{ fontSize: 20 }} />,
                      color: "#3b82f6",
                    },
                    {
                      label: "Số điện thoại",
                      value: selected.phone,
                      icon: <PhoneIcon sx={{ fontSize: 20 }} />,
                      color: "#10b981",
                    },
                    {
                      label: "Email",
                      value: selected.email,
                      icon: <EmailIcon sx={{ fontSize: 20 }} />,
                      color: "#6366f1",
                    },
                    {
                      label: "Diện tích",
                      value: selected.area,
                      icon: <SquareFootIcon sx={{ fontSize: 20 }} />,
                      color: "#f59e0b",
                    },
                    {
                      label: "Vị trí",
                      value: `Tòa ${selected.building} - Tầng ${selected.floor}`,
                      icon: <BusinessIcon sx={{ fontSize: 20 }} />,
                      color: "#ec4899",
                    },
                    {
                      label: "Ghi chú",
                      value: selected.note,
                      icon: <DescriptionIcon sx={{ fontSize: 20 }} />,
                      color: "#64748b",
                    },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        backgroundColor: "white",
                        p: 2,
                        borderRadius: "12px",
                        border: "1px solid #f1f5f9",
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Box sx={{ color: item.color, display: "flex" }}>
                          {item.icon}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.025em",
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b", pl: 3.5 }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Danh sách cư dân */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "#1e293b" }}
                    >
                      Thành viên trong hộ ({selected.residents})
                    </Typography>
                    <GroupsIcon sx={{ color: "#64748b", fontSize: 20 }} />
                  </Box>
                  <Button
                    startIcon={<AddIcon />}
                    size="small"
                    variant="contained"
                    onClick={handleAddResident}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      backgroundColor: "var(--blue)",
                      width: "150px",
                      boxShadow: "none",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0, 119, 255, 0.2)",
                      },
                    }}
                  >
                    Thêm nhân khẩu
                  </Button>
                </Box>

                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #f1f5f9",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1.5fr 1.5fr 1.5fr",
                      backgroundColor: "#f8fafc",
                      borderBottom: "2px solid #f1f5f9",
                      p: 2,
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <Box>Họ và Tên</Box>
                    <Box>Ngày sinh</Box>
                    <Box>Quan hệ</Box>
                    <Box>Số điện thoại</Box>
                  </Box>
                  {selected.residentsList &&
                  selected.residentsList.length > 0 ? (
                    selected.residentsList.map((resident, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1.5fr 1.5fr 1.5fr",
                          p: 2,
                          borderBottom:
                            idx < selected.residentsList.length - 1
                              ? "1px solid #f1f5f9"
                              : "none",
                          fontSize: "0.875rem",
                          color: "#1e293b",
                          transition: "background-color 0.2s",
                          "&:hover": { backgroundColor: "#fbfcfd" },
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              backgroundColor: "#eff6ff",
                              color: "#3b82f6",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            {resident.name.split(" ").pop().charAt(0)}
                          </Box>
                          {resident.name}
                        </Box>
                        <Box color="#64748b">{resident.dob}</Box>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              px: 1.5,
                              py: 0.25,
                              borderRadius: "6px",
                              backgroundColor:
                                resident.relation === "Chủ hộ"
                                  ? "#8ffd00ff"
                                  : "#f1f5f9",
                              color: "#475569",
                              fontWeight: 600,
                            }}
                          >
                            {resident.relation}
                          </Typography>
                        </Box>
                        <Box color="#64748b">{resident.phone}</Box>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ p: 6, textAlign: "center", color: "#94a3b8" }}>
                      <GroupsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.2 }} />
                      <Typography variant="body2">
                        Chưa có dữ liệu về cư dân trong hộ này.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>

            <DialogActions
              sx={{
                padding: "10px",
                borderTop: "1px solid #f1f5f9",
                justifyContent: "space-between",
                backgroundColor: "#ffffff",
              }}
            >
              <Button
                onClick={handleDeleteApartment}
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  width: "150px",
                  "&:hover": { backgroundColor: "#fef2f2" },
                }}
              >
                Xóa căn hộ
              </Button>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={handleEditApartment}
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                    width: "150px",
                    px: 3,
                    py: 1,
                    backgroundColor: "var(--blue)",
                    boxShadow: "0 4px 14px rgba(0, 119, 255, 0.3)",
                    "&:hover": {
                      backgroundColor: "#0066dd",
                      boxShadow: "0 6px 20px rgba(0, 119, 255, 0.4)",
                    },
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog Thêm Căn hộ - UI Cải tiến */}
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
              <ApartmentIcon sx={{ fontSize: 30 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                Thêm Căn hộ mới
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={handleCloseDetail}
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
        <DialogContent sx={{ p: 3, pt: "24px !important" }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <Box>
              <TextField
                fullWidth
                label="Mã căn hộ"
                placeholder="VD: CH101"
                value={newApartment.ma_can_ho}
                onChange={(e) =>
                  setNewApartment({
                    ...newApartment,
                    ma_can_ho: e.target.value,
                  })
                }
                required
                InputProps={{
                  sx: { borderRadius: "10px" },
                }}
              />
            </Box>

            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Tòa nhà</InputLabel>
                <Select
                  value={newApartment.toa_nha}
                  label="Tòa nhà"
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      toa_nha: e.target.value,
                    })
                  }
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="A">Tòa A</MenuItem>
                  <MenuItem value="B">Tòa B</MenuItem>
                  <MenuItem value="C">Tòa C</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Tầng"
                type="number"
                value={newApartment.tang}
                onChange={(e) =>
                  setNewApartment({ ...newApartment, tang: e.target.value })
                }
                required
                InputProps={{
                  sx: { borderRadius: "10px" },
                }}
              />
            </Box>

            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Số phòng"
                value={newApartment.phong}
                onChange={(e) =>
                  setNewApartment({ ...newApartment, phong: e.target.value })
                }
                placeholder="VD: 101"
                InputProps={{
                  sx: { borderRadius: "10px" },
                }}
              />

              <TextField
                fullWidth
                label="Diện tích"
                type="number"
                value={newApartment.dien_tich}
                onChange={(e) =>
                  setNewApartment({
                    ...newApartment,
                    dien_tich: e.target.value,
                  })
                }
                required
                InputProps={{
                  endAdornment: (
                    <Typography variant="caption" color="text.secondary">
                      m²
                    </Typography>
                  ),
                  sx: { borderRadius: "10px" },
                }}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={newApartment.trang_thai}
                label="Trạng thái"
                onChange={(e) =>
                  setNewApartment({
                    ...newApartment,
                    trang_thai: e.target.value,
                  })
                }
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value="E">Trống</MenuItem>
                <MenuItem value="S">Đã bán</MenuItem>
                <MenuItem value="H">Đang thuê</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseCreate}
            variant="outlined"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleCreateApartment}
            variant="contained"
            disabled={
              !newApartment.ma_can_ho ||
              !newApartment.tang ||
              !newApartment.dien_tich
            }
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "var(--blue)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              px: 3,
              "&:hover": { backgroundColor: "#1e40af" },
            }}
          >
            Thêm Căn hộ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
