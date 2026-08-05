// A wider, still-tasteful palette (24 colors, not neon) so that with dozens
// of decks — you have 58 — the odds of two frequently-seen subjects landing
// on the same color stay low. Perfect uniqueness isn't the goal (that would
// need pastel/neon colors that clash with the premium look); the goal is
// that the handful of decks you actually see day to day stay distinguishable.
const PALETTE = [
  "#5B8FD9", "#57A595", "#C98A4B", "#9B7FCB",
  "#D97878", "#6FAE6B", "#C9A24B", "#6B9BC9",
  "#B5739E", "#4FA8A0", "#D4915B", "#8A9BD9",
  "#7FB893", "#C97F9E", "#A8A24B", "#6BA6D9",
  "#D9A0D4", "#5FA88A", "#C9705B", "#8FA8D9",
  "#B08AC9", "#5B9BA5", "#D9B45B", "#7B95C9",
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function colorForSubject(deckName = "") {
  return PALETTE[hash(deckName) % PALETTE.length];
}
