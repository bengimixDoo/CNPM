import React, { useState, useEffect, useMemo } from "react";
import StatCard from "../components/StatCard";
import WarningIcon from "@mui/icons-material/Warning";
import { financeService } from "../api/services";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";

export default function Invoices() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await financeService.getInvoices();
      console.log("Invoice data from API:", data);
      const formattedData = data.map((inv) => ({
        id: inv.ma_hoa_don,
        ma_hoa_don: inv.ma_hoa_don,
        can_ho: inv.can_ho || "N/A",
        thang: inv.thang,
        nam: inv.nam,
        tong_tien: parseFloat(inv.tong_tien) || 0,
        trang_thai: inv.trang_thai === 1 ? "Đã thanh toán" : "Chưa thanh toán",
        ngay_tao: inv.ngay_tao
          ? new Date(inv.ngay_tao).toLocaleDateString("vi-VN")
          : "N/A",
        ngay_thanh_toan: inv.ngay_thanh_toan
          ? new Date(inv.ngay_thanh_toan).toLocaleDateString("vi-VN")
          : "Chưa thanh toán",
        rawData: inv,
      }));
      setRows(formattedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hóa đơn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Helper màu sắc trạng thái
  const getStatusChip = (status) => {
    let color = "default";
    if (status === "Đã thanh toán") color = "success";
    if (status === "Chưa thanh toán") color = "warning";
    return (
      <Chip
        label={status}
        color={color}
        size="small"
        variant={status === "Chưa thanh toán" ? "outlined" : "filled"}
      />
    );
  };

  // Mở xem chi tiết
  const handleView = async (row) => {
    setSelectedInvoice({ ...row, chi_tiet: [] });
    setOpenDetail(true);
    setDetailLoading(true);
    try {
      const detail = await financeService.getInvoiceDetail(row.ma_hoa_don);
      setSelectedInvoice({
        id: detail.ma_hoa_don,
        ma_hoa_don: detail.ma_hoa_don,
        can_ho: detail.can_ho || row.can_ho,
        thang: detail.thang,
        nam: detail.nam,
        tong_tien: parseFloat(detail.tong_tien) || 0,
        trang_thai:
          detail.trang_thai === 1 ? "Đã thanh toán" : "Chưa thanh toán",
        ngay_tao: detail.ngay_tao
          ? new Date(detail.ngay_tao).toLocaleDateString("vi-VN")
          : "N/A",
        ngay_thanh_toan: detail.ngay_thanh_toan
          ? new Date(detail.ngay_thanh_toan).toLocaleDateString("vi-VN")
          : "Chưa thanh toán",
        chi_tiet: detail.chi_tiet || [],
        rawData: detail,
      });
    } catch (error) {
      console.error("Lỗi khi tải chi tiết hóa đơn:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSendNotification = () => {
    alert(
      `Đã gửi thông báo nhắc thanh toán đến căn hộ ${selectedInvoice.can_ho} cho hóa đơn #${selectedInvoice.ma_hoa_don}`
    );
  };

  const columns = [
    {
      field: "ma_hoa_don",
      headerName: "Mã Hóa đơn",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "thang",
      headerName: "Tháng",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nam",
      headerName: "Năm",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tong_tien",
      headerName: "Tổng tiền",
      width: 150,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value) => {
        if (value == null) return "";
        return Number(value).toLocaleString("vi-VN") + " VND";
      },
    },
    {
      field: "trang_thai",
      headerName: "Trạng thái",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: "ngay_tao",
      headerName: "Ngày tạo",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "can_ho",
      headerName: "Căn hộ",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ngay_thanh_toan",
      headerName: "Ngày thanh toán",
      width: 140,
      align: "center",
      headerAlign: "center",
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

  const containerHeight = useMemo(() => {
    const columnHeaderHeight = 56;
    const footerHeight = 52;
    const rowHeight = 52;
    const padding = 16;
    return (
      columnHeaderHeight +
      footerHeight +
      paginationModel.pageSize * rowHeight +
      padding
    );
  }, [paginationModel.pageSize]);

  /* Statistics Logic */
  const stats = useMemo(() => {
    const totalRevenue = rows
      .filter((r) => r.trang_thai === "Đã thanh toán")
      .reduce((sum, r) => sum + r.tong_tien, 0);

    const unpaidCount = rows.filter(
      (r) => r.trang_thai === "Chưa thanh toán"
    ).length;

    const unpaidAmount = rows
      .filter((r) => r.trang_thai === "Chưa thanh toán")
      .reduce((sum, r) => sum + r.tong_tien, 0);

    const totalExpected = totalRevenue + unpaidAmount;
    const collectionRate =
      totalExpected > 0 ? (totalRevenue / totalExpected) * 100 : 0;

    return { totalRevenue, unpaidCount, unpaidAmount, collectionRate };
  }, [rows]);

  return (
    <>
      {/* Stat Cards Row */}
      <div
        className="stats-grid"
        style={{
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        <StatCard
          title="Doanh thu thực tế"
          value={stats.totalRevenue.toLocaleString("vi-VN") + " VND"}
          icon={<AttachMoneyIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-blue)"
          valueFontSize="20px"
        />
        <StatCard
          title="Hóa đơn chưa thu"
          value={stats.unpaidCount}
          icon={<ReceiptLongIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-green)"
        />
        <StatCard
          title="Tổng nợ"
          value={stats.unpaidAmount.toLocaleString("vi-VN") + " VND"}
          icon={<WarningIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-yellow)"
          valueFontSize="20px"
        />
        <StatCard
          title="Tỷ lệ thu hồi"
          value={stats.collectionRate.toFixed(1) + "%"}
          icon={<AttachMoneyIcon sx={{ fontSize: 50 }} />}
          colorBackground="var(--background-red)"
        />
      </div>

      <div className="dashboard-grid">
        <Paper
          sx={{
            p: 2,
            borderRadius: "12px 12px 0 0",
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Tìm mã hóa đơn, căn hộ..."
            sx={{ width: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select defaultValue="all" label="Trạng thái">
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="paid">Đã thanh toán</MenuItem>
              <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="date"
            size="small"
            label="Từ ngày"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            size="small"
            label="Đến ngày"
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button variant="outlined" startIcon={<PrintIcon />}>
              In Hóa đơn
            </Button>
          </Box>
        </Paper>
      </div>
      {/* 2. DataGrid */}
      <Paper
        sx={{
          height: containerHeight,
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{ borderRadius: "0 0 12px 12px" }}
        />
      </Paper>
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
          },
        }}
      >
        {selectedInvoice && (
          <>
            <DialogTitle
              sx={{
                fontWeight: 700,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #f1f5f9",
                padding: "16px 24px",
                background: "linear-gradient(to right, #bcd9f2ff, #f8fafc)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "var(--blue)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <ReceiptLongIcon sx={{ fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, lineHeight: 1.2 }}
                  >
                    Hóa đơn #{selectedInvoice.ma_hoa_don}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tháng {selectedInvoice.thang}/{selectedInvoice.nam}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={() => setOpenDetail(false)}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                    "&:hover": {
                      color: (theme) => theme.palette.grey[900],
                      backgroundColor: "#f1f5f9",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent
              sx={{
                backgroundColor: "#f8fafc",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* Thông tin chung */}
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: "#1e293b" }}
                  >
                    Thông tin chung
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: "1px",
                      backgroundColor: "#e2e8f0",
                      ml: 1,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                  }}
                >
                  {[
                    {
                      label: "Căn hộ",
                      value: selectedInvoice.can_ho,
                      icon: <PersonIcon sx={{ fontSize: 20 }} />,
                      color: "#3b82f6",
                    },
                    {
                      label: "Tổng tiền",
                      value: `${selectedInvoice.tong_tien.toLocaleString(
                        "vi-VN"
                      )} VND`,
                      icon: <AttachMoneyIcon sx={{ fontSize: 20 }} />,
                      color: "#10b981",
                    },
                    {
                      label: "Ngày tạo",
                      value: selectedInvoice.ngay_tao,
                      icon: <CalendarTodayIcon sx={{ fontSize: 20 }} />,
                      color: "#6366f1",
                    },
                    {
                      label: "Ngày thanh toán",
                      value: selectedInvoice.ngay_thanh_toan,
                      icon: <CalendarTodayIcon sx={{ fontSize: 20 }} />,
                      color: "#f59e0b",
                    },
                    {
                      label: "Trạng thái",
                      value: selectedInvoice.trang_thai,
                      icon: <InfoIcon sx={{ fontSize: 20 }} />,
                      color:
                        selectedInvoice.trang_thai === "Đã thanh toán"
                          ? "#10b981"
                          : "#ef4444",
                    },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        backgroundColor: "white",
                        p: 2,
                        borderRadius: "12px",
                        border: "1px solid #f1f5f9",
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Box sx={{ color: item.color, display: "flex" }}>
                          {item.icon}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.025em",
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b", pl: 3.5 }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Chi tiết hóa đơn */}
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: "#1e293b" }}
                  >
                    Chi tiết các khoản phí
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: "1px",
                      backgroundColor: "#e2e8f0",
                      ml: 1,
                    }}
                  />
                </Box>

                {detailLoading ? (
                  <Typography
                    color="textSecondary"
                    sx={{ textAlign: "center", my: 2 }}
                  >
                    Đang tải chi tiết...
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "1px solid #f1f5f9",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#f8fafc",
                            borderBottom: "2px solid #f1f5f9",
                          }}
                        >
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "left",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "#475569",
                              textTransform: "uppercase",
                            }}
                          >
                            Loại phí
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "center",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "#475569",
                              textTransform: "uppercase",
                            }}
                          >
                            Số lượng
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "right",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "#475569",
                              textTransform: "uppercase",
                            }}
                          >
                            Đơn giá
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "right",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "#475569",
                              textTransform: "uppercase",
                            }}
                          >
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.chi_tiet &&
                        selectedInvoice.chi_tiet.length > 0 ? (
                          selectedInvoice.chi_tiet.map((item, idx) => (
                            <tr
                              key={idx}
                              style={{
                                borderBottom:
                                  idx < selectedInvoice.chi_tiet.length - 1
                                    ? "1px solid #f1f5f9"
                                    : "none",
                              }}
                            >
                              <td
                                style={{
                                  padding: "12px 16px",
                                  fontSize: "0.875rem",
                                  color: "#1e293b",
                                }}
                              >
                                {item.ten_phi_snapshot || "N/A"}
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "center",
                                  fontSize: "0.875rem",
                                  color: "#1e293b",
                                }}
                              >
                                {item.so_luong}
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "right",
                                  fontSize: "0.875rem",
                                  color: "#1e293b",
                                }}
                              >
                                {parseFloat(
                                  item.dong_gia_snapshot || 0
                                ).toLocaleString("vi-VN")}
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "right",
                                  fontWeight: 600,
                                  color: "#3b82f6",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {parseFloat(
                                  item.thanh_tien || 0
                                ).toLocaleString("vi-VN")}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              style={{
                                padding: "24px",
                                textAlign: "center",
                                color: "#94a3b8",
                                fontSize: "0.875rem",
                              }}
                            >
                              Không có dữ liệu chi tiết
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </Box>
                )}
              </Box>

              {/* Tổng cộng */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 2,
                  mt: 1,
                }}
              >
                <Typography variant="subtitle1" sx={{ color: "#64748b" }}>
                  Tổng thanh toán:
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color:
                      selectedInvoice.trang_thai === "Chưa thanh toán"
                        ? "#ef4444" // Đỏ
                        : "#10b981", // Xanh lá
                  }}
                >
                  {selectedInvoice.tong_tien.toLocaleString("vi-VN")} VND
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions
              sx={{
                padding: "16px 24px",
                borderTop: "1px solid #f1f5f9",
                justifyContent: "flex-end",
                backgroundColor: "#ffffff",
                gap: 2,
              }}
            >
              <Button
                onClick={() => setOpenDetail(false)}
                variant="outlined"
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  color: "#64748b",
                  borderColor: "#cbd5e1",
                  "&:hover": {
                    borderColor: "#94a3b8",
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                Đóng lại
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<SendIcon />}
                disabled={selectedInvoice?.trang_thai === "Đã thanh toán"}
                onClick={handleSendNotification}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  // Tùy chỉnh màu khi disabled cho dễ nhìn (mặc định MUI hơi nhạt)
                  "&.Mui-disabled": {
                    borderColor: "#e2e8f0",
                    color: "#94a3b8",
                  },
                }}
              >
                Gửi thông báo
              </Button>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={() => alert("Đang in hóa đơn...")}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  backgroundColor: "var(--blue)",
                  boxShadow: "0 4px 14px rgba(0, 119, 255, 0.3)",
                  "&:hover": {
                    backgroundColor: "#0066dd",
                    boxShadow: "0 6px 20px rgba(0, 119, 255, 0.4)",
                  },
                }}
              >
                In hóa đơn
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
