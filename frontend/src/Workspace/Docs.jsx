import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Tab,
  Tabs,
  InputAdornment,
  TextField,
  Avatar,
  Fade,
  Card,
  Grid,
  Tooltip,
} from "@mui/material";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import ImageIcon from "@mui/icons-material/Image";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FilterListIcon from "@mui/icons-material/FilterList";
import StatCard from "../components/StatCard.jsx";

// Constants for Design
const ACCENT_COLOR = "#4e3ae9";
const ACCENT_GRADIENT = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
const CARD_SHADOW =
  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";

// Helper: Get Icon for file type
const getFileIcon = (type) => {
  switch (type) {
    case "pdf":
      return <PictureAsPdfIcon sx={{ color: "#ef4444", fontSize: 28 }} />;
    case "doc":
    case "docx":
      return <ArticleIcon sx={{ color: "#3b82f6", fontSize: 28 }} />;
    case "img":
    case "jpg":
    case "png":
      return <ImageIcon sx={{ color: "#10b981", fontSize: 28 }} />;
    default:
      return <InsertDriveFileIcon sx={{ color: "#94a3b8", fontSize: 28 }} />;
  }
};

const initialDocs = [
  {
    id: 1,
    name: "Noi_quy_toa_nha_2025.pdf",
    type: "pdf",
    size: "2.5 MB",
    category: "Quy định",
    date: "2025-01-01",
    author: "Ban Quản Lý",
  },
  {
    id: 2,
    name: "Mau_hop_dong_thue_nha.docx",
    type: "doc",
    size: "1.2 MB",
    category: "Biểu mẫu",
    date: "2024-12-20",
    author: "Hành chính",
  },
  {
    id: 3,
    name: "Thong_bao_pccc_thang_12.pdf",
    type: "pdf",
    size: "500 KB",
    category: "Thông báo",
    date: "2024-12-15",
    author: "Kỹ thuật",
  },
  {
    id: 4,
    name: "Anh_su_co_thang_may.jpg",
    type: "img",
    size: "3.1 MB",
    category: "Báo cáo",
    date: "2024-12-10",
    author: "Bảo vệ",
  },
  {
    id: 5,
    name: "Quy_trinh_bao_tri_dieu_hoa.pdf",
    type: "pdf",
    size: "1.8 MB",
    category: "Kỹ thuật",
    date: "2024-11-30",
    author: "Kỹ thuật",
  },
];

export default function Docs() {
  const [docs, setDocs] = useState(initialDocs);
  const [tabValue, setTabValue] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    if (window.confirm("Xóa tài liệu này?")) {
      setDocs(docs.filter((d) => d.id !== id));
    }
  };

  const filteredDocs = docs.filter((d) => {
    const matchesTab = tabValue === "all" || d.category === tabValue;
    const matchesSearch = d.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <Box className="workspace-container">
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: CARD_SHADOW,
          bgcolor: "white",
        }}
      >
        <Box sx={{ mb: 4, textAlign: "center", marginTop: "20px" }}>
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              background: ACCENT_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
              display: "inline-block",
              fontFamily: "inner",
            }}
          >
            Tài liệu quản lý chung cư
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ fontFamily: "inner" }}
          >
            Kho lưu trữ tập trung các văn bản, quy định và biểu mẫu quan trọng
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid #f1f5f9",
            bgcolor: "#ffffff"
          }}
        >
          {/* Search Bar - Optimized */}
          <TextField
            size="small"
            placeholder="Tìm kiếm tài liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flexGrow: 1,
              width: { xs: "100%", md: "auto" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "#f8fafc",
                transition: "all 0.2s",
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover fieldset": { borderColor: "#cbd5e1" },
                "&.Mui-focused": {
                  bgcolor: "white",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  "& fieldset": { borderColor: ACCENT_COLOR },
                },
              },
            }}
          />

          {/* Upload Button */}
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{
              background: ACCENT_GRADIENT,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              height: 40,
              px: 3,
              py: 2,
              boxShadow: "0 4px 12px rgba(118, 75, 162, 0.3)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 6px 16px rgba(118, 75, 162, 0.4)",
              },
            }}
          >
            Tải lên
          </Button>
        </Box>

        {/* Categories Tabs */}
        <Box sx={{ borderBottom: "1px solid #f1f5f9" }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 48,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "#64748b",
                mr: 2,
                minHeight: 48,
                transition: "color 0.2s",
                "&:hover": { color: "#334155" },
                "&.Mui-selected": { color: ACCENT_COLOR },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: ACCENT_COLOR,
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab label="Tất cả" value="all" sx={{ width: "163px" }} />
            <Tab label="Quy định" value="Quy định" sx={{ width: "163px" }} />
            <Tab label="Biểu mẫu" value="Biểu mẫu" sx={{ width: "163px" }} />
            <Tab label="Thông báo" value="Thông báo" sx={{ width: "163px" }} />
            <Tab label="Báo cáo" value="Báo cáo" sx={{ width: "163px" }} />
            <Tab label="Kỹ thuật" value="Kỹ thuật" sx={{ width: "163px" }} />
          </Tabs>
        </Box>

        {/* Document Table */}
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F8FAFC" }}>
              <TableCell sx={{ fontWeight: 600, color: "#64748b", py: 2 }}>
                Tên tài liệu
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748b", py: 2 }}>
                Người tải lên
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748b", py: 2 }}>
                Phân loại
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748b", py: 2 }}>
                Kích thước
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748b", py: 2 }}>
                Ngày tải lên
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: "#64748b", py: 2 }}
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocs.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  transition: "background-color 0.2s",
                  "&:hover": { bgcolor: "#f1f5f9" },
                  "& td": { borderBottom: "1px solid #f1f5f9" },
                }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.2,
                        borderRadius: "12px",
                        bgcolor: "white",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      }}
                    >
                      {getFileIcon(row.type)}
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ color: "#334155", fontSize: "0.95rem" }}
                      >
                        {row.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: ACCENT_COLOR,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {row.author.charAt(0)}
                    </Avatar>
                    <Typography
                      variant="body2"
                      color="#475467"
                      fontWeight={500}
                    >
                      {row.author}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.category}
                    size="small"
                    sx={{
                      bgcolor: "#eff6ff",
                      color: "#3b82f6",
                      fontWeight: 600,
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontSize: "0.875rem" }}>
                  {row.size}
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontSize: "0.875rem" }}>
                  {row.date}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "inline-flex", gap: 1 }}>
                    <Tooltip title="Tải xuống">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#64748b",
                          "&:hover": {
                            color: ACCENT_COLOR,
                            bgcolor: "#eff6ff",
                          },
                        }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa tài liệu">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(row.id)}
                        sx={{
                          color: "#64748b",
                          "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small" sx={{ color: "#94a3b8" }}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filteredDocs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#f1f5f9",
                        borderRadius: "50%",
                        mb: 1,
                      }}
                    >
                      <SearchIcon sx={{ fontSize: 40, color: "#94a3b8" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      color="text.primary"
                      fontWeight={600}
                    >
                      Không tìm thấy tài liệu
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc của bạn.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
