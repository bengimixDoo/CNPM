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
      <SearchIcon className="header-search__icon"/>
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
  return (
    <div className="profile-wrapper">
      <div className="profile-info">
        <div style={{ fontSize: "18px", color: "#374151" }}>
          Phạm Ngọc Tuyên
        </div>
        <div style={{ fontSize: "15px", color: "#9ca3af" }}>Admin</div>
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
        P
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
