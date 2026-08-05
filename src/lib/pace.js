const FALLBACK_SECONDS_PER_CARD = 9;
const MAX_REASONABLE_GAP_SECONDS = 60; // gaps longer than this are treated as a pause, not review time
const MIN_SAMPLE = 30;

/**
 * Estimates real per-card pace by looking at the time between consecutive
 * reviews within the same day. Long gaps (breaks, distractions) are excluded
 * so they don't inflate the estimate. Falls back to a flat guess until
 * there's enough of your own history to trust.
 */
export function averageSecondsPerCard(reviews) {
  if (!reviews || reviews.length < MIN_SAMPLE) return FALLBACK_SECONDS_PER_CARD;

  const sorted = [...reviews].sort((a, b) => new Date(a.reviewed_at) - new Date(b.reviewed_at));
  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    const diffSec = (new Date(sorted[i].reviewed_at) - new Date(sorted[i - 1].reviewed_at)) / 1000;
    if (diffSec > 0 && diffSec <= MAX_REASONABLE_GAP_SECONDS) gaps.push(diffSec);
  }

  if (gaps.length < MIN_SAMPLE) return FALLBACK_SECONDS_PER_CARD;

  const avg = gaps.reduce((s, g) => s + g, 0) / gaps.length;
  // clamp to a sane range so a weird data patch can't produce a wild estimate
  return Math.min(30, Math.max(3, avg));
}
