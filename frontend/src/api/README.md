# Hướng Dẫn Sử Dụng API

## Cấu Trúc API

```
src/
├── api/
│   ├── axios.js          # Axios instance với auto refresh token
│   └── services.js       # Tất cả API services
└── hooks/
    └── useApi.js         # Custom hooks
```

## 1. Cấu Hình Backend URL

Mặc định: `http://127.0.0.1:8000/api`

Để thay đổi, sửa trong `src/api/axios.js`:

```javascript
const BASE_URL = "http://your-backend-url/api";
```

## 2. Các Service Có Sẵn

### Auth Service

```javascript
import { authService } from "@/api/services";

// Đăng nhập
const { access, refresh } = await authService.login("username", "password");

// Lấy thông tin user
const user = await authService.getMe();

// Đổi mật khẩu
await authService.changePassword("old_pass", "new_pass");

// Đăng xuất
await authService.logout();
```

### Residents Service

```javascript
import { residentsService } from "@/api/services";

// Lấy danh sách căn hộ
const apartments = await residentsService.getApartments();
const filtered = await residentsService.getApartments({
  building: "A",
  floor: 5,
});

// Chi tiết căn hộ
const apartment = await residentsService.getApartmentDetail(1);

// Lấy danh sách cư dân
const residents = await residentsService.getResidents();
const searched = await residentsService.getResidents({
  name: "Nguyen",
  cccd: "001",
});

// Tạo cư dân mới
const newResident = await residentsService.createResident({
  ho_ten: "Nguyễn Văn A",
  cccd: "001234567890",
  so_dien_thoai: "0901234567",
  // ... other fields
});

// Move-in
await residentsService.moveIn(residentId, apartmentId, true);

// Move-out
await residentsService.moveOut(residentId);
```

### Finance Service

```javascript
import { financeService } from '@/api/services';

// Danh mục phí
const fees = await financeService.getFeeCategories();

// Nhập chỉ số điện nước batch
await financeService.batchUploadReadings([
  { can_ho: 1, loai_dich_vu: 'Dien', chi_so_moi: 100, ... },
  { can_ho: 1, loai_dich_vu: 'Nuoc', chi_so_moi: 50, ... }
]);

// Tạo hóa đơn hàng loạt
await financeService.batchGenerateInvoices(12, 2023);

// Lấy danh sách hóa đơn
const invoices = await financeService.getInvoices({ status: 0, month: 12 });

// Chi tiết hóa đơn
const invoice = await financeService.getInvoiceDetail(15);

// Xác nhận thanh toán
await financeService.confirmPayment(15);

// Báo cáo doanh thu
const revenue = await financeService.getMonthlyRevenue(2023);
```

### Utilities Service

```javascript
import { utilitiesService } from "@/api/services";

// Quản lý xe
const vehicles = await utilitiesService.getVehicles();
await utilitiesService.createVehicle({
  can_ho: 1,
  bien_so: "30A-123.45",
  loai_xe: "Oto",
});

// Yêu cầu hỗ trợ
const tickets = await utilitiesService.getSupportTickets();
await utilitiesService.createSupportTicket({ tieu_de: "...", noi_dung: "..." });
await utilitiesService.updateSupportTicket(5, {
  trang_thai: "DaXuLy",
  phan_hoi_bql: "...",
});

// Tin tức
const news = await utilitiesService.getNews();
await utilitiesService.createNews({ tieu_de: "...", noi_dung: "..." });
```

### Dashboard Service

```javascript
import { dashboardService } from "@/api/services";

// Dashboard Manager
const managerStats = await dashboardService.getManagerDashboard();

// Dashboard Resident
const residentStats = await dashboardService.getResidentDashboard();

// Gửi thông báo
await dashboardService.sendNotification({ title: "...", message: "..." });
```

## 3. Sử Dụng Trong Component

### Cách 1: Dùng Custom Hook `useApi`

```javascript
import { useApi } from "@/hooks/useApi";
import { residentsService } from "@/api/services";

function Apartments() {
  const {
    data: apartments,
    loading,
    error,
    refetch,
  } = useApi(
    residentsService.getApartments,
    [], // dependencies
    true // gọi ngay khi mount
  );

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      {apartments?.map((apt) => (
        <div key={apt.ma_can_ho}>{apt.ma_hien_thi}</div>
      ))}
      <button onClick={refetch}>Làm mới</button>
    </div>
  );
}
```

### Cách 2: Dùng useEffect + useState

```javascript
import { useState, useEffect } from "react";
import { residentsService } from "@/api/services";

function Apartments() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await residentsService.getApartments();
        setApartments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ... render
}
```

### Cách 3: Gọi API trong Event Handler

```javascript
import { useState } from "react";
import { residentsService } from "@/api/services";

function CreateApartment() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await residentsService.createApartment(formData);
      alert("Tạo thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? "Đang xử lý..." : "Tạo mới"}
      </button>
    </form>
  );
}
```

## 4. Xử Lý Lỗi

API tự động xử lý:

- **401 Unauthorized**: Tự động refresh token, nếu thất bại → redirect về login
- **403 Forbidden**: Không có quyền
- **400 Bad Request**: Validation errors

Trong component:

```javascript
try {
  const data = await someService.someMethod();
} catch (error) {
  // error.response.data chứa thông tin lỗi từ backend
  console.error(error.response?.data);
  alert(error.response?.data?.message || "Có lỗi xảy ra");
}
```

## 5. Authentication Flow

### Login

```javascript
import { authService } from "@/api/services";

const handleLogin = async (username, password) => {
  try {
    // Login → tự động lưu tokens vào localStorage
    await authService.login(username, password);

    // Lấy thông tin user
    const user = await authService.getMe();

    // Điều hướng theo role
    if (user.role === "admin" || user.role === "manager") {
      navigate("/dashboard");
    } else {
      navigate("/resident-dashboard");
    }
  } catch (error) {
    alert("Đăng nhập thất bại");
  }
};
```

### Logout

```javascript
import { authService } from "@/api/services";

const handleLogout = async () => {
  await authService.logout(); // Tự động clear localStorage và redirect
};
```

### Check Auth

```javascript
import { useAuth } from "@/hooks/useApi";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Đang tải...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}
```

## 6. Tips

### Pagination với filters

```javascript
const [filters, setFilters] = useState({ page: 1, status: 0 });

const { data, refetch } = useApi(
  () => financeService.getInvoices(filters),
  [filters] // Re-fetch khi filters thay đổi
);

// Thay đổi filter
const handlePageChange = (newPage) => {
  setFilters((prev) => ({ ...prev, page: newPage }));
};
```

### Optimistic Updates

```javascript
const handleConfirmPayment = async (id) => {
  // Update UI trước
  const updatedInvoices = invoices.map((inv) =>
    inv.ma_hoa_don === id ? { ...inv, trang_thai: 1 } : inv
  );
  setInvoices(updatedInvoices);

  try {
    await financeService.confirmPayment(id);
  } catch (error) {
    // Rollback nếu thất bại
    refetch();
    alert("Xác nhận thất bại");
  }
};
```

### Debounce Search

```javascript
import { useState, useEffect } from "react";

const [searchTerm, setSearchTerm] = useState("");
const [debouncedTerm, setDebouncedTerm] = useState("");

useEffect(() => {
  const timer = setTimeout(() => setDebouncedTerm(searchTerm), 500);
  return () => clearTimeout(timer);
}, [searchTerm]);

const { data } = useApi(
  () => residentsService.getResidents({ name: debouncedTerm }),
  [debouncedTerm]
);
```

## 7. Ví Dụ Hoàn Chỉnh

Xem file `Apartments.jsx` đã được tích hợp API đầy đủ với:

- Loading states
- Error handling
- Pagination
- Filters
- CRUD operations
