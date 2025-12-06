import StatCard from "../components/StatCard.jsx";
import "../styles/AdminDashboard.css";

export default function Main() {
  return (
    <div className="dashboard-grid">
      <div className="stats-row">
        <StatCard
          title="Tổng số căn hộ"
          value="1234"
          colorBackground="var(--blue)"
          typeCard={"Home"}
        />
        <StatCard
          title="Cư dân"
          value="567,890"
          colorBackground="var(--green)"
          typeCard={"Resident"}
        />
        <StatCard
          title="Phương tiện"
          value="345"
          colorBackground="var(--amber)"
          typeCard={"Vehicle"}
        />
        <StatCard
          title="Tổng khoản thu"
          value="78"
          colorBackground="var(--color-bg-white)"
          typeCard={"Fee"}
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
