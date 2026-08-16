import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame, Layers3, RefreshCw, TrendingUp } from "lucide-react";

function valueToPercent(value, max) {
  return Math.max(4, Math.min(100, (value / max) * 100));
}

export function StudyOverview({ reviewsToday, backlogTotal, streak, retention7d }) {
  const metrics = [
    { label: "Reviews", value: reviewsToday, color: "var(--teal)", pct: valueToPercent(reviewsToday, Math.max(100, backlogTotal || 100)), icon: RefreshCw },
    { label: "Due", value: backlogTotal, color: "var(--amber)", pct: valueToPercent(backlogTotal, Math.max(800, backlogTotal || 800)), icon: Layers3 },
    { label: "Streak", value: `${streak}d`, color: "#7a70b7", pct: valueToPercent(streak, 14), icon: Flame },
    { label: "Retention", value: retention7d === null ? "—" : `${Math.round(retention7d)}%`, color: "var(--teal)", pct: retention7d ?? 0, icon: TrendingUp },
  ];

  return (
    <section className="overview-card" aria-label="Study overview">
      <div className="overview-rings" aria-hidden="true">
        <svg viewBox="0 0 176 176">
          {metrics.map((metric, index) => {
            const radius = 70 - index * 13;
            const circumference = 2 * Math.PI * radius;
            return (
              <g key={metric.label} transform="rotate(-90 88 88)">
                <circle className="overview-ring-track" cx="88" cy="88" r={radius} />
                <motion.circle
                  className="overview-ring-progress"
                  cx="88" cy="88" r={radius}
                  stroke={metric.color}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference * (1 - metric.pct / 100) }}
                  transition={{ duration: 0.9, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="overview-copy">
        <h2>Today at a glance</h2>
        <div className="overview-metrics">
          {metrics.map(({ label, value, color, icon: Icon }) => (
            <div className="overview-metric" key={label}>
              <span className="overview-metric-dot" style={{ background: color }}><Icon size={12} /></span>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StudyCalendar() {
  const [monthOffset, setMonthOffset] = useState(0);
  const date = new Date();
  date.setMonth(date.getMonth() + monthOffset, 1);
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayNumber = month === today.getMonth() && year === today.getFullYear() ? today.getDate() : null;
  const studyDays = new Set([1, 4, 6, 9, 11, 15, 18, 21, 24, 27, 29]);

  return (
    <section className="study-calendar" aria-label="Study calendar">
      <div className="calendar-heading">
        <h2>{date.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h2>
        <div>
          <button onClick={() => setMonthOffset((value) => value - 1)} aria-label="Previous month"><ChevronLeft size={16} /></button>
          <button onClick={() => setMonthOffset((value) => value + 1)} aria-label="Next month"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="calendar-weekdays" aria-hidden="true">{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
      <div className="calendar-days">
        {Array.from({ length: firstDay }).map((_, index) => <span key={`empty-${index}`} />)}
        {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
          const isToday = day === todayNumber;
          const isStudyDay = studyDays.has(day);
          return <span className={`calendar-day ${isStudyDay ? "has-study" : ""} ${isToday ? "is-today" : ""}`} key={day}>{day}</span>;
        })}
      </div>
      <p><span /> Study activity this month</p>
    </section>
  );
}
