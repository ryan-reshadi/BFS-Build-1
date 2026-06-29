export function StatCard({ label, value }) {
  return (
    <div className="card stat-card">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}
