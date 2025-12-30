import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Page/Login.jsx";
import LandingPage from "./Page/LandingPage.jsx";
import AdminLayout from "./Page/AdminDashboard.jsx";
import Residents from "./Workspace/Residents.jsx";
import Main from "./Workspace/Main.jsx";
import Apartments from "./Workspace/Apartments.jsx";
import Fees from "./Workspace/Fees.jsx";
import CreateFees from "./Workspace/CreateFees.jsx";
import Setting from "./Workspace/Setting.jsx";
import Invoices from "./Workspace/Invoices.jsx";
import UtilityReadings from "./Workspace/UtilityReadings.jsx";
import Docs from "./Workspace/Docs.jsx";
import ResidentHome from "./Page/ResidentHome.jsx";
import Vehicles from "./Workspace/Vehicles.jsx";

export default function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/resident/home" element={<ResidentHome />} />
      <Route path="/dashboard" element={<AdminLayout />}>
        <Route index element={<Main />} />
        <Route path="residents" element={<Residents />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="apartments" element={<Apartments />} />
        <Route path="fees" element={<Fees />} />
        <Route path="create_fees" element={<CreateFees />} />
        <Route path="settings" element={<Setting />} />
        {/* 2. THÊM 2 DÒNG NÀY VÀO TRONG AdminLayout */}
        <Route path="invoices" element={<Invoices />} />
        <Route path="utility_readings" element={<UtilityReadings />} />
        <Route path="docs" element={<Docs />} />
      </Route>
    </Routes>
  );
}
