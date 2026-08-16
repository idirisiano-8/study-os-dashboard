import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { localDateKey } from "../lib/dateHelpers";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CompactCalendar({ reviews }) {
  const now = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const todayKey = localDateKey(now);

  const studiedDays = useMemo(
    () => new Set(reviews.map((r) => localDateKey(r.reviewed_at))),
    [reviews]
  );

  const grid = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewYear, viewMonth, day);
      const key = localDateKey(date);
      cells.push({ day, key, studied: studiedDays.has(key) });
    }
    return cells;
  }, [viewYear, viewMonth, studiedDays]);

  function goPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const monthLabel =
    MONTH_LABELS[viewMonth] + (viewYear !== now.getFullYear() ? ` ${viewYear}` : "");

  return (
    <section className="card calendar-card">
      <div className="calendar-header">
        <button
          type="button"
          className="calendar-nav-btn"
          onClick={goPrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={14} />
        </button>
        <p className="card-label calendar-month-label">{monthLabel}</p>
        <button
          type="button"
          className="calendar-nav-btn"
          onClick={goNextMonth}
          aria-label="Next month"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="calendar-weekday-row">
        {WEEKDAY_LABELS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {grid.map((cell, i) =>
          cell ? (
            <span
              key={cell.key}
              className={
                "calendar-day" +
                (cell.studied ? " calendar-day-studied" : "") +
                (cell.key === todayKey ? " calendar-day-today" : "")
              }
            >
              {cell.day}
            </span>
          ) : (
            <span key={`blank-${i}`} className="calendar-day calendar-day-blank" />
          )
        )}
      </div>

      <div className="calendar-legend">
        <span className="calendar-legend-dot calendar-legend-dot-studied" />
        Studied
        <span className="calendar-legend-dot calendar-legend-dot-today" />
        Today
      </div>
    </section>
  );
}
