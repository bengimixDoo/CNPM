import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CalculateIcon from "@mui/icons-material/Calculate";
import BadgeIcon from "@mui/icons-material/Badge";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import {
  cardStyle,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BORDER_COLOR,
  PRIMARY_COLOR,
  inputStyle,
} from "./SettingsStyle";

export default function PermissionsTab() {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Quản trị viên",
      status: "Active",
      email: "admin@smartcondo.vn",
      lastActive: "2 phút trước",
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 18, color: "#4f46e5" }} />,
      color: "#4f46e5",
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Kế toán",
      status: "Active",
      email: "ketoan@smartcondo.vn",
      lastActive: "1 giờ trước",
      icon: <CalculateIcon sx={{ fontSize: 18, color: "#0891b2" }} />,
      color: "#0891b2",
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Nhân viên an ninh",
      status: "Inactive",
      email: "security@smartcondo.vn",
      lastActive: "3 ngày trước",
      icon: <BadgeIcon sx={{ fontSize: 18, color: "#059669" }} />,
      color: "#059669",
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        alignItems="flex-start"
        mb={5}
        flexDirection={{ xs: "column", md: "row" }}
        gap={3}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#e0e7ff",
              borderRadius: "12px",
              color: "#4f46e5",
              display: "flex",
              boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.1)",
            }}
          >
            <SecurityIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} color={TEXT_PRIMARY}>
              Quản lý phân quyền
            </Typography>
            <Typography variant="body2" color={TEXT_SECONDARY}>
              Quản lý danh sách người dùng và quyền truy cập hệ thống.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#4f46e5",
            "&:hover": {
              bgcolor: "#4338ca",
              boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
            },
            textTransform: "none",
            borderRadius: "10px",
            px: 3,
            py: 1.25,
            fontWeight: 700,
            boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
          }}
        >
          Thêm người dùng
        </Button>
      </Box>

      {/* Toolbar */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          bgcolor: "#f8fafc",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Tìm kiếm người dùng..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            ...inputStyle,
            minWidth: 300,
            bgcolor: "white",
            borderRadius: "8px",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <Box display="flex" gap={1.5}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{
              textTransform: "none",
              color: "#475569",
              borderColor: BORDER_COLOR,
              fontWeight: 600,
              borderRadius: "8px",
              bgcolor: "white",
              "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f1f5f9" },
            }}
          >
            Bộ lọc
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          border: `1px solid ${BORDER_COLOR}`,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: TEXT_SECONDARY,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  py: 2,
                }}
              >
                NGƯỜI DÙNG
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: TEXT_SECONDARY,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  py: 2,
                }}
              >
                VAI TRÒ & HOẠT ĐỘNG
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: TEXT_SECONDARY,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  py: 2,
                }}
              >
                TRẠNG THÁI
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: TEXT_SECONDARY,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  py: 2,
                }}
              >
                THAO TÁC
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{ "&:last-child td": { border: 0 } }}
              >
                <TableCell sx={{ py: 2.5 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: "#eef2ff",
                        color: "#4f46e5",
                        width: 44,
                        height: 44,
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        border: "2px solid white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      {user.name.split(" ").slice(-1)[0][0]}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={800}
                        color={TEXT_PRIMARY}
                      >
                        {user.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={TEXT_SECONDARY}
                        sx={{ display: "block" }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 2.5 }}>
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {user.icon}
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={TEXT_PRIMARY}
                      >
                        {user.role}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color={TEXT_SECONDARY}>
                      Hoạt động: {user.lastActive}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 2.5 }}>
                  <Chip
                    size="small"
                    label={user.status}
                    sx={{
                      bgcolor: user.status === "Active" ? "#dcfce7" : "#fee2e2",
                      color: user.status === "Active" ? "#15803d" : "#b91c1c",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                      height: 24,
                      borderRadius: "6px",
                    }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ py: 2.5 }}>
                  <Box display="flex" justifyContent="flex-end" gap={0.5}>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#64748b",
                          "&:hover": {
                            bgcolor: "#f1f5f9",
                            color: PRIMARY_COLOR,
                          },
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#64748b",
                          "&:hover": { bgcolor: "#fef2f2", color: "#ef4444" },
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small">
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
