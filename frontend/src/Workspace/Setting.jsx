import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Switch,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Checkbox,
  Chip,
  Fade,
  Container,
  InputAdornment,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SecurityIcon from "@mui/icons-material/Security";
import TuneIcon from "@mui/icons-material/Tune";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import HistoryIcon from "@mui/icons-material/History";
import MailIcon from "@mui/icons-material/Mail";
import SmsIcon from "@mui/icons-material/Sms";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveIcon from "@mui/icons-material/Remove";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SaveIcon from "@mui/icons-material/Save";
import PaymentsIcon from "@mui/icons-material/Payments";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CalculateIcon from "@mui/icons-material/Calculate";
import BadgeIcon from "@mui/icons-material/Badge";
import LanguageIcon from "@mui/icons-material/Language";
import PaletteIcon from "@mui/icons-material/Palette";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import VerifiedIcon from "@mui/icons-material/Verified";

// --- CONSTANTS & STYLES ---
const PRIMARY_COLOR = "#2563eb"; // Blue-600
const PRIMARY_HOVER = "#1d4ed8"; // Blue-700
const BG_COLOR = "#f1f5f9"; // Slate-100
const TEXT_PRIMARY = "#0f172a"; // Slate-900
const TEXT_SECONDARY = "#64748b"; // Slate-500
const BORDER_COLOR = "#e2e8f0"; // Slate-200

// Common Styles mimicking Tailwind classes
const cardStyle = {
  borderRadius: "16px",
  boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)", // shadow-soft
  border: `1px solid ${BORDER_COLOR}`,
  bgcolor: "white",
  p: { xs: 3, md: 5 },
  height: "100%",
  transition: "all 0.3s ease",
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#f8fafc", // slate-50
    borderRadius: "8px",
    "& fieldset": { borderColor: "#cbd5e1" }, // slate-300
    "&:hover fieldset": { borderColor: "#94a3b8" }, // slate-400
    "&.Mui-focused fieldset": { borderColor: PRIMARY_COLOR, borderWidth: 2 },
    "& input": {
      py: 1.5,
      px: 2,
      fontSize: "0.875rem",
      color: TEXT_PRIMARY,
      fontWeight: 500,
    },
  },
};

const labelStyle = {
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "#334155", // slate-700
  mb: 1,
  display: "block",
};

// --- SUB-COMPONENTS ---

function NavTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { label: "Thông tin chung", icon: <PersonIcon />, id: "general" },
    { label: "Thông báo", icon: <NotificationsActiveIcon />, id: "notifications" },
    { label: "Phân quyền", icon: <SecurityIcon />, id: "permissions" },
    { label: "Cấu hình", icon: <TuneIcon />, id: "config" },
  ];

  return (
    <Box sx={{ mb: 0 }}>
      {/* Container for tabs and line */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          position: "relative", // Ensure z-index works
          zIndex: 10, // Sit on top of card
        }}
      >
        {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
                <Box
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        px: 3,
                        py: 2,
                        cursor: "pointer",
                        bgcolor: isActive ? "white" : "transparent",
                        color: isActive ? PRIMARY_COLOR : TEXT_SECONDARY,
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "0.875rem",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        borderTop: isActive ? `1px solid ${BORDER_COLOR}` : "none",
                        borderLeft: isActive ? `1px solid ${BORDER_COLOR}` : "none",
                        borderRight: isActive ? `1px solid ${BORDER_COLOR}` : "none",
                        borderBottom: isActive ? "1px solid white" : `1px solid ${BORDER_COLOR}`,
                        mb: "-1px", // Push down to overlap line
                        position: "relative",
                        transition: "all 0.2s",
                        "&:hover": {
                            bgcolor: !isActive ? "#f8fafc" : undefined,
                            color: !isActive ? "#334155" : undefined,
                        },
                    }}
                >
                    {React.cloneElement(tab.icon, { sx: { fontSize: 20 } })}
                    {tab.label}
                    {isActive && (
                         <Box sx={{position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, bgcolor: 'white'}} />
                    )}
                </Box>
            )
        })}
        <Box
          sx={{
            flex: 1,
            borderBottom: `1px solid ${BORDER_COLOR}`,
            height: "43px",
          }}
        />
      </Box>
    </Box>
  );
}

function GeneralTab() {
  return (

      <Paper sx={{ ...cardStyle, mt: "-1px", borderTopLeftRadius: 0, zIndex: 5, position: 'relative' }}>
        <Grid container spacing={5}>
          {/* Left Column: Avatar */}
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                bgcolor: "#f8fafc",
                borderRadius: "16px",
                border: `1px solid ${BORDER_COLOR}`,
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                "&:hover": { boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
                transition: "all 0.3s",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 112,
                  background:
                    "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
                }}
              />
              <Box sx={{ position: "relative", zIndex: 10, mt: 4 }}>
                <Avatar
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbp2b1OpKJlgfwnno0USrYl6xZBLud1GQIeIt6iS0FFSXxWVLCA6OrnT7J1Vosuy1k72A1okmNKzIaCjfOxaz2KDXrScxhQ8mEyTEM_-2LVhNoIxw7De8SYdonnJVy7WAsI23dN0IdFrqqm7LqSprJ1D3VX_biuXCW5aWedlMHXfLCZHR07jhglU00tDOdFMqQDdx2k60ic0NeU80e5To6p0obC6xMt1mn80dEL_yt6OmEETup5-VTzsXL2_6B4Wa6Zc8ByfxVYKQ"
                  sx={{
                    width: 144,
                    height: 144,
                    border: "4px solid white",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    bgcolor: "#22c55e",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "3px solid white",
                  }}
                />
              </Box>
              <Box sx={{ zIndex: 10, mt: 2 }}>
                <Typography variant="h6" fontWeight={700} color={TEXT_PRIMARY}>
                  Nguyễn Văn A
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={0.5}
                  mt={0.5}
                >
                  <VerifiedIcon sx={{ fontSize: 18, color: PRIMARY_COLOR }} />
                  <Typography
                    variant="body2"
                    color={TEXT_SECONDARY}
                    fontWeight={500}
                  >
                    Quản lý tòa nhà A
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 3,
                    textTransform: "none",
                    color: "#334155",
                    borderColor: BORDER_COLOR,
                    bgcolor: "white",
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: "#f8fafc",
                      borderColor: "#cbd5e1",
                      color: PRIMARY_COLOR,
                    },
                  }}
                >
                  Thay đổi ảnh
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Forms */}
          <Grid item xs={12} lg={8}>
            <Box mb={4}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color={TEXT_PRIMARY}
                  >
                    Thông tin cá nhân
                  </Typography>
                  <Typography variant="body2" color={TEXT_SECONDARY}>
                    Cập nhật thông tin liên hệ hiển thị của bạn.
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: "transparent",
                    "&:hover": { bgcolor: "#eff6ff", color: PRIMARY_COLOR },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={labelStyle}>Họ và tên</Typography>
                  <TextField
                    fullWidth
                    defaultValue="Nguyễn Văn A"
                    sx={inputStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={labelStyle}>Số điện thoại</Typography>
                  <TextField
                    fullWidth
                    defaultValue="0912 345 678"
                    sx={inputStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={labelStyle}>Email</Typography>
                  <TextField
                    fullWidth
                    defaultValue="admin@smartcondo.vn"
                    sx={inputStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailIcon sx={{ color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    bgcolor: PRIMARY_COLOR,
                    "&:hover": { bgcolor: PRIMARY_HOVER },
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    px: 3,
                    py: 1.25,
                    boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
                  }}
                >
                  Lưu thay đổi
                </Button>
              </Box>
            </Box>

            <Box
              sx={{ height: "1px", bgcolor: "#f1f5f9", width: "100%", my: 4 }}
            />

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                color={TEXT_PRIMARY}
                gutterBottom
              >
                Đổi mật khẩu
              </Typography>
              <Typography variant="body2" color={TEXT_SECONDARY} mb={3}>
                Nên sử dụng mật khẩu mạnh để bảo vệ tài khoản.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography sx={labelStyle}>Mật khẩu hiện tại</Typography>
                <TextField
                  fullWidth
                  placeholder="••••••••"
                  type="password"
                  sx={inputStyle}
                />
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={labelStyle}>Mật khẩu mới</Typography>
                  <TextField
                    fullWidth
                    placeholder="Nhập mật khẩu mới"
                    type="password"
                    sx={inputStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={labelStyle}>Xác nhận mật khẩu</Typography>
                  <TextField
                    fullWidth
                    placeholder="Nhập lại mật khẩu"
                    type="password"
                    sx={inputStyle}
                  />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                <Button
                  sx={{
                    textTransform: "none",
                    color: "#475569",
                    fontWeight: 600,
                    "&:hover": { color: TEXT_PRIMARY },
                  }}
                >
                  Hủy bỏ
                </Button>
                <Button
                  sx={{
                    textTransform: "none",
                    bgcolor: "#f1f5f9",
                    color: "#334155",
                    fontWeight: 600,
                    borderRadius: "8px",
                    px: 3,
                    py: 1,
                    border: `1px solid ${BORDER_COLOR}`,
                    "&:hover": { bgcolor: "#e2e8f0" },
                  }}
                >
                  Cập nhật mật khẩu
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
  );
}

function NotificationsTab() {
  return (

      <Paper sx={{ ...cardStyle, mt: "-1px", borderTopLeftRadius: 0, zIndex: 5, position: 'relative' }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={5}
        >
          <Box>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: "#eff6ff",
                  borderRadius: "8px",
                  color: PRIMARY_COLOR,
                  display: "flex",
                }}
              >
                <NotificationsActiveIcon />
              </Box>
              <Typography variant="h6" fontWeight={700} color={TEXT_PRIMARY}>
                Cài đặt thông báo
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color={TEXT_SECONDARY}
              sx={{ ml: 6, mt: 0.5 }}
            >
              Kiểm soát cách bạn nhận thông báo từ hệ thống.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            sx={{
              textTransform: "none",
              color: "#475569",
              borderColor: BORDER_COLOR,
              fontWeight: 600,
              borderRadius: "8px",
              "&:hover": { borderColor: "#cbd5e1" },
            }}
          >
            Lịch sử gửi
          </Button>
        </Box>

        <Grid container spacing={5}>
          {/* Left Column */}
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                bgcolor: "#f8fafc",
                borderRadius: "12px",
                border: `1px solid #f1f5f9`,
                p: 3,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color={TEXT_SECONDARY}
                textTransform="uppercase"
                mb={3}
                letterSpacing={1}
              >
                Kênh thông báo
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                {[
                  {
                    label: "Email",
                    sub: "Gửi tới email đăng ký",
                    icon: <MailIcon sx={{ fontSize: 20 }} />,
                    color: "blue",
                    checked: true,
                  },
                  {
                    label: "SMS",
                    sub: "Tin nhắn văn bản",
                    icon: <SmsIcon sx={{ fontSize: 20 }} />,
                    color: "green",
                    checked: false,
                  },
                  {
                    label: "Nội bộ",
                    sub: "Trên web & ứng dụng",
                    icon: <NotificationsActiveIcon sx={{ fontSize: 20 }} />,
                    color: "purple",
                    checked: true,
                  },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: "white",
                      borderRadius: "8px",
                      border: `1px solid ${BORDER_COLOR}`,
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      "&:hover": {
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "8px",
                          bgcolor:
                            item.color === "blue"
                              ? "#eff6ff"
                              : item.color === "green"
                              ? "#f0fdf4"
                              : "#faf5ff",
                          color:
                            item.color === "blue"
                              ? "#2563eb"
                              : item.color === "green"
                              ? "#16a34a"
                              : "#9333ea",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color={TEXT_PRIMARY}
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="caption" color={TEXT_SECONDARY}>
                          {item.sub}
                        </Typography>
                      </Box>
                    </Box>
                    <Switch defaultChecked={item.checked} size="small" />
                  </Box>
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: "#f8fafc",
                borderRadius: "12px",
                border: `1px solid #f1f5f9`,
                p: 3,
                mt: 4,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color={TEXT_SECONDARY}
                textTransform="uppercase"
                mb={2}
                letterSpacing={1}
              >
                Tần suất gửi
              </Typography>
              <Box>
                <Typography sx={labelStyle}>Tổng hợp thông báo</Typography>
                <Select
                  fullWidth
                  size="small"
                  defaultValue="immediate"
                  sx={{
                    bgcolor: "white",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: BORDER_COLOR,
                    },
                  }}
                >
                  <MenuItem value="immediate">Gửi ngay khi có sự kiện</MenuItem>
                  <MenuItem value="daily">Tổng hợp hàng ngày (Digest)</MenuItem>
                </Select>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "#eff6ff",
                    borderRadius: "8px",
                    border: "1px solid #dbeafe",
                    color: "#1d4ed8",
                    fontSize: "0.75rem",
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-start",
                  }}
                >
                  <Box component="span" sx={{ mt: 0.25 }}>
                    <HistoryIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography
                    variant="caption"
                    color="inherit"
                    sx={{ lineHeight: 1.5 }}
                  >
                    Các thông báo khẩn cấp (như Báo cháy, Sự cố an ninh) sẽ luôn
                    được gửi ngay lập tức bất kể cài đặt này.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Table */}
          <Grid item xs={12} lg={8}>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "12px",
                border: `1px solid ${BORDER_COLOR}`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: `1px solid #f1f5f9`,
                  bgcolor: "#f8fafc",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color={TEXT_PRIMARY}
                    textTransform="uppercase"
                  >
                    Chi tiết loại sự kiện
                  </Typography>
                  <Typography variant="caption" color={TEXT_SECONDARY}>
                    Tùy chỉnh nhận thông báo cho từng loại sự kiện
                  </Typography>
                </Box>
                <Chip
                  icon={
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#22c55e",
                      }}
                    />
                  }
                  label="Đang hoạt động"
                  sx={{
                    bgcolor: "#dcfce7",
                    color: "#15803d",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    height: 28,
                  }}
                />
              </Box>
              <Table>
                <TableHead sx={{ bgcolor: "#f1f5f9" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: TEXT_SECONDARY,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Sự kiện
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: TEXT_SECONDARY,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: TEXT_SECONDARY,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Nội bộ
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: TEXT_SECONDARY,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                      }}
                    >
                      SMS
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Section 1 */}
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    <TableCell colSpan={4} sx={{ py: 1.5 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        color={TEXT_PRIMARY}
                      >
                        <PaymentsIcon sx={{ fontSize: 18 }} />
                        <Typography variant="subtitle2" fontWeight={700}>
                          1. Tài chính & Khoản phí
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  {["Hóa đơn phí hàng tháng", "Nhắc thanh toán quá hạn"].map(
                    (row) => (
                      <TableRow key={row} hover>
                        <TableCell
                          sx={{ color: TEXT_PRIMARY, fontWeight: 500 }}
                        >
                          {row}
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            size="small"
                            defaultChecked
                            sx={{
                              color: "#cbd5e1",
                              "&.Mui-checked": { color: PRIMARY_COLOR },
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            size="small"
                            defaultChecked
                            sx={{
                              color: "#cbd5e1",
                              "&.Mui-checked": { color: PRIMARY_COLOR },
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            size="small"
                            sx={{
                              color: "#cbd5e1",
                              "&.Mui-checked": { color: PRIMARY_COLOR },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}

                  {/* Section 2 */}
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    <TableCell colSpan={4} sx={{ py: 1.5 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        color={TEXT_PRIMARY}
                      >
                        <FamilyRestroomIcon sx={{ fontSize: 18 }} />
                        <Typography variant="subtitle2" fontWeight={700}>
                          2. Biến động nhân khẩu
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell sx={{ color: TEXT_PRIMARY, fontWeight: 500 }}>
                      Đăng ký tạm trú / tạm vắng
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        size="small"
                        defaultChecked
                        sx={{
                          color: "#cbd5e1",
                          "&.Mui-checked": { color: PRIMARY_COLOR },
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        size="small"
                        defaultChecked
                        sx={{
                          color: "#cbd5e1",
                          "&.Mui-checked": { color: PRIMARY_COLOR },
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        size="small"
                        disabled
                        checked
                        sx={{
                          color: "#cbd5e1",
                          bgcolor: "#f1f5f9",
                          borderRadius: "4px",
                          p: 0,
                          m: 1,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </Paper>
  );
}

function PermissionsTab() {
  return (

      <Paper sx={{ ...cardStyle, mt: "-1px", borderTopLeftRadius: 0, zIndex: 5, position: 'relative' }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                p: 1,
                bgcolor: "#e0e7ff",
                borderRadius: "8px",
                color: "#4f46e5",
                display: "flex",
              }}
            >
              <SecurityIcon />
            </Box>
            <Typography variant="h6" fontWeight={700} color={TEXT_PRIMARY}>
              Phân quyền truy cập
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={
              <Box component="span" sx={{ fontSize: 20, display: "flex" }}>
                +
              </Box>
            }
            sx={{
              bgcolor: PRIMARY_COLOR,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              "&:hover": { bgcolor: PRIMARY_HOVER },
              boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
            }}
          >
            Thêm vai trò mới
          </Button>
        </Box>

        <Box
          sx={{
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell
                  sx={{
                    p: 2.5,
                    fontWeight: 700,
                    color: TEXT_SECONDARY,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: 0.5,
                  }}
                >
                  Vai trò
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    p: 2.5,
                    fontWeight: 700,
                    color: TEXT_SECONDARY,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: 0.5,
                  }}
                >
                  Quản lý Cư dân
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    p: 2.5,
                    fontWeight: 700,
                    color: TEXT_SECONDARY,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: 0.5,
                  }}
                >
                  Tài chính
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    p: 2.5,
                    fontWeight: 700,
                    color: TEXT_SECONDARY,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: 0.5,
                  }}
                >
                  Hệ thống
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    p: 2.5,
                    fontWeight: 700,
                    color: TEXT_SECONDARY,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: 0.5,
                  }}
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                {
                  role: "Admin",
                  sub: "Quyền cao nhất",
                  icon: <AdminPanelSettingsIcon />,
                  color: "red",
                  pce: true,
                  pfi: true,
                  psy: true,
                },
                {
                  role: "Kế toán",
                  sub: "Quản lý thu chi",
                  icon: <CalculateIcon />,
                  color: "blue",
                  pce: false,
                  pfi: true,
                  psy: false,
                },
                {
                  role: "Nhân viên",
                  sub: "Vận hành cơ bản",
                  icon: <BadgeIcon />,
                  color: "yellow",
                  pce: true,
                  pfi: false,
                  psy: false,
                },
              ].map((item, idx) => (
                <TableRow key={idx} hover>
                  <TableCell sx={{ p: 2.5 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          bgcolor:
                            item.color === "red"
                              ? "#fee2e2"
                              : item.color === "blue"
                              ? "#dbeafe"
                              : "#fef3c7",
                          color:
                            item.color === "red"
                              ? "#dc2626"
                              : item.color === "blue"
                              ? "#2563eb"
                              : "#d97706",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {React.cloneElement(item.icon, { fontSize: "small" })}
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color={TEXT_PRIMARY}
                        >
                          {item.role}
                        </Typography>
                        <Typography variant="caption" color={TEXT_SECONDARY}>
                          {item.sub}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {item.pce ? (
                      <CheckCircleIcon
                        sx={{
                          color: "#22c55e",
                          bgcolor: "#f0fdf4",
                          borderRadius: "50%",
                          p: 0.25,
                        }}
                      />
                    ) : (
                      <RemoveIcon sx={{ color: "#cbd5e1" }} />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {item.pfi ? (
                      <CheckCircleIcon
                        sx={{
                          color: "#22c55e",
                          bgcolor: "#f0fdf4",
                          borderRadius: "50%",
                          p: 0.25,
                        }}
                      />
                    ) : (
                      <RemoveIcon sx={{ color: "#cbd5e1" }} />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {item.psy ? (
                      <CheckCircleIcon
                        sx={{
                          color: "#22c55e",
                          bgcolor: "#f0fdf4",
                          borderRadius: "50%",
                          p: 0.25,
                        }}
                      />
                    ) : (
                      <RemoveIcon sx={{ color: "#cbd5e1" }} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <MoreHorizIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
  );
}

function ConfigTab() {
  return (

      <Paper sx={{ ...cardStyle, mt: "-1px", borderTopLeftRadius: 0, zIndex: 5, position: 'relative' }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={4}>
          <Box
            sx={{
              p: 1,
              bgcolor: "#ffedd5",
              borderRadius: "8px",
              color: "#ea580c",
              display: "flex",
            }}
          >
            <TuneIcon />
          </Box>
          <Typography variant="h6" fontWeight={700} color={TEXT_PRIMARY}>
            Cấu hình chung
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: "#f8fafc",
                borderRadius: "12px",
                border: `1px solid ${BORDER_COLOR}`,
                p: 4,
                height: "100%",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#cbd5e1" },
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color={TEXT_PRIMARY}
                mb={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                <LanguageIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                Ngôn ngữ & Khu vực
              </Typography>

              <Box display="flex" flexDirection="column" gap={3}>
                <Box>
                  <Typography sx={labelStyle}>Ngôn ngữ hiển thị</Typography>
                  <Select
                    fullWidth
                    size="small"
                    defaultValue="vi"
                    sx={{
                      bgcolor: "white",
                      "& fieldset": { borderColor: BORDER_COLOR },
                      fontWeight: 500,
                    }}
                  >
                    <MenuItem value="vi">Tiếng Việt (Vietnamese)</MenuItem>
                    <MenuItem value="en">Tiếng Anh (English)</MenuItem>
                  </Select>
                </Box>
                <Box>
                  <Typography sx={labelStyle}>Múi giờ</Typography>
                  <Select
                    fullWidth
                    size="small"
                    defaultValue="hcm"
                    sx={{
                      bgcolor: "white",
                      "& fieldset": { borderColor: BORDER_COLOR },
                      fontWeight: 500,
                    }}
                  >
                    <MenuItem value="hcm">
                      (GMT+07:00) Bangkok, Hanoi, Jakarta
                    </MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: "#f8fafc",
                borderRadius: "12px",
                border: `1px solid ${BORDER_COLOR}`,
                p: 4,
                height: "100%",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#cbd5e1" },
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color={TEXT_PRIMARY}
                mb={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                <PaletteIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                Giao diện
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    bgcolor: "white",
                    borderRadius: "8px",
                    border: `1px solid ${BORDER_COLOR}`,
                    boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      sx={{
                        p: 0.75,
                        bgcolor: "#f1f5f9",
                        borderRadius: "6px",
                        color: "#475569",
                      }}
                    >
                      <DarkModeIcon fontSize="small" />
                    </Box>
                    <Typography
                      fontWeight={600}
                      fontSize="0.875rem"
                      color={TEXT_PRIMARY}
                    >
                      Chế độ tối
                    </Typography>
                  </Box>
                  <Switch size="small" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    bgcolor: "white",
                    borderRadius: "8px",
                    border: `1px solid ${BORDER_COLOR}`,
                    boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      sx={{
                        p: 0.75,
                        bgcolor: "#f1f5f9",
                        borderRadius: "6px",
                        color: "#475569",
                      }}
                    >
                      <FirstPageIcon fontSize="small" />
                    </Box>
                    <Typography
                      fontWeight={600}
                      fontSize="0.875rem"
                      color={TEXT_PRIMARY}
                    >
                      Thu gọn Menu
                    </Typography>
                  </Box>
                  <Switch size="small" />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
  );
}

// --- MAIN PAGE ---
export default function Setting() {
  const [activeTab, setActiveTab] = useState("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralTab />;
      case "notifications":
        return <NotificationsTab />;
      case "permissions":
        return <PermissionsTab />;
      case "config":
        return <ConfigTab />;
      default:
        return <GeneralTab />;
    }
  };

  return (
    <Box sx={{ width: "100%", bgcolor: BG_COLOR, minHeight: "100vh"}}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 } }}>
        <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <Box sx={{ position: "relative", minHeight: 200 }}>
             <Fade in={true} key={activeTab} timeout={300}>
                <div>{renderContent()}</div>
             </Fade>
        </Box>
      </Box>
    </Box>
  );
}
