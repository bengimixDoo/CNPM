import React from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MailIcon from "@mui/icons-material/Mail";
import SaveIcon from "@mui/icons-material/Save";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  cardStyle,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BORDER_COLOR,
  PRIMARY_COLOR,
  PRIMARY_HOVER,
  labelStyle,
  inputStyle,
} from "./SettingsStyle";

export default function GeneralTab() {
  return (
    <Paper
      sx={{
        ...cardStyle,
        mt: "-1px",
        borderTopLeftRadius: 0,
        zIndex: 5,
        position: "relative",
      }}
    >
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
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
                width: "100%",
              }}
            >
              {/* Khối văn bản: flexGrow: 1 sẽ chiếm toàn bộ không gian trống ở giữa */}
              <Box sx={{ flexGrow: 1, pr: 2 }}>
                <Typography variant="h6" fontWeight={700} color={TEXT_PRIMARY}>
                  Thông tin cá nhân
                </Typography>
                <Typography variant="body2" color={TEXT_SECONDARY}>
                  Cập nhật thông tin liên hệ hiển thị của bạn.
                </Typography>
              </Box>

              {/* Khối chứa nút: flexShrink: 0 để đảm bảo nút không bị bóp méo khi màn hình nhỏ */}
              <Box sx={{ flexShrink: 0 }}>
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
