import { motion } from "framer-motion";
import ProgressRing from "./ProgressRing";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

export default function SummaryStrip({ reviewsToday, backlogTotal, streak, retention7d }) {
  return (
    <motion.div
      className="summary-grid"
      variants={container}
      initial="hidden"
      animate="show"
    >
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
      <motion.div
        className="summary-cell"
        variants={item}
        style={{ display: "flex", alignItems: "center", gap: 12 }}
      >
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
      </motion.div>
    </motion.div>
  );
}

function Cell({ value, label, status }) {
  return (
    <motion.div className={`summary-cell status-${status}`} variants={item}>
      <span className="num">{value}</span>
      <span className="label">{label}</span>
    </motion.div>
  );
}
