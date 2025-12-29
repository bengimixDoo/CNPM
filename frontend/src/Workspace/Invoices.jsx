import React, { useState, useEffect, useMemo } from "react";
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
      valueFormatter: (params) => {
        if (params.value == null) return "";
        return params.value.toLocaleString("vi-VN") + " VND";
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

  return (
    <div className="workspace-container">
      {/* 1. Header & Filter */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
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

      {/* 2. DataGrid */}
      <Paper
        sx={{
          height: containerHeight,
          borderRadius: 3,
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
          sx={{ border: "none" }}
        />
      </Paper>

      {/* 3. Dialog Xem chi tiết hóa đơn */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Chi tiết Hóa đơn</span>
          {selectedInvoice && (
            <Chip label={selectedInvoice.trang_thai} size="small" />
          )}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {selectedInvoice && (
            <Box>
              {/* Header giống kiểu Apartment detail */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Hóa đơn #{selectedInvoice.ma_hoa_don}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Căn hộ {selectedInvoice.can_ho} • Tháng{" "}
                    {selectedInvoice.thang}/{selectedInvoice.nam}
                  </Typography>
                </Box>
                {getStatusChip(selectedInvoice.trang_thai)}
              </Box>

              {/* Thông tin tổng quan dạng thẻ ngắn */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 1.5,
                  mb: 3,
                }}
              >
                {["Tổng tiền", "Ngày tạo", "Ngày thanh toán", "Trạng thái"].map(
                  (label, idx) => {
                    const mapVal = {
                      "Tổng tiền": `${selectedInvoice.tong_tien.toLocaleString(
                        "vi-VN"
                      )} VND`,
                      "Ngày tạo": selectedInvoice.ngay_tao,
                      "Ngày thanh toán": selectedInvoice.ngay_thanh_toan,
                      "Trạng thái": selectedInvoice.trang_thai,
                    };
                    return (
                      <Box
                        key={idx}
                        sx={{
                          p: 2,
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          background:
                            "linear-gradient(180deg, #fafafa, #f5f7fb)",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          {label}
                        </Typography>
                        <Typography fontWeight={700}>
                          {mapVal[label]}
                        </Typography>
                      </Box>
                    );
                  }
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Chi tiết hóa đơn */}
              {detailLoading ? (
                <Typography
                  color="textSecondary"
                  sx={{ textAlign: "center", my: 2 }}
                >
                  Đang tải chi tiết...
                </Typography>
              ) : (
                <Box sx={{ overflowX: "auto", mb: 2 }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#f1f5f9" }}>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          Loại phí
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "center",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          Số lượng
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "right",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          Đơn giá
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "right",
                            borderBottom: "1px solid #e2e8f0",
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
                              backgroundColor:
                                idx % 2 === 0 ? "#fff" : "#f8fafc",
                            }}
                          >
                            <td
                              style={{
                                padding: "10px",
                                borderBottom: "1px solid #eef2f7",
                              }}
                            >
                              {item.ten_phi_snapshot || "N/A"}
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                textAlign: "center",
                                borderBottom: "1px solid #eef2f7",
                              }}
                            >
                              {item.so_luong}
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                textAlign: "right",
                                borderBottom: "1px solid #eef2f7",
                              }}
                            >
                              {parseFloat(
                                item.dong_gia_snapshot || 0
                              ).toLocaleString("vi-VN")}{" "}
                              VND
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                textAlign: "right",
                                borderBottom: "1px solid #eef2f7",
                                fontWeight: 600,
                              }}
                            >
                              {parseFloat(item.thanh_tien || 0).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              VND
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            style={{
                              padding: "10px",
                              textAlign: "center",
                              color: "#999",
                            }}
                          >
                            Không có chi tiết
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Tổng tiền */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecdd3",
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                }}
              >
                <Typography variant="h6" fontWeight={700} color="error.main">
                  Tổng cộng
                </Typography>
                <Typography variant="h6" color="error.main" fontWeight={800}>
                  {selectedInvoice.tong_tien.toLocaleString("vi-VN")} VND
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDetail(false)} color="inherit">
            Đóng
          </Button>
          <Button variant="contained" startIcon={<PrintIcon />}>
            In ngay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
