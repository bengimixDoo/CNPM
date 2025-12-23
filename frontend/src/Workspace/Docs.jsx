import React, { useState } from "react";
import {
    Box, Paper, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell,
    IconButton, Chip, Tab, Tabs, InputAdornment, TextField
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import ImageIcon from "@mui/icons-material/Image";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Dữ liệu mẫu
const initialDocs = [
    { id: 1, name: "Noi_quy_toa_nha_2025.pdf", type: "pdf", size: "2.5 MB", category: "Quy định", date: "2025-01-01" },
    { id: 2, name: "Mau_hop_dong_thue_nha.docx", type: "doc", size: "1.2 MB", category: "Biểu mẫu", date: "2024-12-20" },
    { id: 3, name: "Thong_bao_pccc_thang_12.pdf", type: "pdf", size: "500 KB", category: "Thông báo", date: "2024-12-15" },
    { id: 4, name: "Anh_su_co_thang_may.jpg", type: "img", size: "3.1 MB", category: "Báo cáo", date: "2024-12-10" },
    { id: 5, name: "Quy_trinh_bao_tri_dieu_hoa.pdf", type: "pdf", size: "1.8 MB", category: "Kỹ thuật", date: "2024-11-30" },
];

export default function Docs() {
    const [docs, setDocs] = useState(initialDocs);
    const [tabValue, setTabValue] = useState("all");

    // Helper chọn icon theo loại file
    const getFileIcon = (type) => {
        if (type === "pdf") return <PictureAsPdfIcon color="error" />;
        if (type === "doc") return <ArticleIcon color="primary" />;
        if (type === "img") return <ImageIcon color="success" />;
        return <ArticleIcon color="disabled" />;
    };

    const handleDelete = (id) => {
        if (window.confirm("Xóa tài liệu này?")) {
            setDocs(docs.filter(d => d.id !== id));
        }
    };

    // Lọc theo Tab
    const filteredDocs = tabValue === "all" ? docs : docs.filter(d => d.category === tabValue);

    return (
        <div className="workspace-container">
            {/* Header & Upload */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: "var(--accent)" }}>Kho tài liệu</Typography>
                <Button variant="contained" startIcon={<CloudUploadIcon />} sx={{ bgcolor: "var(--blue)" }}>
                    Tải tài liệu lên
                </Button>
            </Box>

            {/* Search & Filter Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 3 }}>
                <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm tài liệu..."
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
                        sx={{ width: 300 }}
                    />
                </Box>
                <Tabs
                    value={tabValue}
                    onChange={(e, v) => setTabValue(v)}
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ borderBottom: "1px solid #eee", px: 2 }}
                >
                    <Tab label="Tất cả" value="all" sx={{ textTransform: "none", fontWeight: 600 }} />
                    <Tab label="Quy định" value="Quy định" sx={{ textTransform: "none", fontWeight: 600 }} />
                    <Tab label="Biểu mẫu" value="Biểu mẫu" sx={{ textTransform: "none", fontWeight: 600 }} />
                    <Tab label="Thông báo" value="Thông báo" sx={{ textTransform: "none", fontWeight: 600 }} />
                </Tabs>

                {/* List Files */}
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#f9fafb" }}>
                            <TableCell>Tên tài liệu</TableCell>
                            <TableCell>Phân loại</TableCell>
                            <TableCell>Kích thước</TableCell>
                            <TableCell>Ngày tải lên</TableCell>
                            <TableCell align="right">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDocs.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell component="th" scope="row" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    {getFileIcon(row.type)}
                                    <Typography variant="body2" fontWeight={500}>{row.name}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={row.category} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell sx={{ color: "gray" }}>{row.size}</TableCell>
                                <TableCell sx={{ color: "gray" }}>{row.date}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" title="Tải xuống"><DownloadIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" title="Xóa" color="error" onClick={() => handleDelete(row.id)}><DeleteIcon fontSize="small" /></IconButton>
                                    <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}