import StatCard from "../components/StatCard.jsx";
import "../styles/AdminDashboard.css";

export default function Main() {
  return (
    <div className="dashboard-grid">
      <div className="stats-row">
        <StatCard title="Căn hộ" value="1,234" colorBackground="var(--green)" />
        <StatCard
          title="Cư dân"
          value="₫567,890"
          colorBackground="var(--blue)"
        />
        <StatCard
          title="Phương tiện"
          value="345"
          colorBackground="var(--yellow)"
        />
        <StatCard
          title="Tổng khoản thu"
          value="78"
          colorBackground="var(--red)"
        />
      </div>

      {/* Row 2 - Chart + Notifications */}
      <div className="middle-row">
        <div className="chart-panel">Chart here</div>
        <div className="notify-panel">Notifications</div>
      </div>

      {/* Row 3 - Table */}
      <div className="table-panel">Table Here</div>
    </div>
  );
}
