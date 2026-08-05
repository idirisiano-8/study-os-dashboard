import { Sun, CalendarDays, GraduationCap } from "lucide-react";
import { useChecklist } from "../lib/useChecklist";
import { isoWeekKey, dateKey } from "../lib/dateHelpers";
import ProgressRing from "./ProgressRing";

const DAILY_ITEMS = [
  "Anki review window completed (45–60 min)",
  "Lecture content reviewed same day, not left for later",
  "New topic run through video → textbook, if applicable today",
  "Targeted questions solved on today's topic, if applicable",
  "New Anki cards created from today's understanding",
  "Gym or football session, if scheduled today",
];

const WEEKLY_ITEMS = [
  "Sunday Weekly Review completed",
  "Weekly Plan filled out for the coming week",
  "Anki backlog number logged and trend checked",
  "4 gym sessions and 2 football sessions completed or consciously adjusted",
];

const SEMESTER_ITEMS = [
  "Semester Review completed for the closing semester",
  "New Semester Plan filled out with updated timetable and syllabi",
  "Resource Map reviewed — still accurate, or needs adjustment?",
];

export default function Checklists() {
  const daily = useChecklist(`daily:${dateKey()}`, DAILY_ITEMS);
  const weekly = useChecklist(`weekly:${isoWeekKey()}`, WEEKLY_ITEMS);
  const semester = useChecklist("semester:current", SEMESTER_ITEMS);

  return (
    <div>
      <ChecklistCard title="Today" icon={Sun} items={DAILY_ITEMS} state={daily} />
      <ChecklistCard title="This week" icon={CalendarDays} items={WEEKLY_ITEMS} state={weekly} />
      <ChecklistCard title="This semester" icon={GraduationCap} items={SEMESTER_ITEMS} state={semester} />
    </div>
  );
}

function ChecklistCard({ title, icon: Icon, items, state }) {
  const doneCount = items.filter((item) => state.checked[item]).length;
  const pct = items.length ? (doneCount / items.length) * 100 : 0;
  return (
    <section className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p className="card-label" style={{ margin: 0 }}>{Icon && <Icon size={13} />}{title}</p>
        {!state.loading && (
          <ProgressRing
            pct={pct}
            size={46}
            stroke={4}
            color={pct === 100 ? "var(--teal)" : pct > 0 ? "var(--amber)" : "var(--text-low)"}
          />
        )}
      </div>
      {state.loading ? (
        <p className="loading">Loading…</p>
      ) : (
        items.map((item) => (
          <label
            key={item}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "8px 0",
              cursor: "pointer",
              fontSize: 14,
              color: state.checked[item] ? "var(--text-low)" : "var(--text-hi)",
              textDecoration: state.checked[item] ? "line-through" : "none",
            }}
          >
            <input
              type="checkbox"
              checked={!!state.checked[item]}
              onChange={() => state.toggle(item)}
              style={{ marginTop: 3, accentColor: "var(--amber)" }}
            />
            {item}
          </label>
        ))
      )}
    </section>
  );
}
