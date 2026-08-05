import { useMemo } from "react";

const MIN_SAMPLE = 8;
const LOOKBACK_MS = 30 * 24 * 60 * 60 * 1000; // retention window: last 30 days

/**
 * Weakness score per deck = a blend of:
 *  - how large the backlog is, relative to the biggest backlog deck (urgency)
 *  - how low retention is, relative to a solid 90% baseline (fragility)
 * Both are normalized 0-1 and averaged, so a deck can rank high either by
 * being badly behind, or by being actively mis-remembered, or both.
 */
export function computeTasks(reviews, snapshots) {
  const since = Date.now() - LOOKBACK_MS;
  const byDeck = new Map();
  for (const r of reviews) {
    if (new Date(r.reviewed_at).getTime() < since) continue;
    if (!byDeck.has(r.deck_name)) byDeck.set(r.deck_name, { total: 0, correct: 0 });
    const e = byDeck.get(r.deck_name);
    e.total += 1;
    if (r.is_correct) e.correct += 1;
  }

  const maxBacklog = Math.max(...snapshots.map((s) => s.cards_due || 0), 1);

  const rows = snapshots
    .map((s) => {
      const stat = byDeck.get(s.deck_name);
      const retention = stat && stat.total >= MIN_SAMPLE ? (stat.correct / stat.total) * 100 : null;
      const backlogNorm = (s.cards_due || 0) / maxBacklog;
      const fragilityNorm = retention !== null ? Math.max(0, (90 - retention) / 90) : 0.3; // unknown retention treated as mild concern
      const score = backlogNorm * 0.55 + fragilityNorm * 0.45;
      return {
        deck: s.deck_name,
        cardsDue: s.cards_due || 0,
        retention,
        sampleSize: stat ? stat.total : 0,
        score,
      };
    })
    .filter((r) => r.cardsDue > 0 || r.retention !== null)
    .sort((a, b) => b.score - a.score);

  return rows.slice(0, 5);
}

function reasonFor(row) {
  const parts = [];
  if (row.cardsDue > 0) parts.push(`${row.cardsDue} cards due`);
  if (row.retention !== null) {
    parts.push(`${row.retention.toFixed(0)}% retention over ${row.sampleSize} reviews`);
  } else {
    parts.push("not enough recent reviews to score retention");
  }
  return parts.join(" · ");
}

export default function DailyTasks({ reviews, snapshots }) {
  const tasks = useMemo(() => computeTasks(reviews, snapshots), [reviews, snapshots]);

  if (!tasks.length) {
    return <p className="empty-state">Nothing due, and no retention data yet — a genuinely clear day.</p>;
  }

  return (
    <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {tasks.map((t, i) => (
        <li
          key={t.deck}
          style={{
            display: "flex",
            gap: 14,
            padding: "12px 0",
            borderTop: i === 0 ? "none" : "1px solid var(--line)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-low)",
              width: 18,
              flexShrink: 0,
              paddingTop: 2,
            }}
          >
            {i + 1}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-hi)" }}>{t.deck}</div>
            <div style={{ fontSize: 12, color: "var(--text-mid)", marginTop: 2 }}>
              {reasonFor(t)}
            </div>
          </div>
          <ScorePill score={t.score} />
        </li>
      ))}
    </ol>
  );
}

function ScorePill(props) {
  const { score } = props;
  const color = score > 0.6 ? "var(--red)" : score > 0.35 ? "var(--amber)" : "var(--teal)";
  const label = score > 0.6 ? "high priority" : score > 0.35 ? "moderate" : "low";
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color,
        border: `1px solid ${color}`,
        borderRadius: 3,
        padding: "3px 8px",
        alignSelf: "flex-start",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
