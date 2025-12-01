import React, { useState } from "react";
import Header from "./components/Header.jsx";
import "./styles/AdminDashboard.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar.jsx";
import StatCard from "./components/StatCard.jsx";

function RightWidget({ title, children }) {
  return (
    <div className="right-widget">
      <div className="widget-title">{title}</div>
      <div className="widget-body">{children}</div>
    </div>
  );
}

function Main() {
  return (
    <div className="main-area">
      <div className="top-row">
        <div className="top-left">
          <h2 className="page-title">Bảng điều khiển</h2>
          <p className="page-sub">
            Tổng quan các khoản thu và trạng thái hệ thống
          </p>
        </div>
        <div className="top-actions">
          <button className="btn btn--outline">Share</button>
          <button className="btn btn--primary">Tạo báo cáo</button>
        </div>
      </div>

      <div className="content-grid">
        <div className="content-main">
          <div className="stats-row">
            <StatCard title="Tổng căn hộ" value="1,234" />
            <StatCard title="Tổng cư dân" value="3,456" />
            <StatCard
              title="Thu phí tháng"
              value="₫45,600,000"
              colorClass="card--blue"
            />
            <StatCard title="Chưa nộp" value="123" colorClass="card--red" />
            <StatCard
              title="Tổng đóng góp"
              value="₫1,200,000"
              colorClass="card--amber"
            />
          </div>

          <div className="panel chart-panel">
            <div className="panel-title">Total Growth</div>
            <div className="chart-placeholder">[ Chart placeholder ]</div>
          </div>

          <div className="panel small-panels">
            <div className="mini">Recent activity / tables</div>
            <div className="mini">More content</div>
          </div>
        </div>

        <aside className="content-right">
          <RightWidget title="Popular Stocks">
            <div className="stock-card">
              <div className="stock-left">
                <div className="stock-title">Bajaj Finery</div>
                <div className="stock-sub">10% Profit</div>
              </div>
              <div className="stock-price">$1839.00</div>
            </div>
          </RightWidget>

          <RightWidget title="Quick Summary">
            <div className="summary-row">
              <div>Tổng thu</div>
              <div>₫2,324.00</div>
            </div>
          </RightWidget>
        </aside>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function toggleSidebar() {
    setSidebarOpen((s) => !s);
  }

  return (
    <div className={`admin-dashboard ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <Sidebar isCollapsed={!sidebarOpen} />
      <div className={`workspace ${sidebarOpen ? "" : "expanded"}`}>
        <Header onToggle={toggleSidebar} />
        <Navbar />
        <Main />
      </div>
    </div>
  );
}
