import HomeFilledIcon from "@mui/icons-material/HomeFilled";

export default function StatCard({ title, value, colorBackground }) {
  return (
    <div className="stat-card" style={{ "--card-color": colorBackground }}>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}
