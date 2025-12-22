import { useState, useRef } from "react";
import StatCard from "../components/StatCard.jsx";
import "../styles/AdminDashboard.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import Pagination from "@mui/material/Pagination";

export default function Apartments() {
  const statusColors = {
    "Đang ở": "var(--color-green-100)",
    Trống: "var(--color-yellow-100)",
    "Đang sửa": "var(--color-red-100)",
  };

  const apartments = [
    {
      id: "A-0702",
      building: "A",
      floor: 7,
      owner: "Lê Văn C",
      residents: 4,
      area: "75 m²",
      status: "Trống",
      phone: "0901 234 567",
      email: "chuho.a702@example.com",
      note: "Căn hộ vừa trống, cần dọn dẹp nhẹ.",
      residentsList: [
        {
          name: "Nguyễn Văn A",
          dob: "15/05/1980",
          relation: "Chủ hộ",
          phone: "0901234567",
        },
        {
          name: "Trần Thị B",
          dob: "20/10/1982",
          relation: "Vợ",
          phone: "0908765432",
        },
        {
          name: "Nguyễn Hoàng C",
          dob: "12/03/2005",
          relation: "Con",
          phone: "0912345678",
        },
        {
          name: "Nguyễn Thị D",
          dob: "08/09/2010",
          relation: "Con",
          phone: "N/A",
        },
      ],
    },
    {
      id: "A-1203",
      building: "A",
      floor: 12,
      owner: "Nguyễn Văn An",
      residents: 3,
      area: "82 m²",
      status: "Đang ở",
      phone: "0909 888 777",
      email: "an.nguyen@example.com",
      note: "Sinh hoạt bình thường.",
      residentsList: [
        {
          name: "Nguyễn Văn An",
          dob: "05/04/1988",
          relation: "Chủ hộ",
          phone: "0909888777",
        },
        {
          name: "Lê Thị Hoa",
          dob: "10/02/1990",
          relation: "Vợ",
          phone: "0911999888",
        },
        {
          name: "Nguyễn Gia Hân",
          dob: "30/11/2018",
          relation: "Con",
          phone: "N/A",
        },
      ],
    },
    {
      id: "B-0508",
      building: "B",
      floor: 5,
      owner: "Trần Thị B",
      residents: 2,
      area: "68 m²",
      status: "Đang sửa",
      phone: "0912 345 678",
      email: "b.tran@example.com",
      note: "Đang sửa hệ thống điện, dự kiến xong 3 ngày.",
      residentsList: [
        {
          name: "Trần Thị B",
          dob: "15/09/1984",
          relation: "Chủ hộ",
          phone: "0912345678",
        },
      ],
    },
    {
      id: "B-0901",
      building: "B",
      floor: 9,
      owner: "Hoàng Văn E",
      residents: 5,
      area: "90 m²",
      status: "Đang ở",
      phone: "0933 666 555",
      email: "hoang.e@example.com",
      note: "Gia đình đông người, ưu tiên bảo trì định kỳ.",
      residentsList: [
        {
          name: "Hoàng Văn E",
          dob: "01/01/1978",
          relation: "Chủ hộ",
          phone: "0933666555",
        },
        {
          name: "Phạm Thị F",
          dob: "22/07/1980",
          relation: "Vợ",
          phone: "0933777666",
        },
        {
          name: "Hoàng Gia K",
          dob: "14/04/2010",
          relation: "Con",
          phone: "N/A",
        },
        {
          name: "Hoàng Gia L",
          dob: "09/08/2014",
          relation: "Con",
          phone: "N/A",
        },
        {
          name: "Hoàng Gia M",
          dob: "30/12/2017",
          relation: "Con",
          phone: "N/A",
        },
      ],
    },
    {
      id: "C-0304",
      building: "C",
      floor: 3,
      owner: "Phạm Thị D",
      residents: 1,
      area: "55 m²",
      status: "Trống",
      phone: "0902 222 333",
      email: "d.pham@example.com",
      note: "Trống, đang tìm khách mới.",
      residentsList: [],
    },
    {
      id: "C-1010",
      building: "C",
      floor: 10,
      owner: "Lê Văn C",
      residents: 2,
      area: "70 m²",
      status: "Đang ở",
      phone: "0907 777 888",
      email: "levanc@example.com",
      note: "Yêu cầu kiểm tra ống nước tháng tới.",
      residentsList: [
        {
          name: "Lê Văn C",
          dob: "09/09/1985",
          relation: "Chủ hộ",
          phone: "0907777888",
        },
        {
          name: "Nguyễn Thị N",
          dob: "12/12/1986",
          relation: "Vợ",
          phone: "0908888999",
        },
      ],
    },
    {
      id: "A-0702",
      building: "A",
      floor: 7,
      owner: "Lê Văn C",
      residents: 4,
      area: "75 m²",
      status: "Trống",
      phone: "0901 234 567",
      email: "chuho.a702@example.com",
      note: "Căn hộ vừa trống, cần dọn dẹp nhẹ.",
      residentsList: [
        {
          name: "Nguyễn Văn A",
          dob: "15/05/1980",
          relation: "Chủ hộ",
          phone: "0901234567",
        },
        {
          name: "Trần Thị B",
          dob: "20/10/1982",
          relation: "Vợ",
          phone: "0908765432",
        },
        {
          name: "Nguyễn Hoàng C",
          dob: "12/03/2005",
          relation: "Con",
          phone: "0912345678",
        },
        {
          name: "Nguyễn Thị D",
          dob: "08/09/2010",
          relation: "Con",
          phone: "N/A",
        },
      ],
    },
    {
      id: "A-0702",
      building: "A",
      floor: 7,
      owner: "Lê Văn C",
      residents: 4,
      area: "75 m²",
      status: "Trống",
      phone: "0901 234 567",
      email: "chuho.a702@example.com",
      note: "Căn hộ vừa trống, cần dọn dẹp nhẹ.",
      residentsList: [
        {
          name: "Nguyễn Văn A",
          dob: "15/05/1980",
          relation: "Chủ hộ",
          phone: "0901234567",
        },
        {
          name: "Trần Thị B",
          dob: "20/10/1982",
          relation: "Vợ",
          phone: "0908765432",
        },
        {
          name: "Nguyễn Hoàng C",
          dob: "12/03/2005",
          relation: "Con",
          phone: "0912345678",
        },
        {
          name: "Nguyễn Thị D",
          dob: "08/09/2010",
          relation: "Con",
          phone: "N/A",
        },
      ],
    },
  ];

  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const gridRef = useRef(null);

  // Tính toán dữ liệu hiển thị theo trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApartments = apartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(apartments.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll đến vị trí đầu grid với offset
    if (gridRef.current) {
      const yOffset = -20; // Offset 20px từ top
      const y =
        gridRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleOpenDetail = (apt) => {
    setSelected(apt);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  return (
    <>
      <div className="stats-row">
        <StatCard
          title="Tổng số căn hộ"
          value="1234"
          colorBackground="var(--background-blue)"
          typeCard="Home"
        />
        <StatCard
          title="Đang ở"
          value="123"
          colorBackground="var(--background-green)"
          typeCard="Done"
        />
        <StatCard
          title="Trống"
          value="345"
          colorBackground="var(--background-yellow)"
          typeCard="Empty"
        />
        <StatCard
          title="Đang sửa chữa"
          value="78"
          colorBackground="var(--background-red)"
          typeCard="Fix"
        />
      </div>

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
          marginTop: "20px",
        }}
      >
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Tìm theo mã căn hộ, tên chủ hộ..."
            sx={{ width: 500 }}
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

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: "var(--blue)" }}
          >
            Thêm Căn hộ
          </Button>
        </Box>
      </Box>

      <div
        ref={gridRef}
        className="apartment-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {currentApartments.map((apt) => (
          <div className="apartment-card" key={apt.id}>
            <div className="header-section">
              <div className="header-info">
                <h3 className="text-lg font-bold">Căn hộ {apt.id}</h3>
                <p className="text-sm">
                  Tòa {apt.building}, Tầng {apt.floor}
                </p>
              </div>
              <span
                className="status-tag"
                style={{ backgroundColor: statusColors[apt.status] || "#ddd" }}
              >
                {apt.status}
              </span>
            </div>

            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">Chủ hộ:</span>
                <span className="detail-value">{apt.owner}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số nhân khẩu:</span>
                <span className="detail-value">{apt.residents}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Diện tích:</span>
                <span className="detail-value">{apt.area}</span>
              </div>
            </div>

            <div className="action-section">
              <button
                className="action-button action-button-main"
                onClick={() => handleOpenDetail(apt)}
              >
                Xem Chi tiết
              </button>
              <button className="action-button" aria-label="More actions">
                <MoreVertIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          marginBottom: "20px",
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>

      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="300px">
        <DialogTitle sx={{ fontWeight: 700 }}>
          Chi tiết Căn hộ {selected ? selected.id : ""}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: "#f8fafc" }}>
          {selected ? (
            <Box sx={{ display: "grid", gap: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
                  gap: 2.5,
                  p: 2.5,
                  backgroundColor: "white",
                  borderRadius: 2,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Chủ hộ
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mt: 0.5 }}
                  >
                    {selected.owner}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Số lượng cư dân
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mt: 0.5 }}
                  >
                    {selected.residents}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Diện tích
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mt: 0.5 }}
                  >
                    {selected.area}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Trạng thái
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mt: 0.5 }}
                  >
                    {selected.status}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2.5,
                  backgroundColor: "white",
                  borderRadius: 2,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  Danh sách Cư dân
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    px: 1,
                    py: 1.5,
                    backgroundColor: "#f8fafc",
                    borderRadius: 1,
                    color: "#475467",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <span>Họ và Tên</span>
                  <span>Ngày sinh</span>
                  <span>Quan hệ với chủ hộ</span>
                  <span>Số điện thoại</span>
                </Box>

                {(selected.residentsList && selected.residentsList.length > 0
                  ? selected.residentsList
                  : [
                      {
                        name: "Chưa có dữ liệu",
                        dob: "-",
                        relation: "-",
                        phone: "-",
                      },
                    ]
                ).map((person, idx) => (
                  <Box
                    key={`${person.name}-${idx}`}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      px: 1,
                      py: 1.4,
                      borderBottom:
                        idx === (selected.residentsList?.length || 1) - 1
                          ? "none"
                          : "1px solid #f1f5f9",
                      alignItems: "center",
                      fontSize: 14,
                      color: "#111827",
                    }}
                  >
                    <span>{person.name}</span>
                    <span>{person.dob}</span>
                    <span>{person.relation}</span>
                    <span>{person.phone}</span>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Chọn một căn hộ để xem chi tiết.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button onClick={handleCloseDetail} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
