import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Login.jsx";
import AdminLayout from "./AdminDashboard.jsx";
export default function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="/dashboard" element={<AdminLayout />} />
    </Routes>
  );
}
