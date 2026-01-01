import "../styles/AdminDashboard.css";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useState, useEffect } from "react";
import { authService } from "../api/services";

const defaultPaginationModel = { page: 0, pageSize: 10 };

// Role colors
const roleColors = {
  ADMIN: { bg: "#fee2e2", text: "#991b1b" },
  QUAN_LY: { bg: "#dbeafe", text: "#1e40af" },
  KE_TOAN: { bg: "#fef3c7", text: "#92400e" },
  CU_DAN: { bg: "#d1fae5", text: "#065f46" },
};

const roleLabels = {
  ADMIN: "Admin",
  QUAN_LY: "Quản lý",
  KE_TOAN: "Kế toán",
  CU_DAN: "Cư dân",
};

const makeColumns = (onEdit, onDelete) => [
  {
    field: "id",
    headerName: "ID",
    width: 80,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "username",
    headerName: "Tên đăng nhập",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 200,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "role",
    headerName: "Vai trò",
    width: 130,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const role = params.value;
      const color = roleColors[role] || { bg: "#e5e7eb", text: "#374151" };
      return (
        <Chip
          label={roleLabels[role] || role}
          size="small"
          sx={{
            backgroundColor: color.bg,
            color: color.text,
            fontWeight: "600",
            fontSize: "12px",
          }}
        />
      );
    },
  },
  {
    field: "first_name",
    headerName: "Họ",
    width: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "last_name",
    headerName: "Tên",
    width: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "is_active",
    headerName: "Trạng thái",
    width: 120,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <Chip
        label={params.value ? "Hoạt động" : "Vô hiệu"}
        size="small"
        color={params.value ? "success" : "default"}
      />
    ),
  },
  {
    field: "date_joined",
    headerName: "Ngày tạo",
    width: 150,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => {
      if (!value) return "";
      return new Date(value).toLocaleDateString("vi-VN");
    },
  },
  {
    field: "actions",
    headerName: "Hành động",
    type: "actions",
    width: 150,
    headerAlign: "center",
    getActions: (params) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Sửa"
        onClick={() => onEdit(params.row)}
        showInMenu={false}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Xóa"
        onClick={() => onDelete(params.row)}
        showInMenu={false}
      />,
    ],
  },
];

export default function Users() {
  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "CU_DAN",
  });
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await authService.getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      alert(
        "Không thể tải danh sách người dùng. Bạn có thể không có quyền truy cập."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePaginationChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const handleOpenCreate = () => {
    setEditing(null);
    setForm({
      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
      role: "CU_DAN",
    });
    setOpenDialog(true);
  };

  const handleEdit = (user) => {
    setEditing(user);
    setForm({
      username: user.username,
      password: "",
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      role: user.role,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (user) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.username}"?`))
      return;
    try {
      await authService.deleteUser(user.id);
      alert("Xóa người dùng thành công!");
      await fetchUsers();
    } catch (error) {
      console.error("Xóa người dùng thất bại:", error);
      alert(
        error.response?.data?.detail ||
          "Không thể xóa người dùng. Vui lòng thử lại."
      );
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.username.trim()) {
      alert("Vui lòng nhập tên đăng nhập");
      return;
    }
    if (!editing && !form.password.trim()) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      if (editing) {
        // Update user
        const updateData = {
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          role: form.role,
        };
        await authService.updateUser(editing.id, updateData);
        alert("Cập nhật người dùng thành công!");
      } else {
        // Create new user
        await authService.createUser({
          username: form.username,
          password: form.password,
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          role: form.role,
        });
        alert("Thêm người dùng thành công!");
      }
      setOpenDialog(false);
      await fetchUsers();
    } catch (error) {
      console.error("Lỗi khi lưu người dùng:", error);
      const errorMsg =
        error.response?.data?.username?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.detail ||
        "Không thể lưu người dùng. Vui lòng thử lại.";
      alert(errorMsg);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.first_name &&
        user.first_name.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.last_name &&
        user.last_name.toLowerCase().includes(searchText.toLowerCase()));

    const matchRole = filterRole === "all" || user.role === filterRole;

    return matchSearch && matchRole;
  });

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}
        >
          Quản lý tài khoản
        </h1>
        <p style={{ color: "#6b7280" }}>
          Quản lý tài khoản người dùng trong hệ thống
        </p>
      </div>

      {/* Filters and Add Button */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ minWidth: 250 }}
          placeholder="Tên đăng nhập, email, họ tên..."
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Vai trò</InputLabel>
          <Select
            value={filterRole}
            label="Vai trò"
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="QUAN_LY">Quản lý</MenuItem>
            <MenuItem value="KE_TOAN">Kế toán</MenuItem>
            <MenuItem value="CU_DAN">Cư dân</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ ml: "auto" }}
        >
          Thêm người dùng
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ height: 600, borderRadius: "12px", overflow: "hidden" }}>
        <DataGrid
          rows={filteredUsers}
          columns={makeColumns(handleEdit, handleDelete)}
          loading={loading}
          rowHeight={52}
          columnHeaderHeight={56}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          sx={{
            borderRadius: "12px",
            "& .MuiDataGrid-root": { height: "100%" },
          }}
        />
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editing ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              disabled={!!editing}
              required
            />
            {!editing && (
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Họ"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Tên"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
            <FormControl fullWidth required>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={form.role}
                label="Vai trò"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="QUAN_LY">Quản lý</MenuItem>
                <MenuItem value="KE_TOAN">Kế toán</MenuItem>
                <MenuItem value="CU_DAN">Cư dân</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editing ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
