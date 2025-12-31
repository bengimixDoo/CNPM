import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PaymentIcon from "@mui/icons-material/Payment";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BuildIcon from "@mui/icons-material/Build";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import Inventory2Icon from "@mui/icons-material/Inventory2";

// đổi link backend
const API_BASE = "link backend";

export default function ResidentHome() {
  const navigate = useNavigate();

  // Các State quản lý Popup
  const [openRequest, setOpenRequest] = useState(false);
  const [openAddPerson, setOpenAddPerson] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  // State chứa dữ liệu thật từ Server
  // Lấy thông tin cơ bản từ LocalStorage để hiển thị ngay lập tức
  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  });
  const [residents, setResidents] = useState([]); // Danh sách thành viên
  const [aptInfo, setAptInfo] = useState({
    // Thông tin căn hộ
    building: "...",
    floor: "...",
    room: "...",
    area: 0,
    bedrooms: 0,
    vehicles: 0,
    cards: 0,
  });

  // gọi api
  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Gọi API 1: Lấy thông tin căn hộ
        const resApt = await axios.get(`${API_BASE}/my-apartment`, config);
        setAptInfo(resApt.data);

        // Gọi API 2: Lấy danh sách thành viên gia đình
        const resFamily = await axios.get(`${API_BASE}/my-family`, config);
        setResidents(Array.isArray(resFamily.data) ? resFamily.data : []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu từ Server:", err);
        // Nếu lỗi (hoặc chưa có backend), code sẽ giữ nguyên state mặc định
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleSendRequest = () => {
    alert("Yêu cầu đã gửi!");
    setOpenRequest(false);
  };
  const handleAddResident = () => {
    alert("Đã gửi hồ sơ!");
    setOpenAddPerson(false);
  };
  const handlePay = () => {
    alert("Thanh toán thành công! Hóa đơn điện tử đã được gửi về email.");
    setOpenPayment(false);
  };

  const quickActions = [
    {
      label: "Thanh toán",
      icon: <PaymentIcon sx={{ fontSize: 30, color: "#3b82f6" }} />,
      bg: "#eff6ff",
      link: "/resident/payments",
    },
    {
      label: "Đặt tiện ích",
      icon: <EventAvailableIcon sx={{ fontSize: 30, color: "#a855f7" }} />,
      bg: "#faf5ff",
      link: "/resident/utilities",
    },
    {
      label: "Đăng ký khách",
      icon: <PersonAddIcon sx={{ fontSize: 30, color: "#22c55e" }} />,
      bg: "#f0fdf4",
      link: "/resident/services",
    },
    {
      label: "Báo sự cố",
      icon: <BuildCircleIcon sx={{ fontSize: 30, color: "#f97316" }} />,
      bg: "#fff7ed",
      link: "/resident/services",
    },
  ];

  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: "var(--text-primary, #1a1a1a)" }}
          >
            {/* Hiển thị số phòng từ API */}
            Căn hộ{" "}
            {aptInfo.room !== "..." ? aptInfo.room : user.apartment || "..."}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Xin chào <b>{user.full_name || user.username || "Cư dân"}</b>, đây
            là bảng tin căn hộ của bạn.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              color: "inherit",
              borderColor: "rgba(0,0,0,0.12)",
            }}
            onClick={() => navigate("/resident/settings")}
          >
            Cài đặt
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#0077ff" }}
            onClick={() => setOpenRequest(true)}
          >
            Yêu cầu mới
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Thông tin căn hộ */}
          <Paper
            sx={{
              p: 0,
              borderRadius: 3,
              overflow: "hidden",
              mb: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              bgcolor: "var(--card)",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", sm: 280 },
                height: { xs: 200, sm: "auto" },
                bgcolor: "#ddd",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop"
                alt="Apartment"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Box sx={{ p: 3, flex: 1 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Thông tin căn hộ
                </Typography>
                <Chip
                  label="ĐANG Ở"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 700, bgcolor: "#dcfce7", color: "#166534" }}
                />
              </Box>
              {/* Hiển thị địa chỉ từ API */}
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Tòa {aptInfo.building}, Tầng {aptInfo.floor} - Khu Đô thị
                BlueMoon
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    display="block"
                  >
                    DIỆN TÍCH
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {aptInfo.area} m²
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    display="block"
                  >
                    PHÒNG NGỦ
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {aptInfo.bedrooms}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    display="block"
                  >
                    THẺ CƯ DÂN
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {aptInfo.cards}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    display="block"
                  >
                    XE
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {aptInfo.vehicles}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Nhân khẩu */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              bgcolor: "var(--card)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    p: 0.5,
                    bgcolor: "#e0f2fe",
                    borderRadius: 1,
                    color: "#0077ff",
                  }}
                >
                  <AccountBoxIcon />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Nhân khẩu
                </Typography>
                <Chip
                  label={residents.length}
                  size="small"
                  sx={{ bgcolor: "rgba(0,0,0,0.05)", fontWeight: 700 }}
                />
              </Box>
            </Box>
            <Grid container spacing={2}>
              {/* Map dữ liệu từ API */}
              {residents.map((r, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      border: "1px solid rgba(0,0,0,0.1)",
                      bgcolor: "transparent",
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        py: 2,
                        "&:last-child": { pb: 2 },
                      }}
                    >
                      <Avatar sx={{ bgcolor: "#0ea5e9" }}>
                        {r.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>{r.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          <span style={{ color: "#0077ff", fontWeight: 600 }}>
                            {r.relation || "Thành viên"}
                          </span>{" "}
                          • {r.phone || "---"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    borderStyle: "dashed",
                    color: "text.secondary",
                    borderColor: "rgba(0,0,0,0.2)",
                  }}
                  onClick={() => setOpenAddPerson(true)}
                >
                  Đăng ký thêm
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Tiện ích nhanh */}
          <Box>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Tiện ích nhanh
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((item, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "0.2s",
                      "&:hover": { transform: "translateY(-3px)" },
                      bgcolor: "var(--card)",
                    }}
                    onClick={() => navigate(item.link)}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        bgcolor: item.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography fontWeight={600} fontSize={14}>
                      {item.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* CỘT PHẢI */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, #0077ff 0%, #2563eb 100%)",
              color: "white",
              mb: 3,
              boxShadow: "0 10px 30px rgba(37, 99, 235, 0.3)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
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
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "rgba(255,255,255,0.2)",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                  }}
                >
                  <EventAvailableIcon fontSize="small" />{" "}
                  <Typography variant="caption" fontWeight={600}>
                    Kỳ T12/2025
                  </Typography>
                </Box>
                <LocalParkingIcon sx={{ opacity: 0.5, fontSize: 40 }} />
              </Box>
              <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
                2.500.000đ
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                Hạn thanh toán: 31/12/2025
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "#0077ff",
                  fontWeight: 700,
                  borderRadius: 2,
                  py: 1.5,
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
                onClick={() => setOpenPayment(true)}
              >
                Thanh toán ngay{" "}
                <ArrowForwardIcon fontSize="small" sx={{ ml: 1 }} />
              </Button>
            </CardContent>
          </Card>

          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "var(--card)" }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Thông báo mới
            </Typography>
            <List disablePadding>
              {[
                {
                  title: "Bảo trì thang máy",
                  desc: "Tạm ngừng từ 9h-11h.",
                  icon: <BuildIcon fontSize="small" />,
                  color: "#f43f5e",
                  bg: "#ffe4e6",
                },
                {
                  title: "Tiền nước T12",
                  desc: "Đã có hóa đơn mới.",
                  icon: <WaterDropIcon fontSize="small" />,
                  color: "#3b82f6",
                  bg: "#dbeafe",
                },
                {
                  title: "Bưu phẩm đến",
                  desc: "Vui lòng nhận tại lễ tân.",
                  icon: <Inventory2Icon fontSize="small" />,
                  color: "#22c55e",
                  bg: "#dcfce7",
                },
              ].map((item, i) => (
                <ListItem key={i} sx={{ px: 0, alignItems: "flex-start" }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: item.bg, color: item.color }}>
                      {item.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={700}>
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {item.desc}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* --- CÁC DIALOG (POPUP) --- */}

      {/* 1. Dialog Yêu Cầu */}
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
          />
          <TextField
            fullWidth
            select
            label="Loại yêu cầu"
            margin="normal"
            defaultValue="SC"
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
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRequest(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSendRequest}>
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2. Dialog Thêm Người */}
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
          <TextField
            fullWidth
            label="Quan hệ với chủ hộ"
            margin="normal"
            placeholder="VD: Con, Bố, Mẹ..."
          />
          <TextField
            fullWidth
            type="date"
            label="Ngày sinh"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAddPerson(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAddResident}>
            Đăng ký
          </Button>
        </DialogActions>
      </Dialog>

      {/* 3. Dialog Thanh Toán */}
      <Dialog
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
          Quét Mã Thanh Toán
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
          <Typography
            variant="h4"
            color="primary"
            fontWeight={800}
            sx={{ mb: 2 }}
          >
            2.500.000 đ
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Phí dịch vụ + Gửi xe T12/2025
          </Typography>

          {/* Vùng chứa QR Code */}
          <Box sx={{ p: 2, bgcolor: "#f0f0f0", borderRadius: 2, mb: 2 }}>
            {/* Link ảnh QR mẫu */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
              alt="QR Code"
              width="180"
              height="180"
            />
          </Box>

          <Typography variant="caption" color="textSecondary" align="center">
            Sử dụng ứng dụng Ngân hàng hoặc Momo để quét mã. <br />
            Nội dung CK: <b>{aptInfo.room || "Căn hộ"} T12</b>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={() => setOpenPayment(false)}
            color="inherit"
            sx={{ mr: 1 }}
          >
            Để sau
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handlePay}
            startIcon={<ArrowForwardIcon />}
          >
            Đã chuyển khoản
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
