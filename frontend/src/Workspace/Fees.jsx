import StatCard from "../components/StatCard";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useCallback } from "react";


const columns = [
  {
    field: "fee_item_id",
    headerName: "Mã Khoản Thu",
    width: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "fee_type",
    headerName: "Loại Phí",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "period",
    headerName: "Kỳ Thanh toán",
    width: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "amount_due",
    headerName: "Số Tiền Nợ",
    width: 140,
    type: "number",
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      params.value != null
        ? params.value.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })
        : "",
  },
  {
    field: "calculation_detail",
    headerName: "Công thức Tính",
    width: 180,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "due_date",
    headerName: "Hạn Thanh toán",
    width: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 140,
    headerAlign: "center",
    align: "center",
    cellClassName: (params) => {
      if (params.value === "Đã Thanh toán") return "status-paid";
      if (params.value === "Quá hạn") return "status-overdue";
      return "status-pending";
    },
  },
  {
    field: "payment_date",
    headerName: "Ngày Nộp Thực tế",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "actions",
    headerName: "Hành động",
    type: "actions",
    width: 130,
    headerAlign: "center",
    getActions: () => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Ghi nhận Thanh toán"
        onClick={() => {}}
        showInMenu={false}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Xem Chi tiết"
        onClick={() => {}}
        showInMenu={false}
      />,
    ],
  },
];

const initialRows = [
  {
    id: "ITEM-00123",
    fee_item_id: "ITEM-00123",
    fee_type: "Phí Dịch vụ",
    period: "Tháng 12/2025",
    amount_due: 1250000,
    calculation_detail: "10.000 đồng/m² × 50 m² + 500.000 VND phụ phí",
    due_date: "2025-12-31",
    status: "Đã Thanh toán",
    payment_date: "2025-12-28",
  },
  {
    id: "ITEM-00124",
    fee_item_id: "ITEM-00124",
    fee_type: "Phí Quản lý",
    period: "Tháng 12/2025",
    amount_due: 800000,
    calculation_detail: "8.000 đồng/m² × 50 m²",
    due_date: "2025-12-31",
    status: "Chưa nộp",
    payment_date: null,
  },
  {
    id: "ITEM-00125",
    fee_item_id: "ITEM-00125",
    fee_type: "Phí Gửi xe",
    period: "Tháng 12/2025",
    amount_due: 400000,
    calculation_detail: "200.000 đồng/xe/tháng × 2 xe",
    due_date: "2025-12-31",
    status: "Quá hạn",
    payment_date: null,
  },
  {
    id: "ITEM-00126",
    fee_item_id: "ITEM-00126",
    fee_type: "Phí Dịch vụ",
    period: "Tháng 11/2025",
    amount_due: 1250000,
    calculation_detail: "10.000 đồng/m² × 50 m² + 500.000 VND phụ phí",
    due_date: "2025-11-30",
    status: "Đã Thanh toán",
    payment_date: "2025-11-29",
  },
  {
    id: "ITEM-00127",
    fee_item_id: "ITEM-00127",
    fee_type: "Phí Quản lý",
    period: "Tháng 11/2025",
    amount_due: 800000,
    calculation_detail: "8.000 đồng/m² × 50 m²",
    due_date: "2025-11-30",
    status: "Đã Thanh toán",
    payment_date: "2025-11-28",
  },
  {
    id: "ITEM-00128",
    fee_item_id: "ITEM-00128",
    fee_type: "Phí Gửi xe",
    period: "Tháng 11/2025",
    amount_due: 400000,
    calculation_detail: "200.000 đồng/xe/tháng × 2 xe",
    due_date: "2025-11-30",
    status: "Đã Thanh toán",
    payment_date: "2025-11-25",
  },
  {
    id: "ITEM-00129",
    fee_item_id: "ITEM-00129",
    fee_type: "Phí Dịch vụ",
    period: "Tháng 10/2025",
    amount_due: 1250000,
    calculation_detail: "10.000 đồng/m² × 50 m² + 500.000 VND phụ phí",
    due_date: "2025-10-31",
    status: "Đã Thanh toán",
    payment_date: "2025-10-30",
  },
  {
    id: "ITEM-00130",
    fee_item_id: "ITEM-00130",
    fee_type: "Phí Quản lý",
    period: "Tháng 10/2025",
    amount_due: 800000,
    calculation_detail: "8.000 đồng/m² × 50 m²",
    due_date: "2025-10-31",
    status: "Chưa nộp",
    payment_date: null,
  },
  {
    id: "ITEM-00131",
    fee_item_id: "ITEM-00131",
    fee_type: "Phí Gửi xe",
    period: "Tháng 10/2025",
    amount_due: 400000,
    calculation_detail: "200.000 đồng/xe/tháng × 2 xe",
    due_date: "2025-10-31",
    status: "Quá hạn",
    payment_date: null,
  },
];

const defaultPaginationModel = { page: 0, pageSize: 5 };

export default function Fees() {
  const [rows, setRows] = useState(initialRows);
  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );

  const handleDelete = useCallback((id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // We map actions to call handlers via DataGrid API when necessary.

  return (
    <>
      <div
        className="stats-row"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <StatCard
          title="Tổng thu tháng này"
          value={rows
            .reduce(
              (s, r) => s + (r.status === "Đã thanh toán" ? r.amount : 0),
              0
            )
            .toLocaleString()} // raw sum
          colorBackground="var(--green)"
        />
        <StatCard
          title="Tổng nợ quá hạn"
          value={rows.filter((r) => r.status !== "Đã thanh toán").length}
          colorBackground="var(--blue)"
        />
        <StatCard
          title="Tổng khoản"
          value={rows.length}
          colorBackground="var(--yellow)"
        />
      </div>

      <Paper sx={{ height: 520 }} style={{ marginTop: 12, borderRadius: "12px" }}>
        <DataGrid
          rows={rows}
          columns={columns.map((col) => {
            if (col.field === "actions") {
              return {
                ...col,
                getActions: (params) => [
                  <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Sửa"
                    onClick={() => alert(`Sửa ${params.id} - chức năng demo`)}
                    showInMenu={false}
                  />,
                  <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Xóa"
                    onClick={() => handleDelete(params.id)}
                    showInMenu={false}
                  />,
                ],
              };
            }
            return col;
          })}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          sx={{ borderRadius: "12px" }}
        />
      </Paper>
      {/* Create Fee Modal */}
    </>
  );
}
