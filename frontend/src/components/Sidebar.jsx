import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";

// NavDropdown.jsx

function NavDropdown({ label, Icon, items = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  // don't call setState synchronously on mount — derive open state from location
  const parentActive = location.pathname.startsWith(
    items[0]?.to?.split("/").slice(0, 3).join("/")
  );
  const isOpen = open || parentActive;
  // click outside => đóng
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // keyboard handler on button
  function onKey(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const first = ref.current?.querySelector(".nav-subitem");
      first?.focus();
    }
  }

  return (
    <div className="nav-dropdown" ref={ref}>
      <button
        type="button"
        className={`nav-item ${parentActive ? "active" : ""}`}
        aria-expanded={isOpen}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
      >
        {Icon && <Icon className="nav-icon" aria-hidden />}
        <span className="nav-label">{label}</span>
        <span style={{ marginLeft: "auto", fontSize: "1.5em" }}>{isOpen ? "▾" : "▸"}</span>
      </button>

      {isOpen && (
        <div
          className="nav-submenu"
          role="menu"
          aria-label={`${label} submenu`}
        >
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `nav-item nav-subitem ${isActive ? "active" : ""}`
              }
              role="menuitem"
              tabIndex={0}
            >
              <span className="nav-label">{it.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-label">
        <ApartmentIcon className="nav-icon" aria-hidden />
        BLUEMOON
      </div>
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
          to="/dashboard/apartments"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <HomeFilledIcon className="nav-icon" aria-hidden />
          <span className="nav-label">Căn hộ</span>
        </NavLink>

        <NavLink
          to="/dashboard/residents"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <PeopleAltIcon className="nav-icon" aria-hidden />
          <span className="nav-label">Dân cư</span>
        </NavLink>

        <NavDropdown
          label="Thu phí"
          Icon={MonetizationOnIcon}
          items={[
            { to: "/dashboard/create_fees", label: "Tạo khoản thu" },
            { to: "/dashboard/fees", label: "Chi tiết khoản thu" },
          ]}
        />

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
