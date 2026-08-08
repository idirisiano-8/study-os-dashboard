import { useMemo } from "react";
import { motion } from "framer-motion";
import { colorForSubject } from "../lib/subjectColors";
import { displayName } from "../lib/displayName";

const MIN_SAMPLE = 8;
const LOOKBACK_MS = 30 * 24 * 60 * 60 * 1000;

export function computeReadiness(reviews, snapshots) {
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

  return snapshots
    .map((s) => {
      const stat = byDeck.get(s.deck_name);
      const hasRetention = stat && stat.total >= MIN_SAMPLE;
      const retention = hasRetention ? (stat.correct / stat.total) * 100 : null;
      const backlogRatio = (s.cards_due || 0) / maxBacklog;
      const base = retention !== null ? retention : 55;
      const score = Math.max(0, Math.round(base * (1 - backlogRatio * 0.4)));
      return { deck: s.deck_name, score, retention, cardsDue: s.cards_due || 0 };
    })
    .sort((a, b) => b.score - a.score);
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const rowVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

export default function ReadinessScores({ reviews, snapshots }) {
  const rows = useMemo(() => computeReadiness(reviews, snapshots), [reviews, snapshots]);

  if (!rows.length) {
    return <p className="empty-state">No deck data yet — run a sync and readiness scores will appear here.</p>;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {rows.map((r) => (
        <motion.div key={r.deck} variants={rowVariant} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, marginBottom: 4 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-hi)" }}>
              <span
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: colorForSubject(r.deck), flexShrink: 0,
                }}              />
              {displayName(r.deck)}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: scoreColor(r.score) }}>
              {masteryLabel(r.score)}
            </span>
          </div>
          <div style={{ height: 6, background: "var(--ink-2)", borderRadius: 2, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${r.score}%` }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              style={{
                height: "100%",
                background: scoreColor(r.score),
                borderRadius: 2,
              }}
            />
          </div>
        </motion.div>
      ))}
      <p style={{ fontSize: 11, color: "var(--text-low)", marginTop: 12, marginBottom: 0 }}>
        Score blends 30-day retention with current backlog size — a deck can score low either
        from weak recall or from being badly behind, or both.
      </p>
    </motion.div>
  );
}

function scoreColor(score) {
  if (score >= 75) return "var(--teal)";
  if (score >= 50) return "var(--amber)";
  return "var(--red)";
}

function masteryLabel(score) {
  if (score >= 85) return "MASTERED";
  if (score >= 70) return "PROFICIENT";
  if (score >= 50) return "FAMILIAR";
  return "DEVELOPING";
}
