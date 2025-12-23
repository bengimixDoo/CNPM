import React, { useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
    Box, Paper, Typography, Chip, Button, TextField, FormControl,
    InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent,
    DialogActions, Divider, Grid
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";

// Dữ liệu mẫu
const initialRows = [
    { id: 1, code: "INV-2025-001", apartment: "A1-1203", owner: "Nguyễn Văn An", amount: 2450000, date: "2025-01-05", status: "Đã thanh toán" },
    { id: 2, code: "INV-2025-002", apartment: "B2-0508", owner: "Trần Thị B", amount: 800000, date: "2025-01-05", status: "Chưa thanh toán" },
    { id: 3, code: "INV-2025-003", apartment: "C1-1010", owner: "Lê Văn C", amount: 1200000, date: "2025-01-04", status: "Quá hạn" },
    { id: 4, code: "INV-2025-004", apartment: "A2-0702", owner: "Phạm Thị D", amount: 500000, date: "2025-01-03", status: "Đã thanh toán" },
    { id: 5, code: "INV-2025-005", apartment: "B1-0909", owner: "Hoàng Văn E", amount: 3000000, date: "2025-01-01", status: "Hủy bỏ" },
];

export default function Invoices() {
    const [rows] = useState(initialRows);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Helper màu sắc trạng thái
    const getStatusChip = (status) => {
        let color = "default";
        if (status === "Đã thanh toán") color = "success";
        if (status === "Chưa thanh toán") color = "warning";
        if (status === "Quá hạn") color = "error";
        return <Chip label={status} color={color} size="small" variant={status === "Chưa thanh toán" ? "outlined" : "filled"} />;
    };

    // Mở xem chi tiết
    const handleView = (row) => {
        setSelectedInvoice(row);
        setOpenDetail(true);
    };

    const columns = [
        { field: "code", headerName: "Mã Hóa đơn", width: 150, headerAlign: "center", align: "center" },
        { field: "apartment", headerName: "Căn hộ", width: 120, align: "center" },
        { field: "owner", headerName: "Chủ hộ", width: 180 },
        {
            field: "amount",
            headerName: "Tổng tiền",
            width: 150,
            align: "right",
            headerAlign: "right",
            valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString('vi-VN') + " đ";
            }

        },
        { field: "date", headerName: "Ngày tạo", width: 120, align: "center" },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 160,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => getStatusChip(params.value)
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Thao tác",
            width: 120,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="Xem"
                    onClick={() => handleView(params.row)}
                    key="view"
                />,
                <GridActionsCellItem
                    icon={<PrintIcon />}
                    label="In"
                    onClick={() => alert("Đang gửi lệnh in...")}
                    key="print"
                />,
            ],
        },
    ];

    return (
        <div className="workspace-container">
            {/* 1. Header & Filter */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <TextField size="small" placeholder="Tìm mã hóa đơn, căn hộ..." sx={{ width: 250 }} />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select defaultValue="all" label="Trạng thái">
                        <MenuItem value="all">Tất cả</MenuItem>
                        <MenuItem value="paid">Đã thanh toán</MenuItem>
                        <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
                    </Select>
                </FormControl>
                <TextField type="date" size="small" label="Từ ngày" InputLabelProps={{ shrink: true }} />
                <TextField type="date" size="small" label="Đến ngày" InputLabelProps={{ shrink: true }} />

                <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                    <Button variant="outlined" startIcon={<DownloadIcon />}>Xuất Excel</Button>
                    <Button variant="contained" startIcon={<FilterListIcon />} sx={{ bgcolor: "var(--blue)" }}>Lọc</Button>
                </Box>
            </Paper>

            {/* 2. DataGrid */}
            <Paper sx={{ height: 500, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{ border: "none" }}
                />
            </Paper>

            {/* 3. Dialog Xem chi tiết hóa đơn */}
            <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Chi tiết Hóa đơn</span>
                    {selectedInvoice && <Chip label={selectedInvoice.status} size="small" />}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    {selectedInvoice && (
                        <Box>
                            <Box textAlign="center" mb={3}>
                                <Typography variant="h5" fontWeight={700} color="primary">BLUEMOON TOWER</Typography>
                                <Typography variant="body2" color="textSecondary">Hóa đơn tiền dịch vụ tháng 01/2025</Typography>
                            </Box>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}><Typography color="textSecondary">Mã hóa đơn:</Typography></Grid>
                                <Grid item xs={6} textAlign="right"><Typography fontWeight={600}>{selectedInvoice.code}</Typography></Grid>

                                <Grid item xs={6}><Typography color="textSecondary">Căn hộ:</Typography></Grid>
                                <Grid item xs={6} textAlign="right"><Typography fontWeight={600}>{selectedInvoice.apartment}</Typography></Grid>

                                <Grid item xs={6}><Typography color="textSecondary">Chủ hộ:</Typography></Grid>
                                <Grid item xs={6} textAlign="right"><Typography fontWeight={600}>{selectedInvoice.owner}</Typography></Grid>

                                <Grid item xs={6}><Typography color="textSecondary">Ngày tạo:</Typography></Grid>
                                <Grid item xs={6} textAlign="right"><Typography>{selectedInvoice.date}</Typography></Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}><Typography variant="h6">Tổng cộng:</Typography></Grid>
                                <Grid item xs={6} textAlign="right">
                                    <Typography variant="h6" color="error">
                                        {/* Kiểm tra an toàn ở đây nữa */}
                                        {(selectedInvoice.amount || 0).toLocaleString('vi-VN')} đ
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDetail(false)} color="inherit">Đóng</Button>
                    <Button variant="contained" startIcon={<PrintIcon />}>In ngay</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}