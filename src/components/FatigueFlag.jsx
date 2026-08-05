import { useMemo } from "react";
import { localDateKey } from "../lib/dateHelpers";

const MIN_SESSION_SIZE = 20; // need enough of today's reviews to say anything meaningful

export function computeFatigue(reviews) {
  const todayKey = localDateKey();
  const today = reviews
    .filter((r) => localDateKey(r.reviewed_at) === todayKey)
    .sort((a, b) => new Date(a.reviewed_at) - new Date(b.reviewed_at));

  if (today.length < MIN_SESSION_SIZE) return { status: "insufficient", count: today.length };

  const mid = Math.floor(today.length / 2);
  const firstHalf = today.slice(0, mid);
  const secondHalf = today.slice(mid);

  const acc = (arr) => arr.filter((r) => r.is_correct).length / arr.length;
  const firstAcc = acc(firstHalf) * 100;
  const secondAcc = acc(secondHalf) * 100;
  const drop = firstAcc - secondAcc;

  return { status: drop >= 15 ? "fatigued" : "ok", firstAcc, secondAcc, drop, count: today.length };
}

export default function FatigueFlag({ reviews }) {
  const f = useMemo(() => computeFatigue(reviews), [reviews]);

  if (f.status === "insufficient") {
    return (
      <p className="empty-state">
        {f.count} review{f.count === 1 ? "" : "s"} so far today — not enough yet to check for
        fatigue (needs {MIN_SESSION_SIZE}+).
      </p>
    );
  }

  if (f.status === "fatigued") {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>⚠</span>
        <div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--amber)", fontWeight: 600 }}>
            Accuracy dropped {Math.round(f.drop)} points this session
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-mid)" }}>
            {Math.round(f.firstAcc)}% early on, down to {Math.round(f.secondAcc)}% now. This
            usually means diminishing returns, not more failures to fix — a short break or
            stopping for today will likely serve retention better than pushing through.
          </p>
        </div>
      </div>
    );
  }

  return (
    <p style={{ fontSize: 13, color: "var(--text-mid)", margin: 0 }}>
      Accuracy steady across today's session ({Math.round(f.firstAcc)}% → {Math.round(f.secondAcc)}%) — no fatigue signal.
    </p>
  );
}
