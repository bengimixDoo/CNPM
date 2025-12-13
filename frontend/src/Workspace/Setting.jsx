import React, { useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Avatar,
  Grid,
  Typography,
  Divider,
  Card,
  CardContent,
} from "@mui/material";

// Icons
import PersonOutlineIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import EditIcon from "@mui/icons-material/Edit";

const ACCENT_COLOR = "#6c5ce7";
const INPUT_BG = "#f5f7f9";

// =================================================================
// COMPONENT: NỘI DUNG TAB THÔNG TIN CHUNG & BẢO MẬT
// =================================================================

function ProfileSecurityTab({
  profileData,
  passwordData,
  handleProfileChange,
  handlePasswordChange,
  handleSaveProfile,
  handleUpdatePassword,
  handleCancel,
}) {
  return (
    <Box>
      {/* PROFILE HEADER (Tích hợp vào Tab) */}
      <Card
        sx={{
          p: 2,
          mb: 4,
          display: "flex",
          alignItems: "center",
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mr: 3,
            bgcolor: ACCENT_COLOR,
            fontSize: "2rem",
          }}
        >
          NV
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {profileData.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Quản lý tòa nhà A
          </Typography>
          <Button
            variant="text"
            size="small"
            startIcon={<EditIcon />}
            sx={{
              color: ACCENT_COLOR,
              textTransform: "none",
              fontSize: "13px",
              mt: 1,
            }}
          >
            Thay đổi ảnh đại diện
          </Button>
        </Box>
      </Card>

      {/* 1. Personal Info Section */}
      <Paper elevation={1} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: ACCENT_COLOR }}
        >
          <PersonOutlineIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Thông
          tin cá nhân
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Họ và tên */}
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ color: "#333", mb: 0.5 }}>
              Họ và tên
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={profileData.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              variant="outlined"
              InputProps={{
                style: { backgroundColor: INPUT_BG, borderRadius: "8px" },
              }}
            />
          </Grid>

          {/* Số điện thoại */}
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ color: "#333", mb: 0.5 }}>
              Số điện thoại
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={profileData.phone}
              onChange={(e) => handleProfileChange("phone", e.target.value)}
              variant="outlined"
              InputProps={{
                style: { backgroundColor: INPUT_BG, borderRadius: "8px" },
              }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <Typography variant="caption" sx={{ color: "#333", mb: 0.5 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={profileData.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              variant="outlined"
              InputProps={{
                style: { backgroundColor: INPUT_BG, borderRadius: "8px" },
              }}
            />
          </Grid>

          {/* Nút Lưu */}
          <Grid item xs={12} sx={{ textAlign: "right", mt: 1 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: ACCENT_COLOR,
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": { backgroundColor: ACCENT_COLOR },
              }}
              onClick={handleSaveProfile}
            >
              Lưu thay đổi
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. Change Password Section */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: ACCENT_COLOR }}
        >
          <LockOutlinedIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Đổi mật
          khẩu
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Mật khẩu hiện tại */}
          <Grid item xs={12}>
            <Typography variant="caption" sx={{ color: "#333", mb: 0.5 }}>
              Mật khẩu hiện tại
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                handlePasswordChange("currentPassword", e.target.value)
              }
              variant="outlined"
              InputProps={{
                style: { backgroundColor: INPUT_BG, borderRadius: "8px" },
              }}
            />
          </Grid>

          {/* Mật khẩu mới */}
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ color: "#333", mb: 0.5 }}>
              Mật khẩu mới
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={passwordData.newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
              variant="outlined"
              InputProps={{
                style: { backgroundColor: INPUT_BG, borderRadius: "8px" },
              }}
            />
          </Grid>

          {/* Xác nhận mật khẩu */}
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ color: "#333", mb: 0.5 }}>
              Xác nhận mật khẩu
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                handlePasswordChange("confirmPassword", e.target.value)
              }
              variant="outlined"
              InputProps={{
                style: { backgroundColor: INPUT_BG, borderRadius: "8px" },
              }}
            />
          </Grid>

          {/* Nút Cập nhật */}
          <Grid item xs={12} sx={{ textAlign: "right", mt: 1 }}>
            <Button
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: "8px", mr: 1 }}
              onClick={handleCancel}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: ACCENT_COLOR,
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": { backgroundColor: ACCENT_COLOR },
              }}
              onClick={handleUpdatePassword}
            >
              Cập nhật mật khẩu
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

// =================================================================
// COMPONENT: USER SETTINGS PAGE (GỐC)
// =================================================================

export default function UserSettingsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    name: "Nguyễn Văn A",
    phone: "0912 345 678",
    email: "admin@smartcondo.vn",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };
  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    alert("Lưu thay đổi thành công!");
  };
  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    alert("Cập nhật mật khẩu thành công!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  const handleCancel = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Danh sách các Tab
  const tabs = [
    { label: "Thông tin chung", icon: <PersonOutlineIcon /> },
    { label: "Giao diện", icon: <VisibilityOutlinedIcon /> },
    { label: "Thông báo", icon: <NotificationsNoneOutlinedIcon /> },
    { label: "Phân quyền", icon: <VpnKeyOutlinedIcon /> },
    { label: "Cấu hình hệ thống", icon: <SettingsOutlinedIcon /> },
  ];

  return (
    // Bọc nội dung bằng Box (Đây là nội dung sẽ nằm trong AdminBaseLayout)
    <Box sx={{ p: 4, backgroundColor: INPUT_BG }}>
      {/* HEADER TABS NGANG */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textTransform: "none",
                  }}
                >
                  {React.cloneElement(tab.icon, { sx: { mr: 1 } })}
                  {tab.label}
                </Box>
              }
              sx={{
                fontWeight: 600,
                color: tabValue === index ? ACCENT_COLOR : "#666",
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* 2. MAIN CONTENT (Nội dung Tab) */}
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Tab 0: Thông tin chung & Bảo mật (Đã tích hợp Avatar) */}
        {tabValue === 0 && (
          <ProfileSecurityTab
            profileData={profileData}
            passwordData={passwordData}
            handleProfileChange={handleProfileChange}
            handlePasswordChange={handlePasswordChange}
            handleSaveProfile={handleSaveProfile}
            handleUpdatePassword={handleUpdatePassword}
            handleCancel={handleCancel}
          />
        )}

        {/* Tab 1: Giao diện (Thêm phần Ngôn ngữ, Sáng/Tối) */}
        {tabValue === 1 && (
          <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Cài đặt Giao diện
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
              Nội dung cài đặt ngôn ngữ, chế độ sáng/tối và kích thước chữ sẽ
              hiển thị tại đây.
            </Typography>
          </Paper>
        )}

        {/* Các Tab khác */}
        {tabValue > 1 && (
          <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {tabs[tabValue].label}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" color="textSecondary">
              Nội dung cho tab {tabs[tabValue].label} sẽ được phát triển sau.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
