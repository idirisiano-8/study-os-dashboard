import { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";
import { computeTasks } from "./DailyTasks";
import { computeLeeches } from "./Leeches";
import { resourcesFor } from "../lib/resourceMap";
import { colorForSubject } from "../lib/subjectColors";
import { displayName } from "../lib/displayName";
import { averageSecondsPerCard } from "../lib/pace";

function reasonsFor(task) {
  const reasons = [];
  if (task.cardsDue > 100) reasons.push("Large backlog");
  else if (task.cardsDue > 0) reasons.push(`${task.cardsDue} cards due`);
  if (task.retention !== null && task.retention < 70) reasons.push("Retention is low");
  else if (task.retention !== null && task.retention < 85) reasons.push("Retention could be stronger");
  if (task.retention === null) reasons.push("Not enough recent data to score retention");
  return reasons;
}

function timeForRank(i, cardsDue, secPerCard) {
  const base = [45, 30, 20, 15, 10][i] || 10;
  const cardDriven = Math.round((cardsDue * secPerCard) / 60);
  return Math.max(10, Math.min(base, cardDriven || base));
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const row = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function StudySessions({ reviews, snapshots }) {
  const sessions = useMemo(() => {
    const tasks = computeTasks(reviews, snapshots).slice(0, 3);
    const leeches = computeLeeches(reviews);
    const secPerCard = averageSecondsPerCard(reviews);

    const out = tasks.map((t, i) => ({
      title: t.deck,
      minutes: timeForRank(i, t.cardsDue, secPerCard),
      reasons: reasonsFor(t),
      resources: resourcesFor(t.deck),
    }));

    if (leeches.length > 0) {
      out.push({
        title: "Rewrite leech cards",
        minutes: Math.min(leeches.length, 5) * 3,
        reasons: [`${leeches.length} card${leeches.length === 1 ? "" : "s"} failed repeatedly`, "Rewriting beats re-drilling as-is"],
        resources: null,
      });
    }

    return out;
  }, [reviews, snapshots]);

  if (!sessions.length) {
    return <p className="empty-state">Nothing to schedule right now — enjoy the lighter day.</p>;
  }

  return (
    <motion.div
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {sessions.map((s, i) => (
        <motion.div
          key={s.title}
          variants={row}
          style={{
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
            padding: "14px 16px",
            background: "var(--ink-2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--text-hi)" }}>
              <span
                style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                  background: s.title === "Rewrite leech cards" ? "var(--red)" : colorForSubject(s.title),
                }}
              />
              Session {i + 1} — {displayName(s.title)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-mid)" }}>
              <Clock size={12} />{s.minutes} min
            </span>
          </div>
          <ul style={{ margin: "0 0 8px", paddingLeft: 18, fontSize: 12, color: "var(--text-mid)" }}>
            {s.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          {s.resources && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "var(--text-low)" }}>
              <BookOpen size={12} style={{ marginTop: 2, flexShrink: 0 }} />
              <span>{s.resources.join(" · ")}</span>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
