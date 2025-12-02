import React, { useState } from "react";
import Header from "../components/Header.jsx";
import "../styles/AdminDashboard.css";
import "../styles/index.css";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function toggleSidebar() {
    setSidebarOpen((s) => !s);
  }

  return (
    <>
      <Header onToggle={toggleSidebar} />
      <div className="admin-dashboard">
        <Sidebar isCollapsed={!sidebarOpen} />
        <div className="workspace">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
}
