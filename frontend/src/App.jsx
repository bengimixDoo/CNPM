import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Page/Login.jsx";
import AdminLayout from "./Page/AdminDashboard.jsx";
import Residents from "./Workspace/Residents.jsx";
import Main from "./Workspace/Main.jsx";
import Apartments from "./Workspace/Apartments.jsx";
import Fees from "./Workspace/Fees.jsx";
import CreateFees from "./Workspace/CreateFees.jsx";

export default function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      {/* All admin pages use AdminLayout */}
      <Route path="/dashboard" element={<AdminLayout />}>
        <Route index element={<Main />} />
        <Route path="residents" element={<Residents />} />
        <Route path="apartments" element={<Apartments />} />
        <Route path="fees" element={<Fees />} />
        <Route path="create_fees" element={<CreateFees />} />
      </Route>
    </Routes>
  );
}
