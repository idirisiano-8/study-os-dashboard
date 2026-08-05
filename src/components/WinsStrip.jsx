import { useMemo } from "react";
import { Trophy, Flame, TrendingUp, Star } from "lucide-react";

const MIN_SAMPLE = 6;

function computeWins(reviews, snapshotHistory, streak) {
  const wins = [];
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

  const thisWeek = reviews.filter((r) => new Date(r.reviewed_at).getTime() >= weekAgo);
  const lastWeek = reviews.filter((r) => {
    const t = new Date(r.reviewed_at).getTime();
    return t >= twoWeeksAgo && t < weekAgo;
  });

  if (streak >= 3) {
    wins.push({ icon: Flame, text: `${streak}-day review streak`, color: "var(--amber)" });
  }

  // backlog trend
  const byDate = new Map();
  for (const s of snapshotHistory) byDate.set(s.snapshot_date, (byDate.get(s.snapshot_date) || 0) + (s.cards_due || 0));
  const dates = [...byDate.keys()].sort();
  if (dates.length > 3) {
    const start = byDate.get(dates[0]);
    const end = byDate.get(dates[dates.length - 1]);
    if (start > 0 && end < start) {
      const pct = Math.round(((start - end) / start) * 100);
      if (pct >= 10) wins.push({ icon: Trophy, text: `Backlog down ${pct}% this stretch`, color: "var(--teal)" });
    }
  }

  // retention improvement week over week
  if (thisWeek.length >= MIN_SAMPLE && lastWeek.length >= MIN_SAMPLE) {
    const thisAcc = (thisWeek.filter((r) => r.is_correct).length / thisWeek.length) * 100;
    const lastAcc = (lastWeek.filter((r) => r.is_correct).length / lastWeek.length) * 100;
    if (thisAcc - lastAcc >= 5) {
      wins.push({ icon: TrendingUp, text: `Retention up ${Math.round(thisAcc - lastAcc)} points this week`, color: "var(--teal)" });
    }
  }

  // best performing deck this week
  const byDeck = new Map();
  for (const r of thisWeek) {
    if (!byDeck.has(r.deck_name)) byDeck.set(r.deck_name, { total: 0, correct: 0 });
    const e = byDeck.get(r.deck_name);
    e.total += 1;
    if (r.is_correct) e.correct += 1;
  }
  let best = null;
  for (const [deck, e] of byDeck.entries()) {
    if (e.total >= MIN_SAMPLE) {
      const pct = (e.correct / e.total) * 100;
      if (pct >= 90 && (!best || pct > best.pct)) best = { deck, pct };
    }
  }
  if (best) wins.push({ icon: Star, text: `${best.deck} at ${Math.round(best.pct)}% retention`, color: "var(--amber)" });

  return wins;
}

export default function WinsStrip({ reviews, snapshotHistory, streak }) {
  const wins = useMemo(() => computeWins(reviews, snapshotHistory, streak), [reviews, snapshotHistory, streak]);

  if (!wins.length) {
    return (
      <p style={{ fontSize: 13, color: "var(--text-mid)", margin: 0 }}>
        No standout wins to call out yet this week — keep at it, they'll show up here once the trend is clear.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {wins.map((w, i) => {
        const Icon = w.icon;
        return (
          <span
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: 999,
              border: `1px solid ${w.color}`,
              color: w.color,
            }}
          >
            <Icon size={13} />
            {w.text}
          </span>
        );
      })}
    </div>
  );
}
