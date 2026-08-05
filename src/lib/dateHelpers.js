// ISO week key like "2026-W36" — used so each week's plan is a distinct,
// stable record regardless of which day of the week you open the app.
export function isoWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

// Converts a Date or an ISO timestamp string to a YYYY-MM-DD key using the
// browser's LOCAL timezone — not UTC. This matters: toISOString().slice(0,10)
// silently uses UTC, which for Philippines time (UTC+8) shifts the "day"
// boundary to 8am local instead of midnight. Anything bucketing reviews or
// checklist state "by day" should go through this, not toISOString().
export function localDateKey(input = new Date()) {
  const d = input instanceof Date ? input : new Date(input);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function dateKey(date = new Date()) {
  return localDateKey(date);
}

export function weekRangeLabel(date = new Date()) {
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}
