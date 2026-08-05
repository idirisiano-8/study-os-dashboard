import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useHandbookEntry } from "../lib/useHandbookEntry";
import { dateKey } from "../lib/dateHelpers";
import { supabase } from "../supabaseClient";
import SaveStatus from "./SaveStatus";

const DEFAULT_CONTENT = { wentWell: "", difficult: "", tomorrow: "" };

export default function Reflection() {
  const [content, setContent, status] = useHandbookEntry("reflection", dateKey(), DEFAULT_CONTENT);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("handbook_entries")
      .select("period_key, content")
      .eq("entry_type", "reflection")
      .neq("period_key", dateKey())
      .order("period_key", { ascending: false })
      .limit(14)
      .then(({ data }) => {
        if (!cancelled && data) {
          setHistory(data.filter((d) => d.content?.wentWell || d.content?.difficult || d.content?.tomorrow));
        }
      });
    return () => {
      cancelled = true;
    };
    // Intentionally runs once on mount only — today's entry is excluded from
    // this query anyway (.neq), so there's no need to refetch on every
    // autosave keystroke while writing today's reflection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(field, value) {
    setContent((c) => ({ ...c, [field]: value }));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <SaveStatus status={status} />
      </div>
      <Field label="What went well today?" value={content.wentWell} onChange={(v) => update("wentWell", v)} />
      <Field label="What was difficult?" value={content.difficult} onChange={(v) => update("difficult", v)} />
      <Field label="What should tomorrow focus on?" value={content.tomorrow} onChange={(v) => update("tomorrow", v)} last />

      {history.length > 0 && (
        <div style={{ marginTop: 18, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
          <button
            onClick={() => setShowHistory((s) => !s)}
            style={{
              display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
              padding: 0, fontSize: 12, color: "var(--text-mid)", fontFamily: "var(--font-mono)",
            }}
          >
            <ChevronDown size={13} style={{ transform: showHistory ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            Past reflections ({history.length})
          </button>
          {showHistory && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 14 }}>
              {history.map((h) => (
                <div key={h.period_key} style={{ fontSize: 13, color: "var(--text-mid)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-low)", marginBottom: 4 }}>
                    {new Date(h.period_key).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  </div>
                  {h.content.wentWell && <div>✓ {h.content.wentWell}</div>}
                  {h.content.difficult && <div>△ {h.content.difficult}</div>}
                  {h.content.tomorrow && <div>→ {h.content.tomorrow}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 14 }}>
      <label style={{ display: "block", fontSize: 12, color: "var(--text-mid)", marginBottom: 6 }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        style={{
          width: "100%",
          background: "var(--ink-2)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius)",
          color: "var(--text-hi)",
          fontSize: 14,
          fontFamily: "var(--font-body)",
          padding: "9px 10px",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
