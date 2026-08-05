import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { useChecklist } from "../lib/useChecklist";
import { localDateKey } from "../lib/dateHelpers";
import { computeTasks } from "./DailyTasks";
import { computeLeeches } from "./Leeches";
import { averageSecondsPerCard } from "../lib/pace";
import ProgressRing from "./ProgressRing";
import { displayName } from "../lib/displayName";

const DAILY_ITEMS = [
  "Anki review window completed (45–60 min)",
  "Lecture content reviewed same day, not left for later",
  "New topic run through video → textbook, if applicable today",
  "Targeted questions solved on today's topic, if applicable",
  "New Anki cards created from today's understanding",
  "Gym or football session, if scheduled today",
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function MissionHero({ reviews, snapshots, onNavigate }) {
  const checklist = useChecklist(`daily:${localDateKey()}`, DAILY_ITEMS);

  const mission = useMemo(() => {
    const tasks = computeTasks(reviews, snapshots);
    const top = tasks[0];
    const backlogTotal = snapshots.reduce((s, x) => s + (x.cards_due || 0), 0);
    const leeches = computeLeeches(reviews);

    // uses your own recent pace, not a flat guess — falls back to ~9s/card until there's enough history
    const secPerCard = averageSecondsPerCard(reviews);
    const reviewMinutes = Math.round((backlogTotal * secPerCard) / 60);
    const leechMinutes = Math.min(leeches.length, 5) * 3; // cap the estimate at 5 leeches worth
    const totalMinutes = reviewMinutes + leechMinutes;
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const timeLabel = hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`;

    return { top, backlogTotal, leechCount: leeches.length, timeLabel };
  }, [reviews, snapshots]);

  const doneCount = DAILY_ITEMS.filter((i) => checklist.checked[i]).length;
  const completionPct = Math.round((doneCount / DAILY_ITEMS.length) * 100);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, var(--ink-1), var(--ink-2))",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--card-shadow)",
        padding: "28px 26px",
        marginBottom: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Sparkles size={15} color="var(--amber)" />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-low)" }}>
          {greeting()} — today's mission
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {mission.backlogTotal === 0 ? (
            <p style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "6px 0 4px", color: "var(--text-hi)" }}>
              Backlog's clear — a lighter day.
            </p>
          ) : (
            <p style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "6px 0 4px", color: "var(--text-hi)" }}>
              {mission.top ? `Focus on ${displayName(mission.top.deck)} first` : "Clear the backlog"}, then work through the rest.
            </p>
          )}

          <p style={{ fontSize: 14, color: "var(--text-mid)", margin: 0 }}>
            {mission.backlogTotal} cards due
            {mission.leechCount > 0 && `, including ${mission.leechCount} leech${mission.leechCount === 1 ? "" : "es"} worth rewriting`}
            {" — "}roughly {mission.timeLabel} of focused work.
          </p>
        </div>

        <button
          onClick={() => onNavigate && onNavigate("checklists")}
          style={{ background: "none", border: "none", padding: 0, textAlign: "center", cursor: "pointer" }}
          title="Open full checklist"
        >
          <ProgressRing pct={completionPct} color={completionPct === 100 ? "var(--teal)" : "var(--amber)"} />
          <div style={{ fontSize: 11, color: "var(--text-low)", marginTop: 6, fontFamily: "var(--font-mono)" }}>
            {doneCount}/{DAILY_ITEMS.length} today
          </div>
        </button>
      </div>
    </div>
  );
}
