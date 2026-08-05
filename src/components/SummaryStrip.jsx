import ProgressRing from "./ProgressRing";

export default function SummaryStrip({ reviewsToday, backlogTotal, streak, retention7d }) {
  return (
    <div className="summary-grid">
      <Cell
        value={reviewsToday}
        label="reviews today"
        status={reviewsToday > 0 ? "ok" : "warn"}
      />
      <Cell
        value={backlogTotal}
        label="cards due, total"
        status={backlogTotal > 500 ? "critical" : backlogTotal > 150 ? "warn" : "ok"}
      />
      <Cell
        value={`${streak}d`}
        label="review streak"
        status={streak >= 3 ? "ok" : "neutral"}
      />
      <div className="summary-cell" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {retention7d !== null ? (
          <ProgressRing
            pct={retention7d}
            size={44}
            stroke={4}
            color={retention7d >= 85 ? "var(--teal)" : retention7d >= 70 ? "var(--amber)" : "var(--red)"}
          />
        ) : (
          <span className="num" style={{ fontSize: 28 }}>—</span>
        )}
        <span className="label">retention, 7d</span>
      </div>
    </div>
  );
}

function Cell({ value, label, status }) {
  return (
    <div className={`summary-cell status-${status}`}>
      <span className="num">{value}</span>
      <span className="label">{label}</span>
    </div>
  );
}
