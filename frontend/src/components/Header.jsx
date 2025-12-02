import React from "react";

export function SearchSection() {
  return (
    <div className="header-search">
      <input
        className="header-search__input"
        type="text"
        placeholder="Tìm kiếm..."
      />
      <button className="header-search__btn" aria-label="Search">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
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
      <div className="avatar">A</div>
      <div className="profile-name">Admin</div>
    </div>
  );
}

export default function Header({ onToggle }) {
  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <button
            className="menu-toggle"
            aria-label="Toggle sidebar"
            onClick={onToggle}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <ProfileSection />
        </div>

        <div className="topbar-center">
          <SearchSection />
        </div>

        <div className="topbar-right">
          <NotificationIcon />
          <div className="topbar-brand">BlueMoon</div>
        </div>
      </div>
    </>
  );
}
