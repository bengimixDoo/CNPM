import Header from "../components/Header.jsx";
import "../styles/AdminDashboard.css";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <Header />
      <Sidebar />
      <div className="workspace">
        <Outlet />
      </div>
    </>
  );
}
