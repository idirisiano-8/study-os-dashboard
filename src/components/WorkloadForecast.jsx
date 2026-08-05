import { useMemo } from "react";

/**
 * Uses the last ~10 days of daily_snapshots (summed across decks) to fit a
 * simple linear trend, then projects 3 days forward. This is deliberately
 * simple — no per-card due-date modeling, just "is the backlog visibly
 * climbing, and if so, where does that put us in 3 days."
 */
export function computeForecast(snapshotHistory) {
  const byDate = new Map();
  for (const s of snapshotHistory) {
    byDate.set(s.snapshot_date, (byDate.get(s.snapshot_date) || 0) + (s.cards_due || 0));
  }
  const points = [...byDate.entries()]
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .slice(-10)
    .map(([date, total], i) => ({ x: i, total, date }));

  if (points.length < 3) return null;

  // simple linear regression
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.total, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.total, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sumXX - sumX * sumX;
  const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
  const intercept = (sumY - slope * sumX) / n;

  const current = points[points.length - 1].total;
  const projected3d = Math.max(0, Math.round(intercept + slope * (points.length - 1 + 3)));

  return { current, projected3d, slope, points };
}

export default function WorkloadForecast({ snapshotHistory }) {
  const forecast = useMemo(() => computeForecast(snapshotHistory), [snapshotHistory]);

  if (!forecast) {
    return (
      <p className="empty-state">
        Need a few more days of sync history before a trend can be projected.
      </p>
    );
  }

  const { current, projected3d, slope } = forecast;
  const delta = projected3d - current;
  const rising = slope > 2;
  const falling = slope < -2;

  return (
    <div>
      <div style={{ display: "flex", gap: 24, marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 700, color: "var(--text-hi)" }}>
            {current}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-mid)" }}>due today</div>
        </div>
        <div style={{ alignSelf: "center", color: "var(--text-low)", fontSize: 18 }}>→</div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 24,
              fontWeight: 700,
              color: rising ? "var(--red)" : falling ? "var(--teal)" : "var(--text-hi)",
            }}
          >
            {projected3d}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-mid)" }}>projected in 3 days</div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-mid)", margin: 0 }}>
        {rising && (
          <>Backlog is trending up (~{Math.round(slope)}/day). At this rate it grows by {delta > 0 ? delta : 0} over the next 3 days — worth pulling forward some review time before it compounds.</>
        )}
        {falling && (
          <>Backlog is trending down (~{Math.abs(Math.round(slope))}/day fewer). Current pace is working — keep it going.</>
        )}
        {!rising && !falling && <>Backlog is holding roughly steady — no action needed based on trend alone.</>}
      </p>
    </div>
  );
}
