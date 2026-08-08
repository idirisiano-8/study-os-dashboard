import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";
import { dateKey, localDateKey } from "../lib/dateHelpers";

const LEVELS = [
  { value: 1, label: "Rough" },
  { value: 2, label: "Shaky" },
  { value: 3, label: "OK" },
  { value: 4, label: "Solid" },
  { value: 5, label: "Nailed it" },
];

export default function Calibration({ reviews }) {
  const today = dateKey();
  const yesterday = dateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));

  const [todayRating, setTodayRating] = useState(null);
  const [yesterdayRating, setYesterdayRating] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from("handbook_entries")
        .select("period_key, content")
        .eq("entry_type", "calibration")
        .in("period_key", [today, yesterday]);
      if (cancelled) return;
      const todayRow = data?.find((d) => d.period_key === today);
      const yesterdayRow = data?.find((d) => d.period_key === yesterday);
      setTodayRating(todayRow?.content?.rating ?? null);
      setYesterdayRating(yesterdayRow?.content?.rating ?? null);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [today, yesterday]);

  async function setRating(value) {
    setTodayRating(value);
    await supabase
      .from("handbook_entries")
      .upsert(
        { entry_type: "calibration", period_key: today, content: { rating: value }, updated_at: new Date().toISOString() },
        { onConflict: "entry_type,period_key" }
      );
  }

  const yesterdayActual = useMemo(() => {
    const list = reviews.filter((r) => localDateKey(r.reviewed_at) === yesterday);
    if (list.length < 6) return null;
    return (list.filter((r) => r.is_correct).length / list.length) * 100;
  }, [reviews, yesterday]);

  if (loading) return <p className="loading">Loading…</p>;

  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-mid)", marginTop: 0, marginBottom: 12 }}>
        How did today's reviews feel overall, before you check the numbers?
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {LEVELS.map((l) => (
          <motion.button
            key={l.value}
            onClick={() => setRating(l.value)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            animate={{
              backgroundColor: todayRating === l.value ? "var(--amber-dim)" : "var(--ink-2)",
              borderColor: todayRating === l.value ? "var(--amber)" : "var(--line)",
              color: todayRating === l.value ? "var(--amber)" : "var(--text-mid)",
            }}
            style={{
              flex: 1,
              padding: "10px 6px",
              fontSize: 12,
              fontFamily: "var(--font-body)",
              border: "1px solid",
              borderRadius: 3,
            }}
          >
            {l.label}
          </motion.button>
        ))}
      </div>
      {yesterdayRating !== null && yesterdayActual !== null && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            fontSize: 13,
            color: "var(--text-mid)",
            borderTop: "1px solid var(--line)",
            paddingTop: 12,
          }}
        >
          Yesterday you rated it{" "}
          <strong style={{ color: "var(--text-hi)" }}>
            {LEVELS.find((l) => l.value === yesterdayRating)?.label}
          </strong>{" "}
          — actual retention was{" "}
          <strong style={{ color: "var(--text-hi)" }}>{yesterdayActual.toFixed(0)}%</strong>.
          {calibrationNote(yesterdayRating, yesterdayActual)}
        </motion.div>
      )}
    </div>
  );
}

function calibrationNote(rating, actual) {
  const expected = { 1: 55, 2: 65, 3: 75, 4: 85, 5: 92 }[rating];
  const gap = actual - expected;
  if (Math.abs(gap) < 8) return " Your gut check tracked reality well.";
  if (gap < 0) return " You felt better about it than the numbers back up — worth a second look at that day's weak spots.";
  return " You were harder on yourself than the numbers warrant — the day went better than it felt.";
}
