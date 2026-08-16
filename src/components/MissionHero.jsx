import { useMemo } from "react";
import { motion } from "framer-motion";
import { useChecklist } from "../lib/useChecklist";
import { localDateKey } from "../lib/dateHelpers";
import { computeTasks } from "./DailyTasks";
import { computeLeeches } from "./Leeches";
import { averageSecondsPerCard } from "../lib/pace";
import { displayName } from "../lib/displayName";

const DAILY_ITEMS = [
  "Anki review window completed (45–60 min)",
  "Lecture content reviewed same day, not left for later",
  "New topic run through video → textbook, if applicable today",
  "Targeted questions solved on today's topic, if applicable",
  "New Anki cards created from today's understanding",
  "Gym or football session, if scheduled today",
];

export default function MissionHero({ reviews, snapshots, onNavigate }) {
  const checklist = useChecklist(`daily:${localDateKey()}`, DAILY_ITEMS);

  const mission = useMemo(() => {
    const tasks = computeTasks(reviews, snapshots);
    const top = tasks[0];
    const backlogTotal = snapshots.reduce((s, x) => s + (x.cards_due || 0), 0);
    const leeches = computeLeeches(reviews);

    const secPerCard = averageSecondsPerCard(reviews);
    const reviewMinutes = Math.round((backlogTotal * secPerCard) / 60);
    const leechMinutes = Math.min(leeches.length, 5) * 3;
    const totalMinutes = reviewMinutes + leechMinutes;
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const timeLabel = hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`;

    return { top, backlogTotal, leechCount: leeches.length, timeLabel };
  }, [reviews, snapshots]);

  const doneCount = DAILY_ITEMS.filter((i) => checklist.checked[i]).length;
  const completionPct = Math.round((doneCount / DAILY_ITEMS.length) * 100);

  return (
    <div className="mission-hero">
      <div className="mission-hero-layout">
        <div className="mission-hero-copy">
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

        <motion.button className="mission-hero-checklist"
          onClick={() => onNavigate && onNavigate("checklists")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          title="Open full checklist"
          aria-label={`Open checklist: ${doneCount} of ${DAILY_ITEMS.length} items complete`}
        >
          <span className="mission-completion-value">{completionPct}%</span>
          <div className="mission-hero-checklist-label">{doneCount}/{DAILY_ITEMS.length} today</div>
        </motion.button>
      </div>
    </div>
  );
}
