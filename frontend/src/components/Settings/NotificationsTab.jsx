import React from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Switch,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Chip,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import HistoryIcon from "@mui/icons-material/History";
import MailIcon from "@mui/icons-material/Mail";
import SmsIcon from "@mui/icons-material/Sms";
import PaymentsIcon from "@mui/icons-material/Payments";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import {
  cardStyle,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BORDER_COLOR,
  PRIMARY_COLOR,
  labelStyle,
} from "./SettingsStyle";

export default function NotificationsTab() {
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
                      <TableCell sx={{ color: TEXT_PRIMARY, fontWeight: 500 }}>
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
                        2. Cư dân & Cộng đồng
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                {["Đăng ký tạm trú mới", "Phản ánh/Khiếu nại mới"].map(
                  (row) => (
                    <TableRow key={row} hover>
                      <TableCell sx={{ color: TEXT_PRIMARY, fontWeight: 500 }}>
                        {row}
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
              </TableBody>
            </Table>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
