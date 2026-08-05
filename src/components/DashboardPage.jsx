import { useEffect, useMemo, useState } from "react";
import {
  ListChecks, Gauge, Compass, TrendingUp, Grid3x3, Layers, Tags, Bug, Target, NotebookPen,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { localDateKey } from "../lib/dateHelpers";
import SummaryStrip from "./SummaryStrip";
import Heatmap from "./Heatmap";
import BacklogBars from "./BacklogBars";
import WeakTags from "./WeakTags";
import Leeches from "./Leeches";
import Calibration from "./Calibration";
import MissionHero from "./MissionHero";
import StudySessions from "./StudySessions";
import WinsStrip from "./WinsStrip";
import Reflection from "./Reflection";
import Collapsible from "./Collapsible";
import { ReadinessNarrative, FatigueNarrative, ForecastNarrative, WeakTagNarrative } from "./FocusNarrative";
import ReadinessScores from "./ReadinessScores";
import WeeklySummary from "./WeeklySummary";

const LOOKBACK_DAYS = 130;
const SNAPSHOT_HISTORY_DAYS = 21;

export default function DashboardPage({ onNavigate }) {
  const [reviews, setReviews] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [snapshotHistory, setSnapshotHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
        const snapshotSince = new Date(Date.now() - SNAPSHOT_HISTORY_DAYS * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);

        const [reviewsRes, snapshotsRes] = await Promise.all([
          supabase
            .from("anki_reviews")
            .select("reviewed_at, is_correct, deck_name, note_tags, card_id, ease")
            .gte("reviewed_at", since)
            .order("reviewed_at", { ascending: true })
            .limit(50000),
          supabase
            .from("daily_snapshots")
            .select("snapshot_date, deck_name, cards_due")
            .gte("snapshot_date", snapshotSince)
            .order("snapshot_date", { ascending: false })
            .limit(1000),
        ]);

        if (reviewsRes.error) throw reviewsRes.error;
        if (snapshotsRes.error) throw snapshotsRes.error;

        if (!cancelled) {
          setReviews(reviewsRes.data);
          setSnapshotHistory(snapshotsRes.data);
          const latestDate = snapshotsRes.data[0]?.snapshot_date;
          setSnapshots(snapshotsRes.data.filter((s) => s.snapshot_date === latestDate));
        }
      } catch (err) {
        if (!cancelled) setError(err.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const derived = useMemo(() => {
    const todayKey = localDateKey();
    const reviewsToday = reviews.filter((r) => localDateKey(r.reviewed_at) === todayKey).length;
    const backlogTotal = snapshots.reduce((sum, s) => sum + (s.cards_due || 0), 0);

    const daySet = new Set(reviews.map((r) => localDateKey(r.reviewed_at)));
    let streak = 0;
    const cursor = new Date();
    for (;;) {
      const key = localDateKey(cursor);
      if (daySet.has(key)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = reviews.filter((r) => new Date(r.reviewed_at).getTime() >= sevenDaysAgo);
    const retention7d = recent.length
      ? (recent.filter((r) => r.is_correct).length / recent.length) * 100
      : null;

    return { reviewsToday, backlogTotal, streak, retention7d };
  }, [reviews, snapshots]);

  if (error) {
    return (
      <div className="error-banner">
        Couldn't load data: {error}. Check your .env values and that a sync has run at least once.
      </div>
    );
  }

  if (loading) return <p className="loading">Loading…</p>;

  return (
    <>
      {/* HERO — what to do right now */}
      <MissionHero reviews={reviews} snapshots={snapshots} onNavigate={onNavigate} />

      <SummaryStrip
        reviewsToday={derived.reviewsToday}
        backlogTotal={derived.backlogTotal}
        streak={derived.streak}
        retention7d={derived.retention7d}
      />

      <section className="card">
        <p className="card-label"><Target size={13} />Wins this week</p>
        <WinsStrip reviews={reviews} snapshotHistory={snapshotHistory} streak={derived.streak} />
      </section>

      {/* TODAY'S FOCUS — narrative recommendations */}
      <section className="card">
        <p className="card-label"><Compass size={13} />Readiness</p>
        <ReadinessNarrative reviews={reviews} snapshots={snapshots} />
      </section>

      <section className="card">
        <p className="card-label"><Gauge size={13} />Today's session</p>
        <FatigueNarrative reviews={reviews} />
      </section>

      <section className="card">
        <p className="card-label"><Tags size={13} />Weakest topic</p>
        <WeakTagNarrative reviews={reviews} />
      </section>

      <section className="card">
        <p className="card-label"><ListChecks size={13} />Study sessions</p>
        <StudySessions reviews={reviews} snapshots={snapshots} />
      </section>

      <section className="card">
        <p className="card-label"><NotebookPen size={13} />Daily reflection</p>
        <Reflection />
      </section>

      {/* PROGRESS — secondary, collapsed by default */}
      <Collapsible title="Progress" icon={TrendingUp}>
        <section className="card">
          <p className="card-label">This week, in plain terms</p>
          <WeeklySummary reviews={reviews} snapshotHistory={snapshotHistory} />
        </section>
        <section className="card">
          <p className="card-label"><TrendingUp size={13} />Workload forecast</p>
          <ForecastNarrative snapshotHistory={snapshotHistory} />
        </section>
        <section className="card">
          <p className="card-label"><Compass size={13} />Readiness by subject</p>
          <ReadinessScores reviews={reviews} snapshots={snapshots} />
        </section>
        <section className="card">
          <p className="card-label"><Grid3x3 size={13} />Review activity — past 18 weeks</p>
          <Heatmap reviews={reviews} />
        </section>
      </Collapsible>

      {/* MAINTENANCE — support tools, collapsed by default */}
      <Collapsible title="Maintenance" icon={Layers}>
        <section className="card">
          <p className="card-label"><Layers size={13} />Backlog by deck</p>
          <BacklogBars snapshots={snapshots} />
        </section>
        <section className="card">
          <p className="card-label"><Tags size={13} />Weakest tags — lowest retention (min 8 reviews)</p>
          <WeakTags reviews={reviews} />
        </section>
        <section className="card">
          <p className="card-label"><Bug size={13} />Leeches — cards you keep failing</p>
          <Leeches reviews={reviews} />
        </section>
        <section className="card">
          <p className="card-label"><Target size={13} />Calibration check</p>
          <Calibration reviews={reviews} />
        </section>
      </Collapsible>
    </>
  );
}
