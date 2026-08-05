import { Target, CalendarRange, AlertTriangle } from "lucide-react";
import { useHandbookEntry } from "../lib/useHandbookEntry";
import { isoWeekKey, weekRangeLabel } from "../lib/dateHelpers";
import SaveStatus from "./SaveStatus";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEFAULT_CONTENT = {
  schoolFocus: "",
  step1Focus: "",
  backlogStart: "",
  backlogTarget: "",
  disruptions: "",
  days: DAYS.map(() => ({ school: "", step1: "", activity: "" })),
};

export default function WeeklyPlan() {
  const weekKey = isoWeekKey();
  const [content, setContent, status] = useHandbookEntry("weekly_plan", weekKey, DEFAULT_CONTENT);

  function updateField(field, value) {
    setContent((c) => ({ ...c, [field]: value }));
  }

  function updateDay(index, field, value) {
    setContent((c) => {
      const days = [...c.days];
      days[index] = { ...days[index], [field]: value };
      return { ...c, days };
    });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: 0 }}>
            Week of {weekRangeLabel()}
          </h2>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-low)", margin: "4px 0 0" }}>
            {weekKey}
          </p>
        </div>
        <SaveStatus status={status} />
      </div>

      <section className="card">
        <p className="card-label"><Target size={13} />This week's focus</p>
        <Field
          label="School focus (lectures / exams)"
          value={content.schoolFocus}
          onChange={(v) => updateField("schoolFocus", v)}
        />
        <Field
          label="Step 1 focus (aligned topic if possible)"
          value={content.step1Focus}
          onChange={(v) => updateField("step1Focus", v)}
        />
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Field
              label="Anki backlog at start of week"
              value={content.backlogStart}
              onChange={(v) => updateField("backlogStart", v)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Field
              label="Target by end of week"
              value={content.backlogTarget}
              onChange={(v) => updateField("backlogTarget", v)}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <p className="card-label"><CalendarRange size={13} />Daily plan</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-low)" }}>
              <th style={{ textAlign: "left", padding: "4px 6px", width: 44 }}>DAY</th>
              <th style={{ textAlign: "left", padding: "4px 6px" }}>SCHOOL</th>
              <th style={{ textAlign: "left", padding: "4px 6px" }}>STEP 1</th>
              <th style={{ textAlign: "left", padding: "4px 6px" }}>GYM / FOOTBALL</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((d, i) => (
              <tr key={d} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={{ padding: "6px", color: "var(--text-mid)", fontFamily: "var(--font-mono)" }}>{d}</td>
                <td style={{ padding: "4px" }}>
                  <Cell value={content.days[i]?.school} onChange={(v) => updateDay(i, "school", v)} />
                </td>
                <td style={{ padding: "4px" }}>
                  <Cell value={content.days[i]?.step1} onChange={(v) => updateDay(i, "step1", v)} />
                </td>
                <td style={{ padding: "4px" }}>
                  <Cell value={content.days[i]?.activity} onChange={(v) => updateDay(i, "activity", v)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <p className="card-label"><AlertTriangle size={13} />Anything expected to disrupt this week?</p>
        <textarea
          value={content.disruptions}
          onChange={(e) => updateField("disruptions", e.target.value)}
          placeholder="Exam, event, travel…"
          style={textareaStyle}
        />
      </section>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, color: "var(--text-mid)", marginBottom: 6 }}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

function Cell({ value, onChange }) {
  return <input value={value || ""} onChange={(e) => onChange(e.target.value)} style={cellStyle} />;
}

const inputStyle = {
  width: "100%",
  background: "var(--ink-2)",
  border: "1px solid var(--line)",
  borderRadius: 3,
  color: "var(--text-hi)",
  fontSize: 14,
  fontFamily: "var(--font-body)",
  padding: "9px 10px",
  boxSizing: "border-box",
};

const cellStyle = {
  ...inputStyle,
  padding: "7px 8px",
  fontSize: 13,
};

const textareaStyle = {
  ...inputStyle,
  minHeight: 70,
  resize: "vertical",
  fontFamily: "var(--font-body)",
};
