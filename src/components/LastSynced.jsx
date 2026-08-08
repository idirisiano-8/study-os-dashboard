import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { supabase } from "../supabaseClient";

function timeAgo(date) {
  const diffMs = Date.now() - date.getTime();
  const hrs = diffMs / (1000 * 60 * 60);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${Math.round(hrs)}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function LastSynced() {
  const [lastSync, setLastSync] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("daily_snapshots")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (cancelled) return;
        setLastSync(data && data.length ? new Date(data[0].created_at) : null);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return null;

  const hrsStale = lastSync ? (Date.now() - lastSync.getTime()) / (1000 * 60 * 60) : Infinity;
  const isStale = hrsStale > 26;
  const color = hrsStale > 36 ? "var(--red)" : hrsStale > 26 ? "var(--amber)" : "var(--text-low)";

  return (
    <span
      title={lastSync ? lastSync.toLocaleString() : "No sync recorded yet"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color,
      }}
    >
      <motion.span
        animate={isStale ? { rotate: [0, 360] } : {}}
        transition={isStale ? { duration: 2.4, repeat: Infinity, ease: "linear" } : {}}
        style={{ display: "flex" }}
      >
        <RefreshCw size={11} />
      </motion.span>
      {lastSync ? `synced ${timeAgo(lastSync)}` : "never synced"}
    </span>
  );
}
