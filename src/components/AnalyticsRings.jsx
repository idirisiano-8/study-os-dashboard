import { Target, Flame, CheckCircle, Database } from "lucide-react";

export default function AnalyticsRings({
  reviewsToday = 0,
  backlogTotal = 0,
  streak = 0,
  retention7d = null,
}) {
  return (
    <div
      className="card"
      style={{
        height: "100%",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justify: "space-between",
        boxSizing: "border-box",
      }}
    >
      <p className="card-label" style={{ margin: 0 }}>TODAY</p>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0" }}>
        <svg width="150" height="150" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
          <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
          
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#1D9E75"
            strokeWidth="6"
            fill="none"
            strokeDasharray="251"
            strokeDashoffset={251 - (251 * Math.min(retention7d || 0, 100)) / 100}
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="#E2A03F"
            strokeWidth="6"
            fill="none"
            strokeDasharray="188"
            strokeDashoffset={188 - (188 * Math.min(streak, 30)) / 30}
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke="#3B82F6"
            strokeWidth="6"
            fill="none"
            strokeDasharray="125"
            strokeDashoffset={125 - (125 * Math.min(reviewsToday, 100)) / 100}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ opacity: 0.7, display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle size={13} color="#1D9E75" /> Retention
          </span>
          <span style={{ fontWeight: 600 }}>{retention7d !== null ? `${retention7d.toFixed(0)}%` : "—"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ opacity: 0.7, display: "flex", alignItems: "center", gap: "6px" }}>
            <Flame size={13} color="#E2A03F" /> Streak
          </span>
          <span style={{ fontWeight: 600 }}>{streak}d</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ opacity: 0.7, display: "flex", alignItems: "center", gap: "6px" }}>
            <Target size={13} color="#3B82F6" /> Reviews
          </span>
          <span style={{ fontWeight: 600 }}>{reviewsToday}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ opacity: 0.7, display: "flex", alignItems: "center", gap: "6px" }}>
            <Database size={13} opacity={0.5} /> Backlog
          </span>
          <span style={{ fontWeight: 600 }}>{backlogTotal}</span>
        </div>
      </div>
    </div>
  );
}
