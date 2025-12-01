export default function StatCard({ title, value, suffix, colorClass = "card--primary" }) {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-card__inner">
        <div className="stat-title">{title}</div>
        <div className="stat-value">
          {value} {suffix}
        </div>
      </div>
    </div>
  );
}
