import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

// Icons
import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LanguageIcon from "@mui/icons-material/Language";
import LockResetIcon from "@mui/icons-material/LockReset";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";

const ACCENT_COLOR = "#4e3ae9";

// --- TỪ ĐIỂN ---
const TRANSLATIONS = {
  vi: {
    general: "Thông tin chung",
    appearance: "Giao diện",
    notification: "Thông báo",
    permission: "Phân quyền",
    system: "Hệ thống",
    save: "Lưu thay đổi",
    saved: "Đã lưu thành công!",
    darkMode: "Chế độ tối",
    language: "Ngôn ngữ",
    fullName: "Họ và tên",
    phone: "Số điện thoại",
    role: "Vai trò",
    status: "Trạng thái",
    action: "Hành động",
    addUser: "Thêm nhân viên",
    editUser: "Sửa thông tin",
    deleteConfirm: "Bạn có chắc muốn xóa nhân viên này?",
    systemName: "Tên tòa nhà",
    hotline: "Hotline",
    welcomeMsg: "Lời chào",
    // Mật khẩu
    changePassTitle: "Đổi mật khẩu",
    currentPass: "Mật khẩu hiện tại",
    newPass: "Mật khẩu mới",
    confirmPass: "Xác nhận mật khẩu mới",
    passMismatch: "Mật khẩu xác nhận không khớp!",
    passSuccess: "Đổi mật khẩu thành công!",
    updatePass: "Cập nhật mật khẩu",
    // Lỗi
    wrongCurrentPass: "Mật khẩu hiện tại không đúng!",
    sameAsOldPass: "Mật khẩu mới không được trùng với mật khẩu cũ!",
    fillAll: "Vui lòng nhập đầy đủ thông tin!",
  },
  en: {
    general: "General",
    appearance: "Appearance",
    notification: "Notification",
    permission: "Permissions",
    system: "System",
    save: "Save Changes",
    saved: "Saved successfully!",
    darkMode: "Dark Mode",
    language: "Language",
    fullName: "Full Name",
    phone: "Phone Number",
    role: "Role",
    status: "Status",
    action: "Actions",
    addUser: "Add User",
    editUser: "Edit User",
    deleteConfirm: "Are you sure you want to delete this user?",
    systemName: "Building Name",
    hotline: "Hotline",
    welcomeMsg: "Welcome Message",
    changePassTitle: "Change Password",
    currentPass: "Current Password",
    newPass: "New Password",
    confirmPass: "Confirm Password",
    passMismatch: "Passwords do not match!",
    passSuccess: "Password changed successfully!",
    updatePass: "Update Password",
    wrongCurrentPass: "Incorrect current password!",
    sameAsOldPass: "New password cannot be the same as old password!",
    fillAll: "Please fill in all fields!",
  },
};

// --- TAB 1: THÔNG TIN CÁ NHÂN & ĐỔI MẬT KHẨU ---
function ProfileSecurityTab({ t, showNotify, showError }) {
  // 1. Logic Thông tin cá nhân
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("profileData");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Phạm Ngọc Tuyên",
          phone: "0912 345 678",
          email: "admin@bluemoon.vn",
        };
  });

  const handleSaveProfile = () => {
    localStorage.setItem("profileData", JSON.stringify(data));
    showNotify(t.saved);
  };

  // 2. Logic Đổi Mật khẩu
  const [passData, setPassData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Khởi tạo mật khẩu giả lập (nếu chưa có thì mặc định là 123456)
  useEffect(() => {
    if (!localStorage.getItem("userPassword")) {
      localStorage.setItem("userPassword", "123456");
    }
  }, []);

  const handleClickShowPassword = (field) => {
    setShowPass({ ...showPass, [field]: !showPass[field] });
  };

  // --- LOGIC đổi mk  ---
  const handleUpdatePassword = () => {
    // Kiểm tra rỗng
    if (!passData.current || !passData.new || !passData.confirm) {
      showError(t.fillAll);
      return;
    }

    // Lấy mật khẩu thật từ localStorage để so sánh
    const realPassword = localStorage.getItem("userPassword");

    // Kiểm tra mật khẩu hiện tại có đúng không
    if (passData.current !== realPassword) {
      showError(t.wrongCurrentPass);
      return;
    }

    // Kiểm tra mật khẩu mới có trùng mật khẩu cũ không
    if (passData.new === realPassword) {
      showError(t.sameAsOldPass);
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (passData.new !== passData.confirm) {
      showError(t.passMismatch);
      return;
    }

    // Ok: Lưu mật khẩu mới vào hệ thống
    localStorage.setItem("userPassword", passData.new);
    showNotify(t.passSuccess);
    setPassData({ current: "", new: "", confirm: "" }); // Reset form
  };

  return (
    <Box>
      <Card
        sx={{
          p: 3,
          mb: 3,
          display: "flex",
          alignItems: "center",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mr: 3,
            bgcolor: ACCENT_COLOR,
            fontSize: "2rem",
          }}
        >
          {data.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {data.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Super Admin
          </Typography>
        </Box>
      </Card>

      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, color: ACCENT_COLOR }}
        >
          <PersonOutlineIcon sx={{ verticalAlign: "middle", mr: 1 }} />{" "}
          {t.general}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t.fullName}
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t.phone}
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} textAlign="right">
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ bgcolor: ACCENT_COLOR }}
              onClick={handleSaveProfile}
            >
              {t.save}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, color: ACCENT_COLOR }}
        >
          <VpnKeyOutlinedIcon sx={{ verticalAlign: "middle", mr: 1 }} />{" "}
          {t.changePassTitle}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Mật khẩu hiện tại */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t.currentPass}
              type={showPass.current ? "text" : "password"}
              value={passData.current}
              onChange={(e) =>
                setPassData({ ...passData, current: e.target.value })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("current")}
                      edge="end"
                    >
                      {showPass.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Mật khẩu mới */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t.newPass}
              type={showPass.new ? "text" : "password"}
              value={passData.new}
              onChange={(e) =>
                setPassData({ ...passData, new: e.target.value })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("new")}
                      edge="end"
                    >
                      {showPass.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Xác nhận mật khẩu mới */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t.confirmPass}
              type={showPass.confirm ? "text" : "password"}
              value={passData.confirm}
              onChange={(e) =>
                setPassData({ ...passData, confirm: e.target.value })
              }
              error={
                passData.confirm !== "" && passData.new !== passData.confirm
              }
              helperText={
                passData.confirm !== "" && passData.new !== passData.confirm
                  ? t.passMismatch
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("confirm")}
                      edge="end"
                    >
                      {showPass.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LockResetIcon />}
              onClick={handleUpdatePassword}
            >
              {t.updatePass}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

// --- TAB 2: GIAO DIỆN ---
function AppearanceTab({ t, darkMode, setDarkMode, lang, setLang }) {
  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 600, color: ACCENT_COLOR }}
      >
        {t.appearance}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DarkModeIcon sx={{ color: "text.secondary", mr: 2 }} />
          <Box>
            <Typography fontWeight={600}>{t.darkMode}</Typography>
            <Typography variant="caption" color="textSecondary">
              Giao diện tối giúp bảo vệ mắt
            </Typography>
          </Box>
        </Box>
        <Switch
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LanguageIcon sx={{ color: "text.secondary", mr: 2 }} />
          <Box>
            <Typography fontWeight={600}>{t.language}</Typography>
            <Typography variant="caption" color="textSecondary">
              Ngôn ngữ hiển thị toàn hệ thống
            </Typography>
          </Box>
        </Box>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select value={lang} onChange={(e) => setLang(e.target.value)}>
            <MenuItem value="vi">Tiếng Việt</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}

// --- TAB 4: PHÂN QUYỀN ---
function PermissionsTab({ t, showNotify }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("usersList");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Phạm Ngọc Tuyên",
            role: "Super Admin",
            status: "Active",
          },
          { id: 2, name: "Nguyễn Văn A", role: "Manager", status: "Active" },
        ];
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "Viewer",
    status: "Active",
  });

  useEffect(() => {
    localStorage.setItem("usersList", JSON.stringify(users));
  }, [users]);

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setFormData(
      user ? { ...user } : { name: "", role: "Viewer", status: "Active" }
    );
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.name) return alert("Vui lòng nhập tên!");
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...formData, id: u.id } : u
        )
      );
      showNotify("Đã cập nhật thông tin!");
    } else {
      const newId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers([...users, { ...formData, id: newId }]);
      showNotify("Đã thêm nhân viên mới!");
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(t.deleteConfirm)) {
      setUsers(users.filter((u) => u.id !== id));
      showNotify("Đã xóa nhân viên!");
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
        alignItems="center"
      >
        <Typography variant="h6" fontWeight={600} color={ACCENT_COLOR}>
          {t.permission}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen(null)}
          sx={{ bgcolor: ACCENT_COLOR }}
        >
          {t.addUser}
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "var(--glass)" }}>
            <TableCell>{t.fullName}</TableCell>
            <TableCell>{t.role}</TableCell>
            <TableCell>{t.status}</TableCell>
            <TableCell align="right">{t.action}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id} hover>
              <TableCell fontWeight={500}>{u.name}</TableCell>
              <TableCell>
                <Chip
                  label={u.role}
                  size="small"
                  color={
                    u.role === "Super Admin"
                      ? "error"
                      : u.role === "Manager"
                      ? "primary"
                      : "default"
                  }
                  variant={u.role === "Viewer" ? "outlined" : "filled"}
                />
              </TableCell>
              <TableCell>
                <span
                  style={{
                    color: u.status === "Active" ? "green" : "red",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  {u.status === "Active" ? "● Hoạt động" : "● Đã khóa"}
                </span>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Sửa">
                  <IconButton size="small" onClick={() => handleOpen(u)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(u.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{editingUser ? t.editUser : t.addUser}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t.fullName}
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <MenuItem value="Super Admin">Super Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Viewer">Viewer</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ bgcolor: ACCENT_COLOR }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

// --- TAB 5: HỆ THỐNG ---
function SystemTab({ t, showNotify }) {
  const [sysData, setSysData] = useState({
    name: "BLUEMOON Tower",
    hotline: "1900 1234",
    msg: "Chào mừng cư dân đến với hệ thống quản lý.",
  });

  const handleReset = () => {
    if (window.confirm("Cảnh báo: Hành động này sẽ khôi phục cài đặt gốc!")) {
      setSysData({ name: "Default Building", hotline: "---", msg: "" });
      showNotify("Đã khôi phục cài đặt gốc!");
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 600, color: ACCENT_COLOR }}
      >
        {t.system}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t.systemName}
            value={sysData.name}
            onChange={(e) => setSysData({ ...sysData, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t.hotline}
            value={sysData.hotline}
            onChange={(e) =>
              setSysData({ ...sysData, hotline: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t.welcomeMsg}
            value={sysData.msg}
            onChange={(e) => setSysData({ ...sysData, msg: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="error"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
          >
            Reset Default
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ bgcolor: ACCENT_COLOR }}
            onClick={() => showNotify(t.saved)}
          >
            {t.save}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

// --- MAIN PAGE ---
export default function Setting() {
  const [tabValue, setTabValue] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("vi");
  const [notifyState, setNotifyState] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  const t = TRANSLATIONS[lang];

  const showNotify = (msg) => {
    setNotifyState({ open: true, msg, severity: "success" });
  };
  const showError = (msg) => {
    setNotifyState({ open: true, msg, severity: "error" });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.style.setProperty("--bg", "#0f172a");
      root.style.setProperty("--surface", "#1e293b");
      root.style.setProperty("--card", "#1e293b");
      root.style.setProperty("--text-primary", "#f1f5f9");
      root.style.setProperty("--glass", "rgba(30, 41, 59, 0.7)");
      document.body.style.backgroundColor = "#0f172a";
      document.body.style.color = "#f1f5f9";
    } else {
      root.style.setProperty("--bg", "#ffffff");
      root.style.setProperty("--surface", "#f8fafc");
      root.style.setProperty("--card", "#ffffff");
      root.style.setProperty("--text-primary", "#1f2937");
      root.style.setProperty("--glass", "#eef2f6");
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#1f2937";
    }
  }, [darkMode]);

  const tabs = [
    { label: t.general, icon: <PersonOutlineIcon /> },
    { label: t.appearance, icon: <VisibilityOutlinedIcon /> },
    { label: t.notification, icon: <NotificationsNoneOutlinedIcon /> },
    { label: t.permission, icon: <VpnKeyOutlinedIcon /> },
    { label: t.system, icon: <SettingsOutlinedIcon /> },
  ];

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{ textTransform: "none", minHeight: 50, fontWeight: 500 }}
            />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ minHeight: 400 }}>
        {tabValue === 0 && (
          <ProfileSecurityTab
            t={t}
            showNotify={showNotify}
            showError={showError}
          />
        )}
        {tabValue === 1 && (
          <AppearanceTab
            t={t}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            lang={lang}
            setLang={setLang}
          />
        )}
        {tabValue === 2 && (
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} color={ACCENT_COLOR}>
              {t.notification}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email Notifications"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Push Notifications"
            />
          </Paper>
        )}
        {tabValue === 3 && <PermissionsTab t={t} showNotify={showNotify} />}
        {tabValue === 4 && <SystemTab t={t} showNotify={showNotify} />}
      </Box>

      <Snackbar
        open={notifyState.open}
        autoHideDuration={3000}
        onClose={() => setNotifyState({ ...notifyState, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotifyState({ ...notifyState, open: false })}
          severity={notifyState.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {notifyState.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
