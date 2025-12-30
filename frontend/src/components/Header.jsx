import React from "react";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import "../styles/AdminDashboard.css";

export function SearchSection() {
  return (
    <div className="header-search">
      <input
        className="header-search__input"
        type="text"
        placeholder="Tìm kiếm..."
      />
      <SearchIcon className="header-search__icon" />
    </div>
  );
}

export function NotificationIcon() {
  return (
    <button className="icon-btn" aria-label="Notifications">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    </button>
  );
}

export function ProfileSection() {
  const userInfoStr = localStorage.getItem("user_info");
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

  // Determine display name and role
  // Prefer full name, fallback to username, fallback to "User"
  const displayName = (userInfo.first_name + " " + userInfo.last_name)  || "Người dùng";

  // Format role for display
  const getRoleDisplay = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "QUAN_LY":
        return "Quản lý";
      case "KE_TOAN":
        return "Kế toán";
      case "CU_DAN":
        return "Cư dân";
      default:
        return role || "Admin";
    }
  };

  const displayRole = getRoleDisplay(userInfo.role);
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="profile-wrapper">
      <div className="profile-info">
        <div style={{ fontSize: "18px", color: "white" }}>{displayName}</div>
        <div style={{ fontSize: "15px", color: "white" }}>{displayRole}</div>
      </div>

      <Avatar
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: "700",
        }}
      >
        {initial}
      </Avatar>
    </div>
  );
}

export default function Header() {
  return (
    <>
      <div className="topbar">
        <div className="topbar-left"></div>
        <div className="topbar-mid">
          <SearchSection />
        </div>
        <div className="topbar-right">
          <ProfileSection />
        </div>
      </div>
    </>
  );
}
