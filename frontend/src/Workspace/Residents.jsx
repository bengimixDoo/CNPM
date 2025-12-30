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
import { residentsService } from "../api/services";

const statusColors = {
  "Đang cư trú": {
    bg: "var(--color-green-100)",
    text: "var(--color-green-800)",
  },
  "Đã chuyển đi": { bg: "#fee2e2", text: "#dc2626" },
  "Tạm vắng": { bg: "#fef3c7", text: "#d97706" },
};

const defaultPaginationModel = { page: 0, pageSize: 10 };
const columns = [
  {
    field: "id",
    headerName: "Mã cư dân",
    width: 90,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "name",
    headerName: "Họ và tên",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sex",
    headerName: "Giới tính",
    width: 90,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "birth",
    headerName: "Ngày sinh",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cccd",
    headerName: "Số CCCD",
    width: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sdt",
    headerName: "Số điện thoại",
    width: 120,
    type: "number",
    headerAlign: "center",
    align: "center",
  },
  {
    field: "id_apartment",
    headerName: "Mã căn hộ",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "relationship",
    headerName: "Quan hệ ",
    width: 110,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "status",
    headerName: "Trạng thái cư trú",
    width: 140,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const color = statusColors[params.value] || statusColors["Đang cư trú"];
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

export default function Residents() {
  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const data = await residentsService.getResidents();
      // Ánh xạ dữ liệu từ API về định dạng của DataGrid
      const formattedData = data.map((item) => {
        const statusMap = {
          TH: "Đang cư trú", // Thường trú
          TT: "Đang cư trú", // Tạm trú
          TV: "Tạm vắng",
          OUT: "Đã chuyển đi",
        };

        return {
          _rowId: item.ma_cu_dan,
          id: item.ma_cu_dan,
          name: item.ho_ten,
          sex: item.gioi_tinh === "M" ? "Nam" : "Nữ",
          birth: item.ngay_sinh,
          cccd: item.so_cccd,
          sdt: item.so_dien_thoai,
          id_apartment: item.can_ho_dang_o ?? "Chưa có",
          relationship: item.la_chu_ho ? "Chủ hộ" : "Thành viên",
          status: statusMap[item.trang_thai_cu_tru] || "Đang cư trú",
        };
      });
      setResidents(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cư dân:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const rows = useMemo(() => residents, [residents]);

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
              placeholder="Tìm theo mã căn hộ, tên chủ hộ..."
              sx={{ width: 400 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Tòa nhà</InputLabel>
              <Select label="Tòa nhà" defaultValue="all">
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="A">Tòa A</MenuItem>
                <MenuItem value="B">Tòa B</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Tầng</InputLabel>
              <Select label="Tầng" defaultValue="all">
                <MenuItem value="all">Tất cả</MenuItem>
                {[...Array(30)].map((_, i) => (
                  <MenuItem key={i} value={i + 1}>
                    Tầng {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterListIcon />}
              sx={{ width: 125, height: 40 }}
            >
              Trạng thái
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
            Thêm Cư dân
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
          rows={rows}
          getRowId={(row) => row._rowId}
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
