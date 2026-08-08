import { useMemo } from "react";
import { motion } from "framer-motion";
import { computeReadiness } from "./ReadinessScores";
import { computeFatigue } from "./FatigueFlag";
import { computeForecast } from "./WorkloadForecast";
import { computeWeakTags } from "./WeakTags";
import { displayName } from "../lib/displayName";

function Narrative({ children, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function ReadinessNarrative({ reviews, snapshots }) {
  const rows = useMemo(() => computeReadiness(reviews, snapshots), [reviews, snapshots]);
  const best = rows[0];
  const worst = rows[rows.length - 1];

  if (!rows.length) return <p className="empty-state">No deck data yet.</p>;

  return (
    <Narrative>
      {best && best.score >= 75 && (
        <p style={{ fontSize: 14, color: "var(--text-hi)", margin: "0 0 8px", lineHeight: 1.6 }}>
          <strong>{displayName(best.deck)}</strong> is close to exam-ready ({best.score}/100). One more focused
          session should push it higher.
        </p>
      )}
      {worst && worst.score < 60 && (
        <p style={{ fontSize: 14, color: "var(--text-hi)", margin: 0, lineHeight: 1.6 }}>
          <strong>{displayName(worst.deck)}</strong> is the furthest behind ({worst.score}/100)
          {worst.retention !== null ? `, at ${worst.retention.toFixed(0)}% retention` : ""}. Worth
          prioritizing before it compounds.
        </p>
      )}
      {(!worst || worst.score >= 60) && (!best || best.score < 75) && (
        <p style={{ fontSize: 14, color: "var(--text-mid)", margin: 0 }}>
          Everything's in a middling, workable range — no single deck stands out as urgent right now.
        </p>
      )}
    </Narrative>
  );
}

export function FatigueNarrative({ reviews }) {
  const f = useMemo(() => computeFatigue(reviews), [reviews]);

  if (f.status === "insufficient") {
    return (
      <Narrative>
        <p style={{ fontSize: 14, color: "var(--text-mid)", margin: 0 }}>
          {f.count} review{f.count === 1 ? "" : "s"} so far today — too early to tell how the session's going.
        </p>
      </Narrative>
    );
  }
  if (f.status === "fatigued") {
    return (
      <Narrative>
        <p style={{ fontSize: 14, color: "var(--amber)", margin: 0, lineHeight: 1.6 }}>
          You've been at it a while and accuracy has dropped {Math.round(f.drop)} points
          ({Math.round(f.firstAcc)}% → {Math.round(f.secondAcc)}%). A short break will likely help
          more than pushing through.
        </p>
      </Narrative>
    );
  }
  return (
    <Narrative>
      <p style={{ fontSize: 14, color: "var(--text-hi)", margin: 0 }}>
        Accuracy's holding steady this session ({Math.round(f.firstAcc)}% → {Math.round(f.secondAcc)}%) — good pace to keep going.
      </p>
    </Narrative>
  );
}

export function WeakTagNarrative({ reviews }) {
  const ranked = useMemo(() => computeWeakTags(reviews), [reviews]);
  const worst = ranked[0];

  if (!worst) {
    return (
      <Narrative>
        <p style={{ fontSize: 14, color: "var(--text-mid)", margin: 0 }}>
          Not enough tagged reviews yet to call out a specific weak topic.
        </p>
      </Narrative>
    );
  }

  return (
    <Narrative>
      <p style={{ fontSize: 14, color: "var(--text-hi)", margin: 0, lineHeight: 1.6 }}>
        <strong>{displayName(worst.tag)}</strong> is your weakest tag right now, at {worst.pct.toFixed(0)}%
        retention over {worst.total} reviews. Worth prioritizing before starting new content.
      </p>
    </Narrative>
  );
}

export function ForecastNarrative({ snapshotHistory }) {
  const forecast = useMemo(() => computeForecast(snapshotHistory), [snapshotHistory]);

  if (!forecast) {
    return (
      <Narrative>
        <p style={{ fontSize: 14, color: "var(--text-mid)", margin: 0 }}>
          Need a few more days of sync history before a trend can be projected.
        </p>
      </Narrative>
    );
  }

  const { current, projected3d, slope } = forecast;
  const delta = projected3d - current;
  const rising = slope > 2;
  const falling = slope < -2;

  if (rising) {
    return (
      <Narrative>
        <p style={{ fontSize: 14, color: "var(--amber)", margin: 0, lineHeight: 1.6 }}>
          Your backlog is likely to reach <strong>{projected3d}</strong> within 3 days if the current
          pace holds. Working {delta > 0 ? delta : 20}+ extra reviews today would head that off.
        </p>
      </Narrative>
    );
  }
  if (falling) {
    return (
      <Narrative>
        <p style={{ fontSize: 14, color: "var(--teal)", margin: 0, lineHeight: 1.6 }}>
          Backlog is trending down — projected at <strong>{projected3d}</strong> in 3 days. Current pace is working.
        </p>
      </Narrative>
    );
  }
  return (
    <Narrative>
      <p style={{ fontSize: 14, color: "var(--text-hi)", margin: 0 }}>
        Backlog's holding steady around <strong>{current}</strong> — no red flags on trend alone.
      </p>
    </Narrative>
  );
}
