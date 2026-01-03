import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  authService,
  residentsService,
  utilitiesService,
  financeService,
} from "../api/services";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Button,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Divider,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  alpha,
  LinearProgress,
} from "@mui/material";
import {
  Apartment,
  Notifications,
  Settings,
  Add,
  GridView,
  Payments,
  Handyman,
  ExpandMore,
  SquareFoot,
  Bed,
  BadgeOutlined,
  DirectionsCar,
  Groups,
  ArrowForward,
  Call,
  Bolt,
  SportsTennis,
  PersonAdd,
  Build,
  CalendarMonth,
  EventBusy,
  CheckCircle,
  ReceiptLong,
  WaterDrop,
  Campaign,
  Description,
  LocationOn,
  Star,
} from "@mui/icons-material";
const API_BASE = "http://localhost:8000/api";
export default function ResidentHome() {
  const navigate = useNavigate();

  // ==================== THEME COLORS & STYLES ====================
  const COLORS = {
    primary: "#137fec",
    secondary: "#2563eb",
    accent: "#4338ca",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#f43f5e",

    // Background colors
    bgLight: "#f4f6f8",
    bgCardLight: "#f8fafc",
    bgHover: "#f1f5f9",

    // Text colors
    textDark: "#1e293b",
    textSecondary: "#64748b",
    textTertiary: "#94a3b8",
    textLight: "#dbeafe",
  };

  const STYLES = {
    card: {
      borderRadius: 3,
      boxShadow:
        "0 0 0 1px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)",
    },
    paper: {
      border: `1px solid #e2e8f0`,
      borderRadius: 2,
    },
    iconBox: (bgColor, iconColor) => ({
      width: 40,
      height: 40,
      bgcolor: bgColor,
      color: iconColor,
      borderRadius: 1.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
  };

  // --- LOGIC STATES ---
  const [openRequest, setOpenRequest] = useState(false);
  const [openAddPerson, setOpenAddPerson] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [requestForm, setRequestForm] = useState({
    title: "",
    type: "SC",
    content: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utilityReadings, setUtilityReadings] = useState({
    electric: { usage: 0, old: 0, new: 0 },
    water: { usage: 0, old: 0, new: 0 },
  });

  // Data States
  const [user, setUser] = useState({});
  const [residents, setResidents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [unpaidInvoice, setUnpaidInvoice] = useState(null);
  const [aptInfo, setAptInfo] = useState({
    building: "...",
    floor: "...",
    room: "...",
    area: 0,
    bedrooms: 0,
    vehicles: 0,
    cards: 0,
  });

  // --- FETCH DATA EFFECT ---
  // --- FETCH DATA EFFECT (ĐÃ SỬA) ---
  useEffect(() => {
    const fetchData = async () => {
      // 1. KHAI BÁO BIẾN Ở ĐẦU ĐỂ DÙNG CHUNG
      const token = localStorage.getItem("auth_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let apartmentId = null;

      try {
        const me = await authService.getMe();
        console.log("User info:", me);
        setUser(me);

        // Lấy ID căn hộ
        apartmentId = me.cu_dan?.can_ho_dang_o || me.ma_can_ho;
        if (!apartmentId && me.cu_dan_id) {
          try {
            const residentInfo = await residentsService.getResidentDetail(
              me.cu_dan_id
            );
            apartmentId = residentInfo.can_ho_dang_o || residentInfo.ma_can_ho;
          } catch (e) {}
        }

        if (!apartmentId) {
          console.warn("Không tìm thấy ID căn hộ");
          return;
        }

        // --- GỌI CÁC API KHÁC ---

        // 1. Căn hộ
        try {
          const apt = await residentsService.getApartmentDetail(apartmentId);
          setAptInfo((prev) => ({
            ...prev,
            building: apt.toa_nha || "A",
            floor: apt.tang || "...",
            room: apt.phong || apt.ma_can_ho || apartmentId,
            area: apt.dien_tich || 0,
            bedrooms: apt.so_phong_ngu || 0,
          }));
        } catch (e) {}

        // 2. Cư dân
        try {
          const resResponse = await residentsService.getResidents();
          const allRes = Array.isArray(resResponse)
            ? resResponse
            : resResponse.results || [];
          const myRes = allRes.filter((r) => r.can_ho_dang_o == apartmentId); // So sánh lỏng (==)
          setResidents(myRes);
        } catch (e) {}

        // 3. Phương tiện
        try {
          const vehResponse = await utilitiesService.getVehicles();
          const allVeh = Array.isArray(vehResponse)
            ? vehResponse
            : vehResponse.results || [];
          const myVeh = allVeh.filter((v) => v.ma_can_ho == apartmentId);
          setVehicles(myVeh);
          setAptInfo((prev) => ({ ...prev, vehicles: myVeh.length }));
        } catch (e) {}

        // 4. Hóa đơn
        try {
          const invResponse = await financeService.getInvoices();
          const allInv = Array.isArray(invResponse)
            ? invResponse
            : invResponse.results || [];
          const myInvoices = allInv.filter((i) => {
            const belong =
              i.can_ho == apartmentId || i.ma_can_ho == apartmentId;
            const unpaid =
              !i.trang_thai ||
              i.trang_thai === 0 ||
              i.trang_thai === "Chưa thanh toán";
            return belong && unpaid;
          });
          if (myInvoices.length > 0) {
            myInvoices.sort((a, b) => b.id - a.id);
            setUnpaidInvoice(myInvoices[0]);
          }
        } catch (e) {}

        // 5. CHỈ SỐ ĐIỆN NƯỚC (Đã có biến config và apartmentId)
        try {
          const utilsRes = await axios.get(`${API_BASE}/v1/readings/`, config);
          const allReadings = Array.isArray(utilsRes.data)
            ? utilsRes.data
            : utilsRes.data.results || [];

          // Lọc theo căn hộ
          const myReadings = allReadings.filter(
            (r) => r.can_ho == apartmentId || r.ma_can_ho == apartmentId
          );

          // Lấy điện mới nhất
          const electric = myReadings
            .filter((r) =>
              ["E", "DIEN", "ELECTRIC"].includes(
                (r.loai_dich_vu + "").toUpperCase()
              )
            )
            .sort((a, b) => b.id - a.id)[0];

          // Lấy nước mới nhất
          const water = myReadings
            .filter((r) =>
              ["W", "NUOC", "WATER"].includes(
                (r.loai_dich_vu + "").toUpperCase()
              )
            )
            .sort((a, b) => b.id - a.id)[0];

          setUtilityReadings({
            electric: electric
              ? {
                  usage: electric.chi_so_moi - electric.chi_so_cu,
                  old: electric.chi_so_cu,
                  new: electric.chi_so_moi,
                }
              : { usage: 0, old: 0, new: 0 },
            water: water
              ? {
                  usage: water.chi_so_moi - water.chi_so_cu,
                  old: water.chi_so_cu,
                  new: water.chi_so_moi,
                }
              : { usage: 0, old: 0, new: 0 },
          });
        } catch (e) {
          console.error("Lỗi điện nước:", e);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          // Token hết hạn thì logout
          localStorage.removeItem("auth_token");
          navigate("/");
        }
      }
    };
    fetchData();
  }, []);

  // --- HANDLERS ---
  // --- Thay thế hàm handleSendRequest cũ bằng hàm này ---
  const handleSendRequest = async () => {
    if (!requestForm.title || !requestForm.content) {
      alert("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("auth_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        tieu_de: requestForm.title,
        noi_dung: requestForm.content,
        loai_yeu_cau: requestForm.type,
      };

      // Gọi API
      await axios.post(
        "http://localhost:8000/api/v1/support-tickets/",
        payload,
        config
      );

      alert("Gửi yêu cầu thành công!");
      setOpenRequest(false);
      setRequestForm({ title: "", type: "SC", content: "" });
    } catch (error) {
      console.error("Lỗi gửi yêu cầu:", error);

      // --- ĐOẠN CODE FIX LỖI TOKEN ---
      if (
        error.response &&
        error.response.data &&
        error.response.data.code === "token_not_valid"
      ) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");

        // 1. Xóa token hỏng
        localStorage.removeItem("auth_token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("user_info");

        // 2. Chuyển hướng về trang Login
        navigate("/login");
        return;
      }
      // -----------------------------

      const serverMsg = error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;
      alert(`Gửi thất bại! Lỗi: ${serverMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAddResident = () => {
    alert("Đã gửi hồ sơ! (Giả lập)");
    setOpenAddPerson(false);
  };
  const handlePay = async () => {
    if (!unpaidInvoice) return;
    try {
      if (
        window.confirm(
          `Xác nhận thanh toán cho hóa đơn #${unpaidInvoice.ma_hoa_don}?`
        )
      ) {
        await financeService.confirmPayment(unpaidInvoice.ma_hoa_don);
        alert("Thanh toán thành công!");
        setOpenPayment(false);
        setUnpaidInvoice(null);
        window.location.reload();
      }
    } catch (e) {
      alert("Lỗi thanh toán: " + (e.response?.data?.detail || e.message));
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    setPasswordLoading(true);
    try {
      await authService.changePassword(passwords.current, passwords.next);
      alert("Thay đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      setOpenPasswordDialog(false);
      setPasswords({ current: "", next: "", confirm: "" });
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.detail || error.message));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("user_info");
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.bgLight,
        width: "100%",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha("#fff", 0.9),
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: alpha("#e2e8f0", 0.8),
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            py: 1,
            px: { xs: 1, sm: 2 },
            minHeight: 64,
            gap: 2,
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: COLORS.primary,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: `0 4px 10px ${alpha(COLORS.primary, 0.3)}`,
              }}
            >
              <Apartment />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: COLORS.textDark, lineHeight: 1 }}
              >
                BlueMoon
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: COLORS.textSecondary,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Cổng cư dân
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton>
              <Badge badgeContent=" " color="error" variant="dot">
                <Notifications />
              </Badge>
            </IconButton>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 0.5,
                py: 0.5,
                borderRadius: 10,
                cursor: "pointer",
                "&:hover": { bgcolor: alpha("#fff", 0.8) },
              }}
              onClick={() => setOpenProfileMenu(!openProfileMenu)}
            >
              <Avatar
                sx={{ width: 36, height: 36 }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMRdQjgLAhlKu3y_lxvVXhYAYe6AePg_WwM7i5JprSXqQMiT68K6dBFMcYtZU3SCry5_rcj-6bI8VQmcKwi1N8t6SoxkdES1oSfng5PQCEmClFSNBUHSPJE1dB7Ep4c95LliFB89ObnQz0o7kvENHnSRcnLTXKVcIWx1_X57ZgVG_ue1hR6hZQ4MwtBddFTLzC0U6FtYNgQv0eIH24DcjiNV1FOh6TN2o6OtD-4dCLGt34Wn93TOOr0ZtLkpho-7e9hGsT0549TLY"
              />
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1,
                    color: COLORS.textDark,
                  }}
                >
                  {user.ho_ten || user.username || "Cư dân"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: COLORS.textSecondary, fontWeight: 600 }}
                >
                  Chủ hộ
                </Typography>
              </Box>
              <ExpandMore
                sx={{
                  display: { xs: "none", sm: "block" },
                  color: COLORS.textTertiary,
                }}
              />
            </Box>

            {/* Profile Dropdown Menu */}
            {openProfileMenu && (
              <Paper
                sx={{
                  position: "absolute",
                  top: 70,
                  right: 20,
                  zIndex: 1000,
                  minWidth: 200,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                }}
              >
                <Box sx={{ p: 0 }}>
                  <Button
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      px: 2,
                      py: 1.2,
                      color: COLORS.textDark,
                      textTransform: "none",
                      fontSize: 14,
                      fontWeight: 500,
                      "&:hover": { bgcolor: COLORS.bgLight },
                    }}
                    onClick={() => {
                      setOpenPasswordDialog(true);
                      setOpenProfileMenu(false);
                    }}
                  >
                    🔐 Thay đổi mật khẩu
                  </Button>
                  <Divider />
                  <Button
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      px: 2,
                      py: 1.2,
                      color: COLORS.error,
                      textTransform: "none",
                      fontSize: 14,
                      fontWeight: 500,
                      "&:hover": { bgcolor: alpha(COLORS.error, 0.1) },
                    }}
                    onClick={() => {
                      setOpenProfileMenu(false);
                      handleLogout();
                    }}
                  >
                    🚪 Đăng xuất
                  </Button>
                </Box>
              </Paper>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* MAIN CONTENT */}
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
          bgcolor: COLORS.bgLight,
          minHeight: "100vh",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {/* Page Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: { xs: 1.5, sm: 3 },
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  letterSpacing: -0.5,
                  color: COLORS.textDark,
                }}
              >
                Căn hộ {aptInfo.room}
              </Typography>
              <Chip
                icon={
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: COLORS.success,
                      animation: "pulse 2s infinite",
                    }}
                  />
                }
                label="Đang ở"
                size="small"
                sx={{
                  bgcolor: "#ecfdf5",
                  color: "#047857",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  border: `1px solid #a7f3d0`,
                }}
              />
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Quản lý thông tin cư dân, chi phí và các dịch vụ tiện ích.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={() => setOpenSettings(true)}
              sx={{
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 1.5,
                color: COLORS.primary,
                borderColor: COLORS.primary,
              }}
            >
              Cài đặt
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenRequest(true)}
              sx={{
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                boxShadow: `0 4px 6px -1px ${alpha(COLORS.primary, 0.1)}`,
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: `0 10px 15px -3px ${alpha(COLORS.primary, 0.2)}`,
                },
              }}
            >
              Yêu cầu mới
            </Button>
          </Stack>
        </Box>

        {/* Dashboard Grid */}
        <Grid
          container
          spacing={{ xs: 2, sm: 4 }}
          sx={{
            width: "100%",
            overflow: "hidden",
            ml: 0,
            mr: 0,
            justifyContent: "space-between",
          }}
        >
          {/* Left Column */}
          <Grid item xs={12} lg={9} sx={{ width: "70%" }}>
            <Stack spacing={4}>
              {/* Apartment Info Card */}
              <Card sx={{ ...STYLES.card, overflow: "hidden" }}>
                <Grid container sx={{ minHeight: { xs: "auto", md: 300 } }}>
                  <Grid item xs={12} sx={{ display: "flex" }}>
                    <Box
                      sx={{
                        width: "500px",
                        height: { xs: 220, md: "100%" },
                        minHeight: { md: 300 },
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDOACeW48c7w6_B0TZoHTtEigYpVBdyRE-ydfIT4BMWSrAlps65FnPiVC0BCE81CeAd1Bh03JmkVOWzG8eY9atBU8jLETxdO_OgC0elxb1yKjE_2gBLd8nvgN9KZq20TRo5GogAjqm_R4f9nZjSOu5SIc4FxeTMggFkEghF3Z772CvrBVn-J6O5gzv9KSfoGyiQKrDn625HAhClJOvvcEpRKMabxhb8obE_OA7HidxMS9NKGta7FPbkan3jbmS71A-cYySB86eSoIs")',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to right, rgba(0,0,0,0.15), transparent)",
                        },
                      }}
                    />
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      margin: 0,
                    }}
                  >
                    <CardContent sx={{ width: "100%" }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          fontSize: "2rem",
                          mb: 2,
                          color: COLORS.textDark,
                        }}
                      >
                        Thông tin căn hộ
                      </Typography>
                      <Paper
                        sx={{
                          p: 1.5,
                          bgcolor: COLORS.bgCardLight,
                          border: `1px solid ${COLORS.bgHover}`,
                          borderRadius: 1.5,
                          mb: 2,

                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "flex-start",
                          }}
                        >
                          <LocationOn
                            sx={{
                              color: COLORS.primary,
                              fontSize: 20,
                              mt: 0.25,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500, lineHeight: 1.5 }}
                          >
                            Tháp {aptInfo.building}, Tầng {aptInfo.floor}, Căn{" "}
                            {aptInfo.room}
                            <br />
                            Chung cư BlueMoon
                          </Typography>
                        </Box>
                      </Paper>
                      <Grid container spacing={1}>
                        {[
                          {
                            icon: <SquareFoot />,
                            label: "Diện tích",
                            value: `${aptInfo.area} m²`,
                            color: "#eff6ff",
                            iconColor: COLORS.secondary,
                          },
                          {
                            icon: <Bed />,
                            label: "Phòng ngủ",
                            value: `${aptInfo.bedrooms}`,
                            color: "#faf5ff",
                            iconColor: "#9333ea",
                          },
                          {
                            icon: <BadgeOutlined />,
                            label: "Thẻ cư dân",
                            value: `${residents.length} / 4`,
                            color: "#fffbeb",
                            iconColor: COLORS.warning,
                          },
                          {
                            icon: <DirectionsCar />,
                            label: "Xe đăng ký",
                            value: `${vehicles.length} xe`,
                            color: COLORS.bgHover,
                            iconColor: COLORS.textSecondary,
                          },
                        ].map((stat, i) => (
                          <Grid item xs={3} key={i}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 0.5,
                                p: 1,
                                textAlign: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  color: stat.iconColor,
                                  fontSize: { xs: "2rem", md: "2.5rem" },
                                }}
                              >
                                {stat.icon}
                              </Box>
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: COLORS.textSecondary,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    fontSize: "0.6rem",
                                    display: "block",
                                    lineHeight: 1,
                                    mb: 0.25,
                                  }}
                                >
                                  {stat.label}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 800,
                                    color: COLORS.textDark,
                                    fontSize: { xs: "0.75rem", md: "0.9rem" },
                                  }}
                                >
                                  {stat.value}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>

              {/* Residents List */}
              <Card sx={{ ...STYLES.card, p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      width: "300px",
                    }}
                  >
                    <Box sx={{ ...STYLES.iconBox("#e0e7ff", "#4f46e5") }}>
                      <Groups />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: COLORS.textDark }}
                      >
                        Nhân khẩu
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Danh sách thành viên gia đình
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    endIcon={<ArrowForward />}
                    sx={{
                      fontWeight: 700,
                      textTransform: "none",
                      color: COLORS.primary,
                      width: "130px",
                    }}
                  >
                    Quản lý
                  </Button>
                </Box>

                <Grid container spacing={2.5}>
                  {residents.map((res, i) => (
                    <Grid item xs={12} md={6} key={i} sx={{ width: "45%" }}>
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          ...STYLES.paper,
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            borderColor: alpha(COLORS.primary, 0.4),
                            boxShadow: 2,
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 6,
                            bgcolor: i === 0 ? COLORS.primary : "transparent",
                          },
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: COLORS.bgHover,
                              color: COLORS.textSecondary,
                              fontWeight: 700,
                            }}
                          >
                            {res.ho_ten ? res.ho_ten.charAt(0) : "U"}
                          </Avatar>
                          {i === 0 && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: -4,
                                right: -4,
                                bgcolor: COLORS.warning,
                                color: "white",
                                borderRadius: "50%",
                                p: 0.25,
                                border: "2px solid white",
                                display: "flex",
                              }}
                            >
                              <Star sx={{ fontSize: 14 }} />
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 700,
                              mb: 0.5,
                              color: COLORS.textDark,
                            }}
                          >
                            {res.ho_ten}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                i === 0 ? COLORS.primary : COLORS.textSecondary,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            {res.quan_he || "Thành viên"}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              color: COLORS.textSecondary,
                            }}
                          >
                            <Call sx={{ fontSize: 14 }} />
                            <Typography variant="caption">
                              {res.sdt || "---"}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}

                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ width: "45%", height: "100%" }}
                  >
                    <Paper
                      onClick={() => setOpenAddPerson(true)}
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        border: `2px dashed #cbd5e1`,
                        borderRadius: 2,
                        cursor: "pointer",
                        bgcolor: "transparent",
                        "&:hover": {
                          borderColor: COLORS.primary,
                          bgcolor: COLORS.bgCardLight,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: COLORS.bgHover,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Add sx={{ color: COLORS.textTertiary }} />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: COLORS.textSecondary }}
                      >
                        Đăng ký thêm
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Card>

              {/* Quick Utilities */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: COLORS.textDark,
                  }}
                >
                  <Bolt sx={{ color: COLORS.warning }} /> Tiện ích nhanh
                </Typography>
                <Grid container spacing={2}>
                  {[
                    {
                      label: "Thanh toán",
                      icon: <Payments />,
                      color: "#eff6ff",
                      iconColor: COLORS.secondary,
                      onClick: () => setOpenPayment(true),
                    },
                    {
                      label: "Đặt sân",
                      icon: <SportsTennis />,
                      color: "#faf5ff",
                      iconColor: "#9333ea",
                    },
                    {
                      label: "ĐK Khách",
                      icon: <PersonAdd />,
                      color: "#ecfdf5",
                      iconColor: COLORS.success,
                    },
                    {
                      label: "Báo sự cố",
                      icon: <Build />,
                      color: "#fff7ed",
                      iconColor: "#ea580c",
                    },
                  ].map((util, i) => (
                    <Grid item xs={6} sm={3} key={i}>
                      <Paper
                        onClick={util.onClick}
                        sx={{
                          p: 2.5,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1.5,
                          cursor: "pointer",
                          ...STYLES.paper,
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 4,
                          },
                        }}
                      >
                        <Box
                          sx={{ ...STYLES.iconBox(util.color, util.iconColor) }}
                        >
                          {util.icon}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: COLORS.textDark }}
                        >
                          {util.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Stack>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={3} sx={{ pr: 0, width: "25%" }}>
            <Stack spacing={4}>
              {/* Payment Card */}
              {unpaidInvoice ? (
                <Card
                  sx={{
                    ...STYLES.card,
                    p: 3,
                    minHeight: 300,
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, ${COLORS.accent} 100%)`,
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: `0 20px 25px -5px ${alpha(
                      COLORS.secondary,
                      0.3
                    )}`,
                  }}
                >
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Chip
                        icon={<CalendarMonth sx={{ fontSize: 14 }} />}
                        label={`Kỳ T${unpaidInvoice.thang}/${unpaidInvoice.nam}`}
                        size="small"
                        sx={{
                          bgcolor: alpha("#fff", 0.1),
                          backdropFilter: "blur(4px)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.2)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                        }}
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: COLORS.error,
                          animation: "pulse 2s infinite",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: COLORS.textLight, mb: 0.5 }}
                    >
                      Tổng phí cần đóng
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
                      {Number(unpaidInvoice.tong_tien).toLocaleString("vi-VN")}{" "}
                      ₫
                    </Typography>
                    <Divider sx={{ bgcolor: alpha("#fff", 0.1), my: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        color: COLORS.textLight,
                      }}
                    >
                      <EventBusy sx={{ fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        Hạn thanh toán: 05/{unpaidInvoice.thang + 1}/
                        {unpaidInvoice.nam}
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setOpenPayment(true)}
                      endIcon={<ArrowForward />}
                      sx={{
                        mt: 3,
                        bgcolor: "white",
                        color: COLORS.primary,
                        fontWeight: 700,
                        py: 1.5,
                        borderRadius: 1.5,
                        "&:hover": {
                          bgcolor: "#f8fafc",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Thanh toán ngay
                    </Button>
                  </Box>
                </Card>
              ) : (
                <Card
                  sx={{
                    ...STYLES.card,
                    p: 3,
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    bgcolor: "#ecfdf5",
                    border: `1px solid #a7f3d0`,
                  }}
                >
                  <CheckCircle
                    sx={{ fontSize: 60, color: COLORS.success, mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#065f46", mb: 1 }}
                  >
                    Đã thanh toán hết
                  </Typography>
                  <Typography variant="body2" sx={{ color: COLORS.success }}>
                    Bạn không có hóa đơn nào cần thanh toán.
                  </Typography>
                </Card>
              )}
              {/*CARD ĐIỆN NƯỚC*/}
              <Card sx={{ ...STYLES.card, p: 3 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  textTransform="uppercase"
                  mb={2}
                  color={COLORS.textDark}
                >
                  Tiêu thụ tháng này
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Box display="flex" gap={1} alignItems="center">
                        <Bolt sx={{ color: "#f59e0b" }} />
                        <Typography fontWeight={600}>Điện</Typography>
                      </Box>
                      <Typography fontWeight={700} sx={{ color: "#f59e0b" }}>
                        {utilityReadings?.electric?.usage || 0} kWh
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(
                        utilityReadings?.electric?.usage || 0,
                        100
                      )}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        bgcolor: "#fff7ed",
                        "& .MuiLinearProgress-bar": { bgcolor: "#f59e0b" },
                      }}
                    />
                    <Box display="flex" justifyContent="space-between" mt={0.5}>
                      <Typography variant="caption" color="textSecondary">
                        Cũ: {utilityReadings?.electric?.old || 0}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Mới: {utilityReadings?.electric?.new || 0}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Box display="flex" gap={1} alignItems="center">
                        <WaterDrop sx={{ color: "#3b82f6" }} />
                        <Typography fontWeight={600}>Nước</Typography>
                      </Box>
                      <Typography fontWeight={700} sx={{ color: "#3b82f6" }}>
                        {utilityReadings?.water?.usage || 0} m³
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(
                        (utilityReadings?.water?.usage || 0) * 2,
                        100
                      )}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        bgcolor: "#eff6ff",
                        "& .MuiLinearProgress-bar": { bgcolor: "#3b82f6" },
                      }}
                    />
                    <Box display="flex" justifyContent="space-between" mt={0.5}>
                      <Typography variant="caption" color="textSecondary">
                        Cũ: {utilityReadings?.water?.old || 0}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Mới: {utilityReadings?.water?.new || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Card>

              {/* History */}
              <Card sx={{ ...STYLES.card, overflow: "hidden" }}>
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: alpha(COLORS.bgCardLight, 0.5),
                    borderBottom: `1px solid ${COLORS.bgHover}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: COLORS.textDark,
                    }}
                  >
                    Lịch sử giao dịch
                  </Typography>
                  <Button
                    size="small"
                    sx={{
                      fontWeight: 700,
                      textTransform: "none",
                      fontSize: "0.75rem",
                      color: COLORS.primary,
                    }}
                  >
                    Xem tất cả
                  </Button>
                </Box>
                <Box sx={{ p: 1.5 }}>
                  {[
                    {
                      title: "Phí quản lý T9",
                      date: "01/10/2023 • 09:30 AM",
                      amount: "-1.200k",
                      icon: <ReceiptLong />,
                      color: "#ecfdf5",
                      iconColor: COLORS.success,
                    },
                    {
                      title: "Tiền điện T9",
                      date: "01/10/2023 • 09:30 AM",
                      amount: "-850k",
                      icon: <WaterDrop />,
                      color: "#eff6ff",
                      iconColor: COLORS.secondary,
                    },
                  ].map((h, i) => (
                    <Paper
                      key={i}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        border: "1px solid transparent",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: COLORS.bgCardLight,
                          borderColor: COLORS.bgHover,
                        },
                      }}
                      elevation={0}
                    >
                      <Box
                        sx={{ display: "flex", gap: 1.5, alignItems: "center" }}
                      >
                        <Box sx={{ ...STYLES.iconBox(h.color, h.iconColor) }}>
                          {h.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: COLORS.textDark }}
                          >
                            {h.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: COLORS.textTertiary }}
                          >
                            {h.date}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: COLORS.textDark }}
                      >
                        {h.amount}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Card>

              {/* Notifications */}
              <Card sx={{ ...STYLES.card, overflow: "hidden", flex: 1 }}>
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: alpha(COLORS.bgCardLight, 0.5),
                    borderBottom: `1px solid ${COLORS.bgHover}`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      mb: 2,
                      color: COLORS.textDark,
                    }}
                  >
                    Thông báo & Sự kiện
                  </Typography>
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: "#fffbeb",
                      border: `1px solid #fde68a`,
                      borderRadius: 1.5,
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: COLORS.warning,
                        animation: "pulse 2s infinite",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, color: "#92400e", flex: 1 }}
                    >
                      Đang xử lý: Sửa đường ống
                    </Typography>
                    <ArrowForward
                      sx={{ fontSize: 14, color: COLORS.warning }}
                    />
                  </Paper>
                </Box>
                <Box sx={{ p: 1.5 }}>
                  {[
                    {
                      title: "Bảo trì thang máy",
                      desc: "Thang máy số 2 sẽ tạm ngừng...",
                      time: "1h trước",
                      icon: <Campaign />,
                      color: "#faf5ff",
                      iconColor: "#9333ea",
                    },
                    {
                      title: "Hóa đơn nước T9",
                      desc: "Hóa đơn tiền nước tháng 9...",
                      time: "1d trước",
                      icon: <Description />,
                      color: "#eff6ff",
                      iconColor: COLORS.secondary,
                    },
                  ].map((n, i) => (
                    <Paper
                      key={i}
                      sx={{
                        p: 1.5,
                        mb: 0.5,
                        display: "flex",
                        gap: 1.5,
                        border: "1px solid transparent",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: COLORS.bgCardLight,
                          borderColor: COLORS.bgHover,
                        },
                      }}
                      elevation={0}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: n.color,
                          color: n.iconColor,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {n.icon}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: COLORS.textDark }}
                          >
                            {n.title}
                          </Typography>
                          <Chip
                            label={n.time}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.625rem",
                              fontWeight: 700,
                              bgcolor: COLORS.bgHover,
                              color: COLORS.textTertiary,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: COLORS.textSecondary,
                            display: "block",
                            lineHeight: 1.4,
                          }}
                        >
                          {n.desc}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* DIALOGS */}
      <Dialog
        open={openRequest}
        onClose={() => setOpenRequest(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Gửi yêu cầu mới</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tiêu đề"
            margin="normal"
            placeholder="VD: Sửa bóng đèn hành lang"
            value={requestForm.title}
            onChange={(e) =>
              setRequestForm({ ...requestForm, title: e.target.value })
            }
          />
          <TextField
            fullWidth
            select
            label="Loại yêu cầu"
            margin="normal"
            value={requestForm.type}
            onChange={(e) =>
              setRequestForm({ ...requestForm, type: e.target.value })
            }
          >
            <MenuItem value="SC">Sửa chữa / Kỹ thuật</MenuItem>
            <MenuItem value="VS">Vệ sinh</MenuItem>
            <MenuItem value="AN">An ninh</MenuItem>
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Nội dung chi tiết"
            margin="normal"
            value={requestForm.content}
            onChange={(e) =>
              setRequestForm({ ...requestForm, content: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRequest(false)}>Hủy</Button>
          {/* THÊM disabled={isSubmitting} ĐỂ CHẶN BẤM NHIỀU LẦN */}
          <Button
            variant="contained"
            onClick={handleSendRequest}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddPerson}
        onClose={() => setOpenAddPerson(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Đăng ký nhân khẩu</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Họ và tên" margin="normal" />
          <TextField fullWidth label="Số điện thoại" margin="normal" />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAddPerson(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAddResident}>
            Đăng ký
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
          ⚙️ Cài Đặt
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(COLORS.primary, 0.2)}`,
                bgcolor: alpha(COLORS.primary, 0.05),
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: alpha(COLORS.primary, 0.1),
                  borderColor: COLORS.primary,
                },
              }}
              onClick={() => {
                setOpenSettings(false);
                setOpenPasswordDialog(true);
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: alpha(COLORS.primary, 0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.primary,
                  }}
                >
                  🔐
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: COLORS.textDark }}
                  >
                    Thay Đổi Mật Khẩu
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.textSecondary }}
                  >
                    Cập nhật mật khẩu tài khoản của bạn
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(COLORS.error, 0.2)}`,
                bgcolor: alpha(COLORS.error, 0.05),
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: alpha(COLORS.error, 0.1),
                  borderColor: COLORS.error,
                },
              }}
              onClick={() => {
                setOpenSettings(false);
                handleLogout();
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: alpha(COLORS.error, 0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.error,
                  }}
                >
                  🚪
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: COLORS.textDark }}
                  >
                    Đăng Xuất
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.textSecondary }}
                  >
                    Thoát khỏi tài khoản hiện tại
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setOpenSettings(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
          Thanh Toán Hóa Đơn
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 3,
          }}
        >
          {unpaidInvoice && (
            <>
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: "#137fec", mb: 1 }}
              >
                {Number(unpaidInvoice.tong_tien).toLocaleString("vi-VN")} đ
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, fontWeight: 500 }}
              >
                Hóa đơn Tháng {unpaidInvoice.thang}/{unpaidInvoice.nam} - Căn hộ{" "}
                {aptInfo.room}
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "#f1f5f9", borderRadius: 2, mb: 2 }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                  alt="QR Code"
                  width="160"
                  height="160"
                />
              </Paper>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Quét mã để chuyển khoản.
                <br />
                Nội dung CK:{" "}
                <strong>
                  {aptInfo.room} T{unpaidInvoice.thang}
                </strong>
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={() => setOpenPayment(false)}
            color="inherit"
            sx={{ mr: 1 }}
          >
            Đóng
          </Button>
          <Button variant="contained" color="success" onClick={handlePay}>
            Xác nhận đã thanh toán
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
          🔐 Thay Đổi Mật Khẩu
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 0.8,
                  color: COLORS.textDark,
                }}
              >
                Mật khẩu hiện tại
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                size="small"
                variant="outlined"
              />
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 0.8,
                  color: COLORS.textDark,
                }}
              >
                Mật khẩu mới
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={passwords.next}
                onChange={(e) =>
                  setPasswords({ ...passwords, next: e.target.value })
                }
                size="small"
                variant="outlined"
              />
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 0.8,
                  color: COLORS.textDark,
                }}
              >
                Xác nhận mật khẩu
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                size="small"
                variant="outlined"
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: COLORS.textSecondary,
                fontStyle: "italic",
              }}
            >
              ⚠️ Nên sử dụng mật khẩu mạnh để bảo vệ tài khoản
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenPasswordDialog(false);
              setPasswords({ current: "", next: "", confirm: "" });
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleChangePassword}
            disabled={passwordLoading}
          >
            {passwordLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
