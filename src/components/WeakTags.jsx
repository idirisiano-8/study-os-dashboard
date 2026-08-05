import { useMemo } from "react";
import { displayName } from "../lib/displayName";

const MIN_SAMPLE = 8; // ignore tags with too few reviews to be meaningful

export function computeWeakTags(reviews) {
  const byTag = new Map();
  for (const r of reviews) {
    const tags = r.note_tags && r.note_tags.length ? r.note_tags : ["(untagged)"];
    for (const tag of tags) {
      if (!byTag.has(tag)) byTag.set(tag, { total: 0, correct: 0 });
      const e = byTag.get(tag);
      e.total += 1;
      if (r.is_correct) e.correct += 1;
    }
  }
  return [...byTag.entries()]
    .filter(([, e]) => e.total >= MIN_SAMPLE)
    .map(([tag, e]) => ({ tag, total: e.total, pct: (e.correct / e.total) * 100 }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 8);
}

export default function WeakTags({ reviews }) {
  const ranked = useMemo(() => computeWeakTags(reviews), [reviews]);

  if (!ranked.length) {
    return (
      <p className="empty-state">
        Still building up tag history — once you've logged {MIN_SAMPLE}+ reviews on a tag, your
        weakest topics will start showing up here.
      </p>
    );
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ color: "var(--text-low)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
          <th style={th}>TAG</th>
          <th style={{ ...th, textAlign: "right" }}>REVIEWS</th>
          <th style={{ ...th, textAlign: "right" }}>RETENTION</th>
        </tr>
      </thead>
      <tbody>
        {ranked.map((r) => (
          <tr key={r.tag} style={{ borderTop: "1px solid var(--line)" }}>
            <td style={td} title={r.tag}>{displayName(r.tag)}</td>
            <td style={{ ...td, textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--text-mid)" }}>
              {r.total}
            </td>
            <td style={{ ...td, textAlign: "right" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: r.pct < 70 ? "var(--red)" : r.pct < 85 ? "var(--amber)" : "var(--teal)",
                }}
              >
                {r.pct.toFixed(0)}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th = { textAlign: "left", padding: "6px 4px", fontWeight: 500 };
const td = { padding: "8px 4px" };
