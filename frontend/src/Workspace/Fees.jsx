import StatCard from "../components/StatCard";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
  { field: "id", headerName: "Căn hộ", width: 70 },
  {
    field: "name",
    headerName: "Chủ hộ",
    type: "number",
    width: 90,
  },
  { field: "feetype", headerName: "Loại phí", width: 130 },
  { field: "amount", headerName: "Số tiền", width: 130 },

  {
    field: "datecreated",
    headerName: "Ngày tạo",
    description: "This column has a value getter and is not sortable.",
    width: 160,
  },
  {
    field: "datedue",
    headerName: "Hạn Thanh Toán",
    width: 160,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 130,
  },
];

const rows = [
  { id: "A1-1203", name: "Nguyễn Văn An", feetype: "Phí dịch vụ",datecreated: '2024-01-01', datedue: '2024-01-31', amount: '₫1,000,000', status: 'Đã thanh toán' },
  { id: "A1-1204", name: "Nguyễn Văn B", feetype: "Phí dịch vụ", datecreated: '2024-02-01', datedue: '2024-02-28', amount: '₫1,500,000', status: 'Chưa thanh toán' },
  { id: "A1-1205", name: "Nguyễn Văn C", feetype: "Phí dịch vụ", datecreated: '2024-03-01', datedue: '2024-03-31', amount: '₫2,000,000', status: 'Đã thanh toán' },
  { id: "A1-1206", name: "Nguyễn Văn D", feetype: "Phí dịch vụ", datecreated: '2024-04-01', datedue: '2024-04-30', amount: '₫1,200,000', status: 'Chưa thanh toán' },
  { id: "A1-1207", name: "Nguyễn Văn E", feetype: "Phí dịch vụ", datecreated: '2024-05-01', datedue: '2024-05-31', amount: '₫1,800,000', status: 'Đã thanh toán' },
  { id: "A1-1208", name: "Nguyễn Văn F", feetype: "Phí dịch vụ", datecreated: '2024-06-01', datedue: '2024-06-30', amount: '₫1,100,000', status: 'Chưa thanh toán' },
  { id: "A1-1209", name: "Nguyễn Văn G", feetype: "Phí dịch vụ", datecreated: '2024-07-01', datedue: '2024-07-31', amount: '₫1,300,000', status: 'Đã thanh toán' },
  { id: "A1-1210", name: "Nguyễn Văn H", feetype: "Phí dịch vụ", datecreated: '2024-08-01', datedue: '2024-08-31', amount: '₫1,400,000', status: 'Chưa thanh toán' },
  { id: "A1-1211", name: "Nguyễn Văn I", feetype: "Phí dịch vụ", datecreated: '2024-09-01', datedue: '2024-09-30', amount: '₫1,600,000', status: 'Đã thanh toán' },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function Fees() {
  return (
    <>
      <div
        className="stats-row"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <StatCard
          title="Tổng thu tháng này"
          value="1,234"
          colorBackground="var(--green)"
        />
        <StatCard
          title="Tổng nợ quá hạn"
          value="₫567,890"
          colorBackground="var(--blue)"
        />
        <StatCard title="Trống" value="345" colorBackground="var(--yellow)" />
      </div>

      <Paper sx={{ height: 400, width: "100%" }} style={{ marginTop: 20 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}
