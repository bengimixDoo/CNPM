# Frontend (React + Vite)

## Run Dev
`ash
npm install
npm run dev
`

Backend URL m?c d?nh: http://127.0.0.1:8000/api (s?a trong src/api/axios.js  BASE_URL).

## C?u trúc chính
`
src/
 api/
   axios.js       # Axios instance + auto refresh token
   services.js    # T?t c? API services (auth, residents, finance, services, dashboard)
 hooks/
   useApi.js      # Custom hook: loading/error/refetch, useAuth helper
 Workspace/        # Các màn hình chính (Apartments, Residents, Fees,...)
 components/       # UI components
 styles/           # CSS
`

## Axios instance (src/api/axios.js)
- T? g?n Authorization: Bearer <access> cho m?i request.
- Khi 401 do h?t h?n token: t? g?i /auth/token/refresh/, luu token m?i, retry request; n?u refresh fail  clear storage, chuy?n /login.

## Services (src/api/services.js)
Ví d? nhanh:
`javascript
import { authService, residentsService, financeService, utilitiesService, dashboardService } from '@/api/services';

await authService.login('user', 'pass'); // luu access/refresh vào localStorage
const me = await authService.getMe();
const apartments = await residentsService.getApartments({ building: 'A' });
await financeService.batchGenerateInvoices(12, 2023);
await utilitiesService.createSupportTicket({ tieu_de: '...', noi_dung: '...' });
const stats = await dashboardService.getManagerDashboard();
`

## Hook useApi (src/hooks/useApi.js)
`javascript
import { useApi } from '@/hooks/useApi';
import { residentsService } from '@/api/services';

const { data, loading, error, refetch } = useApi(residentsService.getApartments);
`
- Tr? v? data, loading, error, efetch (g?i l?i API).

### Hook useAuth
- Kh?i t?o isAuthenticated t? localStorage (không setState trong effect).
- N?u c?n c?p nh?t th? công: dùng setIsAuthenticated(true/false) tr? v? t? hook.

## Protected route ví d?
`javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useApi';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Ðang t?i...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}
`

## Flow dang nh?p
`javascript
await authService.login(username, password); // luu token
const user = await authService.getMe();
// di?u hu?ng theo role
`

## Tips
- N?u backend d?i domain  d?i BASE_URL trong src/api/axios.js.
- Khi thêm query filters, pass qua params c?a service (ví d? getInvoices({ status: 0, month: 12 })).
- Loading/error UI: dùng useApi cho ng?n g?n.
