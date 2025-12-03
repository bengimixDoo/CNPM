import React from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ApartmentIcon from "@mui/icons-material/Apartment";


export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-label">
        <ApartmentIcon className="nav-icon" aria-hidden />
        BLUEMOON</div>
      <nav className="sidebar-top" role="navigation">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <DashboardIcon className="nav-icon" aria-hidden />
          <span className="nav-label">Bảng điều khiển</span>
        </NavLink>
        <NavLink
          to="/dashboard/residents"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <PeopleAltIcon className="nav-icon" aria-hidden />
          <span className="nav-label">Dân cư</span>
        </NavLink>
        <NavLink
          to="/dashboard/fees"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <MonetizationOnIcon className="nav-icon" aria-hidden />
          <span className="nav-label">Thu phí</span>
        </NavLink>
        <NavLink
          to="/dashboard/invoices"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <ReceiptLongIcon className="nav-icon" aria-hidden />
          <span className="nav-label">Hóa đơn</span>
        </NavLink>
        <NavLink
          to="/dashboard/docs"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <DescriptionIcon className="nav-icon" aria-hidden />
          <span className="nav-label">Tài liệu</span>
        </NavLink>
      </nav>

      <nav className="sidebar-bottom" role="navigation">
        <NavLink
          to="/dashboard/settings"
          end
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <SettingsIcon className="nav-icon" aria-hidden />
          <span className="nav-label">Cài đặt</span>
        </NavLink>

        <NavLink
          to="/dashboard/logout"
          end
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <LogoutIcon className="nav-icon" aria-hidden />
          <span className="nav-label">Đăng xuất</span>
        </NavLink>
      </nav>
    </aside>
  );
}
