import "../styles/AdminDashboard.css";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FilterListIcon from "@mui/icons-material/FilterList";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import { useState, useMemo, useEffect } from "react";
import { financeService } from "../api/services";
import * as XLSX from "xlsx";

// Define colors for service types
const serviceTypeColors = {
  Điện: {
    bg: "var(--color-yellow-100)",
    text: "var(--color-yellow-800)",
  },
  Nước: {
    bg: "var(--color-blue-100)",
    text: "var(--color-blue-800)",
  },
};

const defaultPaginationModel = { page: 0, pageSize: 10 };

const makeColumns = (onDelete) => [
  {
    field: "ma_chi_so",
    headerName: "Mã Chỉ Số",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "ma_can_ho",
    headerName: "Căn hộ",
    width: 140,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      if (!params.value)
        return <span style={{ color: "#999", fontStyle: "italic" }}>N/A</span>;
      return (
        <span style={{ fontWeight: "500", color: "#333" }}>
          Căn hộ {params.value}
        </span>
      );
    },
  },
  {
    field: "loai_dich_vu",
    headerName: "Loại dịch vụ",
    width: 120,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const display = params.value === "E" ? "Điện" : "Nước";
      const color = serviceTypeColors[display] || { bg: "#eee", text: "#333" };
      return (
        <span
          style={{
            backgroundColor: color.bg,
            color: color.text,
            padding: "4px 8px",
            borderRadius: "11px",
            fontWeight: "500",
          }}
        >
          {display}
        </span>
      );
    },
  },
  {
    field: "time",
    headerName: "Kỳ chốt",
    width: 150,
    headerAlign: "center",
    align: "center",
    valueGetter: (value, row) => {
      if (!row) return "";
      return `T${row.thang}/${row.nam}`;
    },
  },
  {
    field: "chi_so_cu",
    headerName: "Chỉ số cũ",
    width: 100,
    headerAlign: "center",
    align: "center",
    type: "number",
  },
  {
    field: "chi_so_moi",
    headerName: "Chỉ số mới",
    width: 100,
    headerAlign: "center",
    align: "center",
    type: "number",
  },
  {
    field: "su_dung",
    headerName: "Sử dụng",
    width: 120,
    headerAlign: "center",
    align: "center",
    type: "number",
    valueGetter: (value, row) => {
      if (!row) return 0;
      return row.chi_so_moi - row.chi_so_cu;
    },
  },
  {
    field: "ngay_chot",
    headerName: "Ngày chốt",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "actions",
    headerName: "Hành động",
    type: "actions",
    width: 100,
    headerAlign: "center",
    getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Xóa"
        onClick={() => onDelete(params.row)}
        showInMenu={false}
      />,
    ],
  },
];

export default function UtilityReadings() {
  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadData, setUploadData] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const data = await financeService.getUtilityReadings();
      // Add row id for datagrid
      const formattedData = data.map((item) => ({
        ...item,
        id: item.ma_chi_so,
      }));
      setReadings(formattedData);
    } catch (error) {
      console.error("Lỗi khi tải chỉ số điện nước:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReading = async (reading) => {
    if (
      !confirm(
        `Xóa chỉ số ${reading.loai_dich_vu === "E" ? "Điện" : "Nước"} tháng ${
          reading.thang
        }/${reading.nam} của căn hộ ${reading.ma_can_ho}?`
      )
    )
      return;
    try {
      await financeService.deleteUtilityReading(reading.ma_chi_so);
      alert("Xóa chỉ số thành công!");
      await fetchReadings();
    } catch (error) {
      console.error("Xóa chỉ số thất bại:", error);
      alert(error.response?.data?.detail || "Không thể xóa. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  // Filter logic
  const filteredReadings = useMemo(() => {
    return readings.filter((r) => {
      // Search: Can ho
      const apt = r.ma_can_ho || "N/A";
      const matchText = apt.toLowerCase().includes(searchText.toLowerCase());

      // Filter Type: E or W
      const matchType = filterType === "all" || r.loai_dich_vu === filterType;

      return matchText && matchType;
    });
  }, [readings, searchText, filterType]);

  const handlePaginationChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const containerHeight = useMemo(() => {
    const columnHeaderHeight = 56;
    const footerHeight = 74;
    const rowHeight = 52;
    const padding = 12;
    return (
      columnHeaderHeight +
      footerHeight +
      paginationModel.pageSize * rowHeight +
      padding
    );
  }, [paginationModel.pageSize]);

  // Download Excel template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "Mã căn hộ": 1,
        "Loại dịch vụ (E=Điện, W=Nước)": "E",
        Tháng: 1,
        Năm: 2026,
        "Chỉ số cũ": 100,
        "Chỉ số mới": 150,
        "Ngày chốt (YYYY-MM-DD)": "2026-01-31",
      },
      {
        "Mã căn hộ": 1,
        "Loại dịch vụ (E=Điện, W=Nước)": "W",
        Tháng: 1,
        Năm: 2026,
        "Chỉ số cũ": 50,
        "Chỉ số mới": 75,
        "Ngày chốt (YYYY-MM-DD)": "2026-01-31",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chỉ số điện nước");

    // Set column widths
    ws["!cols"] = [
      { wch: 12 }, // Mã căn hộ
      { wch: 30 }, // Loại dịch vụ
      { wch: 8 }, // Tháng
      { wch: 8 }, // Năm
      { wch: 12 }, // Chỉ số cũ
      { wch: 12 }, // Chỉ số mới
      { wch: 25 }, // Ngày chốt
    ];

    XLSX.writeFile(wb, "mau_chi_so_dien_nuoc.xlsx");
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadFile(file);
    setUploadError("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        // Validate and transform data
        const transformedData = data.map((row, index) => {
          const maCanHo = row["Mã căn hộ"];
          const loaiDichVu = row["Loại dịch vụ (E=Điện, W=Nước)"]
            ?.trim()
            .toUpperCase();
          const thang = row["Tháng"];
          const nam = row["Năm"];
          const chiSoCu = row["Chỉ số cũ"];
          const chiSoMoi = row["Chỉ số mới"];
          const ngayChot = row["Ngày chốt (YYYY-MM-DD)"];

          // Validation
          if (
            !maCanHo ||
            !loaiDichVu ||
            !thang ||
            !nam ||
            chiSoCu === undefined ||
            chiSoMoi === undefined
          ) {
            throw new Error(`Dòng ${index + 2}: Thiếu thông tin bắt buộc`);
          }

          if (loaiDichVu !== "E" && loaiDichVu !== "W") {
            throw new Error(
              `Dòng ${
                index + 2
              }: Loại dịch vụ phải là 'E' (Điện) hoặc 'W' (Nước)`
            );
          }

          if (chiSoMoi < chiSoCu) {
            throw new Error(
              `Dòng ${index + 2}: Chỉ số mới phải lớn hơn hoặc bằng chỉ số cũ`
            );
          }

          return {
            can_ho: parseInt(maCanHo),
            loai_dich_vu: loaiDichVu,
            thang: parseInt(thang),
            nam: parseInt(nam),
            chi_so_cu: parseFloat(chiSoCu),
            chi_so_moi: parseFloat(chiSoMoi),
            ngay_chot: ngayChot || new Date().toISOString().split("T")[0],
          };
        });

        setUploadData(transformedData);
        setUploadError("");
      } catch (error) {
        console.error("Lỗi đọc file:", error);
        setUploadError(
          error.message || "Không thể đọc file. Vui lòng kiểm tra định dạng."
        );
        setUploadData([]);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Handle upload submit
  const handleUploadSubmit = async () => {
    if (uploadData.length === 0) {
      setUploadError("Không có dữ liệu để upload");
      return;
    }

    setUploading(true);
    try {
      // Call API to bulk create utility readings
      await financeService.bulkCreateUtilityReadings(uploadData);

      alert(`Upload thành công ${uploadData.length} bản ghi!`);
      setOpenUpload(false);
      setUploadFile(null);
      setUploadData([]);
      await fetchReadings();
    } catch (error) {
      console.error("Lỗi upload:", error);
      setUploadError(
        error.response?.data?.detail ||
          "Không thể upload dữ liệu. Vui lòng thử lại."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="dashboard-grid">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            backgroundColor: "white",
            borderRadius: "12px 12px 0 0",
            border: "1px solid #e0e0e0",
            height: "56px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              gap: 2,
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm theo căn hộ..."
              sx={{ flex: 1, minWidth: "250px" }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <FormControl size="small" sx={{ flexShrink: 0 }}>
              <InputLabel sx={{ zIndex: 1 }}>Loại dịch vụ</InputLabel>
              <Select
                label="Loại dịch vụ"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="E">Điện</MenuItem>
                <MenuItem value="W">Nước</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ height: 40, whiteSpace: "nowrap", flexShrink: 0, width: "150px" }}
              onClick={handleDownloadTemplate}
            >
              Tải mẫu
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{ height: 40, whiteSpace: "nowrap", flexShrink: 0, width: "150px" }}
              onClick={() => setOpenUpload(true)}
            >
              Upload
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "var(--blue)",
                height: 40,
                whiteSpace: "nowrap",
                width: "140px",
                flexShrink: 0,
              }}
              onClick={() => setOpenCreate(true)}
            >
              Nhập chỉ số
            </Button>
          </Box>
        </Box>
      </div>

      <Paper
        sx={{
          height: containerHeight,
          borderRadius: "0 0 12px 12px",
          transition: "height 0.2s ease",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredReadings}
          getRowId={(row) => row.id}
          columns={makeColumns(handleDeleteReading)}
          loading={loading}
          rowHeight={52}
          columnHeaderHeight={56}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{
            borderRadius: "0 0 12px 12px",
            "& .MuiDataGrid-root": { height: "100%" },
          }}
        />
      </Paper>

      {/* Dialog Upload Excel */}
      <Dialog
        open={openUpload}
        onClose={() => {
          setOpenUpload(false);
          setUploadFile(null);
          setUploadData([]);
          setUploadError("");
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Excel - Chỉ số điện nước</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {uploadError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {uploadError}
              </Alert>
            )}

            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>Hướng dẫn:</strong>
              <ol style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li>Tải file mẫu Excel bằng nút "Tải mẫu Excel"</li>
                <li>Điền thông tin chỉ số điện nước theo đúng định dạng</li>
                <li>Loại dịch vụ: E (Điện) hoặc W (Nước)</li>
                <li>Chỉ số mới phải lớn hơn hoặc bằng chỉ số cũ</li>
                <li>Upload file đã điền</li>
              </ol>
            </Alert>

            <input
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              id="upload-excel-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="upload-excel-file">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                startIcon={<UploadFileIcon />}
                sx={{ mb: 2 }}
              >
                {uploadFile ? uploadFile.name : "Chọn file Excel"}
              </Button>
            </label>

            {uploadData.length > 0 && (
              <Alert severity="success">
                Đã đọc được <strong>{uploadData.length}</strong> bản ghi từ file
                Excel.
                <Box sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      fontSize: "12px",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th
                          style={{ padding: "4px", border: "1px solid #ddd" }}
                        >
                          Căn hộ
                        </th>
                        <th
                          style={{ padding: "4px", border: "1px solid #ddd" }}
                        >
                          Loại DV
                        </th>
                        <th
                          style={{ padding: "4px", border: "1px solid #ddd" }}
                        >
                          Kỳ
                        </th>
                        <th
                          style={{ padding: "4px", border: "1px solid #ddd" }}
                        >
                          CS Cũ
                        </th>
                        <th
                          style={{ padding: "4px", border: "1px solid #ddd" }}
                        >
                          CS Mới
                        </th>
                        <th
                          style={{ padding: "4px", border: "1px solid #ddd" }}
                        >
                          Tiêu thụ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadData.map((item, idx) => (
                        <tr key={idx}>
                          <td
                            style={{
                              padding: "4px",
                              border: "1px solid #ddd",
                              textAlign: "center",
                            }}
                          >
                            {item.can_ho}
                          </td>
                          <td
                            style={{
                              padding: "4px",
                              border: "1px solid #ddd",
                              textAlign: "center",
                            }}
                          >
                            {item.loai_dich_vu === "E" ? "Điện" : "Nước"}
                          </td>
                          <td
                            style={{
                              padding: "4px",
                              border: "1px solid #ddd",
                              textAlign: "center",
                            }}
                          >
                            T{item.thang}/{item.nam}
                          </td>
                          <td
                            style={{
                              padding: "4px",
                              border: "1px solid #ddd",
                              textAlign: "right",
                            }}
                          >
                            {item.chi_so_cu}
                          </td>
                          <td
                            style={{
                              padding: "4px",
                              border: "1px solid #ddd",
                              textAlign: "right",
                            }}
                          >
                            {item.chi_so_moi}
                          </td>
                          <td
                            style={{
                              padding: "4px",
                              border: "1px solid #ddd",
                              textAlign: "right",
                            }}
                          >
                            {item.chi_so_moi - item.chi_so_cu}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setOpenUpload(false);
              setUploadFile(null);
              setUploadData([]);
              setUploadError("");
            }}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={handleUploadSubmit}
            variant="contained"
            disabled={uploadData.length === 0 || uploading}
          >
            {uploading ? "Đang upload..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
