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
import { utilitiesService } from "../api/services";

// Define colors for vehicle types
const vehicleTypeColors = {
  "Ô tô": {
    bg: "var(--color-blue-100)",
    text: "var(--color-blue-800)",
  },
  "Xe máy": {
    bg: "var(--color-green-100)",
    text: "var(--color-green-800)",
  },
  "Xe đạp": {
    bg: "var(--color-yellow-100)",
    text: "var(--color-yellow-800)",
  },
  "Khác": { bg: "#f3f4f6", text: "#374151" },
};

// Define colors for status
const statusColors = {
  "Đang sử dụng": {
    bg: "var(--color-green-100)",
    text: "var(--color-green-800)",
  },
  "Ngừng hoạt động": { bg: "#fee2e2", text: "#dc2626" },
};

const defaultPaginationModel = { page: 0, pageSize: 10 };

const columns = [
  {
    field: "id",
    headerName: "Mã xe",
    width: 90,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bien_so",
    headerName: "Biển số",
    width: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "loai_xe",
    headerName: "Loại xe",
    width: 140,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const color =
        vehicleTypeColors[params.value] || vehicleTypeColors["Khác"];
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
          {params.value}
        </span>
      );
    },
  },
  {
    field: "ma_can_ho",
    headerName: "Căn hộ",
    width: 200,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      if (!params.value || params.value === "N/A") {
        return <span style={{ color: "#999", fontStyle: "italic" }}>Chưa có</span>;
      }
      return (
        <span style={{ fontWeight: "500", color: "#333" }}>
          Căn hộ {params.value}
        </span>
      );
    },
  },
  {
    field: "ngay_dang_ky",
    headerName: "Ngày đăng ký",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "status", // Changed from trang_thai to status to match structure
    headerName: "Trạng thái",
    width: 160,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const color =
        statusColors[params.value] || statusColors["Ngừng hoạt động"];
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
          {params.value}
        </span>
      );
    },
  },
];

export default function Vehicles() {
  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  // Filters state (frontend filtering for demo, can be API based)
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await utilitiesService.getVehicles();
      const formattedData = data.map((item) => {
        const typeMap = {
          C: "Ô tô",
          M: "Xe máy",
          B: "Xe đạp",
          O: "Khác",
        };

        return {
          id: item.ma_xe,
          bien_so: item.bien_so || "Không có",
          loai_xe: typeMap[item.loai_xe] || "Khác",
          ma_can_ho: item.ma_can_ho || "N/A",
          ngay_dang_ky: item.ngay_dang_ky,
          status: item.dang_hoat_dong ? "Đang sử dụng" : "Ngừng hoạt động",
          _raw: item, // keep raw data for filtering references if needed
        };
      });
      setVehicles(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phương tiện:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filter logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Search Text: Match bien_so or ma_can_ho
      const matchText =
        v.bien_so.toLowerCase().includes(searchText.toLowerCase()) ||
        v.ma_can_ho.toLowerCase().includes(searchText.toLowerCase());

      // Filter Type
      const matchType = filterType === "all" || v.loai_xe === filterType;

      return matchText && matchType;
    });
  }, [vehicles, searchText, filterType]);

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
              placeholder="Tìm theo biển số, căn hộ..."
              sx={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Loại xe</InputLabel>
              <Select
                label="Loại xe"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Ô tô">Ô tô</MenuItem>
                <MenuItem value="Xe máy">Xe máy</MenuItem>
                <MenuItem value="Xe đạp">Xe đạp</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
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
            Thêm Xe
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
          rows={filteredVehicles}
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
