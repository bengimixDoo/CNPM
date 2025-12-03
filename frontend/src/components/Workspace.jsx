import { Outlet } from "react-router-dom";
import "../styles/AdminDashboard.css";

export default function Workspace() {
  return (
      <div className="workspace">
        <div className="dashboard-grid">
          <div className="stats-row">
            <div className="stat-card">Căn hộ</div>
            <div className="stat-card">Dân cư</div>
            <div className="stat-card">Card 3</div>
            <div className="stat-card">Card 4</div>
          </div>

          {/* Row 2 - Chart + Notifications */}
          <div className="middle-row">
            <div className="chart-panel">Chart here</div>
            <div className="notify-panel">Notifications</div>
          </div>

          {/* Row 3 - Table */}
          <div className="table-panel">Table Here</div>
        </div>
	  </div>
  );
}