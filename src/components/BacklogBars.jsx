import { motion } from "framer-motion";
import { colorForSubject } from "../lib/subjectColors";
import { displayName } from "../lib/displayName";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const rowVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

export default function BacklogBars({ snapshots }) {
  if (!snapshots.length) {
    return <p className="empty-state">No snapshot yet — run a sync first.</p>;
  }

  const sorted = [...snapshots].sort((a, b) => b.cards_due - a.cards_due);
  const max = Math.max(...sorted.map((s) => s.cards_due), 1);

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {sorted.map((s) => (
        <motion.div key={s.deck_name} variants={rowVariant} style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              marginBottom: 4,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-hi)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: colorForSubject(s.deck_name) }} />
              {displayName(s.deck_name)}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-mid)" }}>
              {s.cards_due}
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: "var(--ink-2)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(2, (s.cards_due / max) * 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              style={{
                height: "100%",
                background: barColor(s.cards_due, max),
                borderRadius: 2,
              }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function barColor(value, max) {
  const ratio = value / max;
  if (ratio > 0.66) return "var(--red)";
  if (ratio > 0.33) return "var(--amber)";
  return "var(--teal)";
}
