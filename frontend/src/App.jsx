import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Page/Login.jsx";
import AdminLayout from "./Page/AdminDashboard.jsx";
import ResidentsPage from "./Page/Residents.jsx";
import Main from "./components/Main.jsx";
export default function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      {/* All admin pages use AdminLayout */}
      <Route path="/dashboard" element={<AdminLayout />}>
        <Route index element={<Main />} />
        <Route path="residents" element={<ResidentsPage />} />
      </Route>
    </Routes>
  );
}
