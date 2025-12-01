import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ isCollapsed = false }) {
  return (
    <aside className={`sidebar ${isCollapsed ? "sidebar--collapsed" : ""}`} aria-label="Main sidebar">

      <nav className="sidebar-nav" role="navigation">
        <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13h8V3H3z"/><path d="M13 21h8V11h-8z"/></svg>
          </span>
          <span className="nav-label">Bảng điều khiển</span>
        </NavLink>

        <NavLink to="/dashboard/residents" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="3"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>
          </span>
          <span className="nav-label">Dân cư</span>
        </NavLink>

        <NavLink to="/dashboard/fees" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H17"/></svg>
          </span>
          <span className="nav-label">Thu phí</span>
        </NavLink>

        <NavLink to="/dashboard/invoices" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10v6H7z"/></svg>
          </span>
          <span className="nav-label">Hóa đơn</span>
        </NavLink>

        <NavLink to="/dashboard/docs" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/></svg>
          </span>
          <span className="nav-label">Tài liệu</span>
        </NavLink>
      </nav>
    </aside>
  );
}
