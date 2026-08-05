import { useMemo } from "react";

const MIN_SAMPLE = 6;

function buildSummary(reviews, snapshotHistory) {
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

  const thisWeek = reviews.filter((r) => new Date(r.reviewed_at).getTime() >= weekAgo);
  const lastWeek = reviews.filter((r) => {
    const t = new Date(r.reviewed_at).getTime();
    return t >= twoWeeksAgo && t < weekAgo;
  });

  if (thisWeek.length === 0) {
    return "No reviews logged in the past 7 days — nothing to summarize yet.";
  }

  const retentionByDeck = (list) => {
    const byDeck = new Map();
    for (const r of list) {
      if (!byDeck.has(r.deck_name)) byDeck.set(r.deck_name, { total: 0, correct: 0 });
      const e = byDeck.get(r.deck_name);
      e.total += 1;
      if (r.is_correct) e.correct += 1;
    }
    const out = new Map();
    for (const [deck, e] of byDeck.entries()) {
      if (e.total >= MIN_SAMPLE) out.set(deck, (e.correct / e.total) * 100);
    }
    return out;
  };

  const thisWeekRetention = retentionByDeck(thisWeek);
  const lastWeekRetention = retentionByDeck(lastWeek);

  let biggestImprovement = null;
  let biggestDecline = null;
  for (const [deck, pct] of thisWeekRetention.entries()) {
    if (!lastWeekRetention.has(deck)) continue;
    const delta = pct - lastWeekRetention.get(deck);
    if (delta > 5 && (!biggestImprovement || delta > biggestImprovement.delta)) {
      biggestImprovement = { deck, delta };
    }
    if (delta < -5 && (!biggestDecline || delta < biggestDecline.delta)) {
      biggestDecline = { deck, delta };
    }
  }

  // backlog trend across the week, summed across decks
  const byDate = new Map();
  for (const s of snapshotHistory) {
    byDate.set(s.snapshot_date, (byDate.get(s.snapshot_date) || 0) + (s.cards_due || 0));
  }
  const sortedDates = [...byDate.keys()].sort();
  const backlogStart = sortedDates.length ? byDate.get(sortedDates[0]) : null;
  const backlogEnd = sortedDates.length ? byDate.get(sortedDates[sortedDates.length - 1]) : null;

  const overallAcc = (thisWeek.filter((r) => r.is_correct).length / thisWeek.length) * 100;

  const sentences = [];
  sentences.push(
    `${thisWeek.length} reviews logged this week, at ${overallAcc.toFixed(0)}% overall accuracy.`
  );

  if (backlogStart !== null && backlogEnd !== null && sortedDates.length > 1) {
    const change = backlogEnd - backlogStart;
    if (change < -5) sentences.push(`Backlog shrank by ${Math.abs(change)} cards over the period tracked — good direction.`);
    else if (change > 5) sentences.push(`Backlog grew by ${change} cards over the period tracked — worth addressing before it compounds.`);
    else sentences.push(`Backlog stayed roughly flat over the period tracked.`);
  }

  if (biggestImprovement) {
    sentences.push(`${biggestImprovement.deck} improved the most, up ${biggestImprovement.delta.toFixed(0)} points from last week.`);
  }
  if (biggestDecline) {
    sentences.push(`${biggestDecline.deck} slipped the most, down ${Math.abs(biggestDecline.delta).toFixed(0)} points — may be worth a closer look.`);
  }
  if (!biggestImprovement && !biggestDecline && lastWeek.length > 0) {
    sentences.push(`Retention held steady across decks compared to last week.`);
  }

  return sentences.join(" ");
}

export default function WeeklySummary({ reviews, snapshotHistory }) {
  const summary = useMemo(() => buildSummary(reviews, snapshotHistory), [reviews, snapshotHistory]);
  return (
    <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-hi)", margin: 0 }}>{summary}</p>
  );
}
