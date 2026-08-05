import { useMemo } from "react";
import { displayName } from "../lib/displayName";

// A card counts as a "leech" here if, of its last 5 reviews, 3 or more were Again (ease=1).
// This mirrors Anki's own leech logic loosely, but we compute it ourselves so it works
// even for people who haven't turned on Anki's leech tagging/suspension.
const WINDOW = 5;
const FAIL_THRESHOLD = 3;

export function computeLeeches(reviews) {
  const byCard = new Map();
  for (const r of reviews) {
    if (!byCard.has(r.card_id)) byCard.set(r.card_id, []);
    byCard.get(r.card_id).push(r);
  }

  const leeches = [];
  for (const [cardId, list] of byCard.entries()) {
    const sorted = [...list].sort((a, b) => new Date(a.reviewed_at) - new Date(b.reviewed_at));
    const recent = sorted.slice(-WINDOW);
    const fails = recent.filter((r) => r.ease === 1).length;
    if (fails >= FAIL_THRESHOLD) {
      const last = sorted[sorted.length - 1];
      leeches.push({
        cardId,
        deck: last.deck_name,
        tags: last.note_tags || [],
        fails,
        window: recent.length,
        lastReviewed: last.reviewed_at,
      });
    }
  }
  return leeches.sort((a, b) => b.fails - a.fails);
}

export default function Leeches({ reviews }) {
  const leeches = useMemo(() => computeLeeches(reviews), [reviews]);

  if (!leeches.length) {
    return (
      <p className="empty-state">
        No repeat-fail cards detected in this window — nothing to rewrite right now.
      </p>
    );
  }

  const byDeck = new Map();
  for (const l of leeches) {
    byDeck.set(l.deck, (byDeck.get(l.deck) || 0) + 1);
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-mid)", marginTop: 0, marginBottom: 14 }}>
        {leeches.length} card{leeches.length === 1 ? "" : "s"} failed {FAIL_THRESHOLD}+ of their
        last {WINDOW} reviews. Rewriting these — splitting them, adding a mnemonic, or
        reframing the question — usually fixes them faster than re-drilling as-is.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[...byDeck.entries()].map(([deck, count]) => (
          <span
            key={deck}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-hi)",
              background: "var(--ink-2)",
              border: "1px solid var(--line)",
              borderRadius: 3,
              padding: "5px 10px",
            }}
          >
            {displayName(deck)} <span style={{ color: "var(--red)" }}>· {count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
