import "../styles/AdminDashboard.css";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState, useMemo, useEffect } from "react";
import { financeService } from "../api/services";

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

const columns = [
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
    width: 150,
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
    width: 150,
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
            fontSize: "12px",
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
    width: 120,
    headerAlign: "center",
    align: "center",
    type: "number",
  },
  {
    field: "chi_so_moi",
    headerName: "Chỉ số mới",
    width: 120,
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
];

export default function UtilityReadings() {
  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

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
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm theo căn hộ..."
              sx={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Loại dịch vụ</InputLabel>
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
              size="small"
              startIcon={<FilterListIcon />}
              sx={{ width: 125, height: 40 }}
            >
              Bộ lọc
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "var(--blue)",
              height: 40,
              marginLeft: "10px",
            }}
            onClick={() => setOpenCreate(true)}
          >
            Nhập chỉ số
          </Button>
        </Box>
      </div>

      <Paper
        sx={{
          height: containerHeight,
          borderRadius: "12px",
          transition: "height 0.2s ease",
          overflow: "hidden",
          marginTop: "16px",
        }}
      >
        <DataGrid
          rows={filteredReadings}
          getRowId={(row) => row.id}
          columns={columns}
          loading={loading}
          rowHeight={52}
          columnHeaderHeight={56}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{
            borderRadius: "12px",
            "& .MuiDataGrid-root": { height: "100%" },
          }}
        />
      </Paper>
    </>
  );
}
