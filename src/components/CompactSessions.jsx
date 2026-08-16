import { BookOpen, Bug } from "lucide-react";
import { computeSessions } from "./StudySessions";
import { colorForSubject } from "../lib/subjectColors";
import { displayName } from "../lib/displayName";

export default function CompactSessions({ reviews, snapshots }) {
  const sessions = computeSessions(reviews, snapshots);

  return (
    <section className="card compact-sessions-card">
      <p className="card-label">Sessions</p>

      {sessions.length === 0 ? (
        <p className="empty-state" style={{ padding: 0 }}>
          Nothing scheduled — enjoy the lighter day.
        </p>
      ) : (
        <ul className="compact-sessions-list">
          {sessions.map((s) => {
            const isLeech = s.title === "Rewrite leech cards";
            const color = isLeech ? "var(--red)" : colorForSubject(s.title);
            return (
              <li key={s.title} className="compact-sessions-item">
                <span
                  className="compact-sessions-icon"
                  style={{ background: `color-mix(in srgb, ${color} 20%, transparent)`, color }}
                >
                  {isLeech ? <Bug size={12} /> : <BookOpen size={12} />}
                </span>
                <span className="compact-sessions-title">
                  {isLeech ? s.title : displayName(s.title)}
                </span>
                <span className="compact-sessions-minutes">{s.minutes}m</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
