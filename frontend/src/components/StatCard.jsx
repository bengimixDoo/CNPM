import HomeFilledIcon from "@mui/icons-material/HomeFilled";

export default function StatCard({ title, value, colorBackground }) {
  return (
    <div className="stat-card" style={{ "--card-color": colorBackground }}>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">
          <HomeFilledIcon />
          <div className="stat-number" style={{ fontSize: "30px" }}>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}
