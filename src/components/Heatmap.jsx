import { useMemo } from "react";
import { localDateKey } from "../lib/dateHelpers";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKS_BACK = 18; // ~4.5 months, fits one screen width

/**
 * Turns raw review rows into a per-day { count, accuracyPct } map,
 * then lays them out as a week-column grid, like a lab chart strip
 * rather than the default GitHub-green contribution grid.
 */
function buildDayMap(reviews) {
  const map = new Map();
  for (const r of reviews) {
    const day = localDateKey(r.reviewed_at);
    if (!map.has(day)) map.set(day, { total: 0, correct: 0 });
    const entry = map.get(day);
    entry.total += 1;
    if (r.is_correct) entry.correct += 1;
  }
  return map;
}

function colorFor(entry) {
  if (!entry || entry.total === 0) return "var(--ink-2)";
  const acc = entry.correct / entry.total;
  // volume drives opacity, accuracy drives hue (teal = strong, amber = shaky)
  const intensity = Math.min(1, 0.25 + entry.total / 40);
  const hue = acc >= 0.85 ? "79, 158, 141" : acc >= 0.7 ? "217, 164, 65" : "201, 106, 90";
  return `rgba(${hue}, ${intensity.toFixed(2)})`;
}

export default function Heatmap({ reviews }) {
  const dayMap = useMemo(() => buildDayMap(reviews), [reviews]);

  const { columns, monthLabels } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // align the grid end to the most recent Saturday so weeks are full columns
    const endDow = today.getDay(); // 0 = Sun
    const gridEnd = new Date(today.getTime() + (6 - endDow) * DAY_MS);
    const totalDays = WEEKS_BACK * 7;
    const gridStart = new Date(gridEnd.getTime() - (totalDays - 1) * DAY_MS);

    const cols = [];
    const labels = [];
    let lastMonth = null;
    for (let w = 0; w < WEEKS_BACK; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(gridStart.getTime() + (w * 7 + d) * DAY_MS);
        const key = localDateKey(date);
        week.push({ key, date, entry: dayMap.get(key), future: date > today });
        if (d === 0) {
          const m = date.toLocaleDateString(undefined, { month: "short" });
          if (m !== lastMonth) {
            labels.push({ col: w, m });
            lastMonth = m;
          }
        }
      }
      cols.push(week);
    }
    return { columns: cols, monthLabels: labels };
  }, [dayMap]);

  const cell = 13;
  const gap = 3;
  const width = WEEKS_BACK * (cell + gap);

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${7 * (cell + gap) + 16}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label="Anki review activity, past 18 weeks"
      >
        {monthLabels.map((m, i) => (
          <text
            key={i}
            x={m.col * (cell + gap)}
            y={10}
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
            fill="var(--text-low)"
          >
            {m.m}
          </text>
        ))}
        {columns.map((week, w) =>
          week.map((day, d) => (
            <rect
              key={day.key}
              x={w * (cell + gap)}
              y={16 + d * (cell + gap)}
              width={cell}
              height={cell}
              rx={2}
              fill={day.future ? "transparent" : colorFor(day.entry)}
              stroke={day.future ? "var(--line)" : "none"}
              strokeDasharray={day.future ? "2,2" : "0"}
            >
              <title>
                {day.key}
                {day.entry
                  ? ` — ${day.entry.total} reviews, ${Math.round(
                      (day.entry.correct / day.entry.total) * 100
                    )}% correct`
                  : " — no reviews"}
              </title>
            </rect>
          ))
        )}
      </svg>
      <div
        style={{
          display: "flex",
          gap: 14,
          marginTop: 12,
          fontSize: 11,
          color: "var(--text-low)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <LegendDot color="rgba(79,158,141,0.9)" label="strong (≥85%)" />
        <LegendDot color="rgba(217,164,65,0.9)" label="shaky (70–84%)" />
        <LegendDot color="rgba(201,106,90,0.9)" label="weak (<70%)" />
        <LegendDot color="var(--ink-2)" label="no reviews" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          background: color,
          display: "inline-block",
        }}
      />
      {label}
    </span>
  );
}
