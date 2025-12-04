import StatCard from "../components/StatCard.jsx";
import "../styles/AdminDashboard.css";

export default function Residents() {
  return (
    <>
      <div className="dashboard-grid">
        <div className="stats-row">
          <StatCard title="Tổng cư dân" value="1,234" colorBackground="var(--green)" />
        </div>
      </div>
    </>
  );
}
