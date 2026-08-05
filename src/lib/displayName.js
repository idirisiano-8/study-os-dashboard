// AnKing-style tags/decks often look like "#AK_Step1_v12::#Physiology::Renal"
// or "Physiology::Renal::Electrolytes". For display, show just the last
// meaningful segment(s) rather than the full path — the raw value is still
// used for coloring and matching, this only affects what's shown on screen.
export function displayName(raw = "") {
  if (!raw) return raw;
  const segments = raw.split("::").map((s) => s.replace(/^#/, "").trim()).filter(Boolean);
  if (segments.length <= 2) return segments.join(" · ") || raw;
  // keep the last two segments — usually the most specific, human-meaningful part
  return segments.slice(-2).join(" · ");
}
