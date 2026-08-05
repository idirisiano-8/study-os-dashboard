import { BookOpen, Flag } from "lucide-react";
import { useHandbookEntry } from "../lib/useHandbookEntry";
import { colorForSubject } from "../lib/subjectColors";
import SaveStatus from "./SaveStatus";

const DEFAULT_CONTENT = {
  semesterLabel: "MS1, Semester 1",
  subjects: [
    { name: "Physiology (Renal remaining)", relevance: "High", schoolResource: "Guyton / lectures", step1Resource: "Boards & Beyond, BRS, Anki" },
    { name: "Biochemistry (maintenance)", relevance: "High", schoolResource: "Harper's / lectures", step1Resource: "Anki + practice questions" },
  ],
  goals: ["", "", "", ""],
};

export default function SemesterPlan() {
  const [content, setContent, status] = useHandbookEntry("semester_plan", "current", DEFAULT_CONTENT);

  function updateLabel(value) {
    setContent((c) => ({ ...c, semesterLabel: value }));
  }
  function updateSubject(i, field, value) {
    setContent((c) => {
      const subjects = [...c.subjects];
      subjects[i] = { ...subjects[i], [field]: value };
      return { ...c, subjects };
    });
  }
  function addSubject() {
    setContent((c) => ({
      ...c,
      subjects: [...c.subjects, { name: "", relevance: "", schoolResource: "", step1Resource: "" }],
    }));
  }
  function removeSubject(i) {
    setContent((c) => ({ ...c, subjects: c.subjects.filter((_, idx) => idx !== i) }));
  }
  function updateGoal(i, value) {
    setContent((c) => {
      const goals = [...c.goals];
      goals[i] = value;
      return { ...c, goals };
    });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
        <input
          value={content.semesterLabel}
          onChange={(e) => updateLabel(e.target.value)}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            background: "none",
            border: "none",
            color: "var(--text-hi)",
            padding: 0,
          }}
        />
        <SaveStatus status={status} />
      </div>

      <section className="card">
        <p className="card-label"><BookOpen size={13} />Subjects</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-low)" }}>
              <th style={th}>SUBJECT</th>
              <th style={th}>STEP 1 RELEVANCE</th>
              <th style={th}>SCHOOL RESOURCE</th>
              <th style={th}>STEP 1 RESOURCE</th>
              <th style={{ ...th, width: 20 }}></th>
            </tr>
          </thead>
          <tbody>
            {content.subjects.map((s, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: colorForSubject(s.name || `subject-${i}`) }} />
                    <Cell value={s.name} onChange={(v) => updateSubject(i, "name", v)} />
                  </div>
                </td>
                <td style={td}><Cell value={s.relevance} onChange={(v) => updateSubject(i, "relevance", v)} /></td>
                <td style={td}><Cell value={s.schoolResource} onChange={(v) => updateSubject(i, "schoolResource", v)} /></td>
                <td style={td}><Cell value={s.step1Resource} onChange={(v) => updateSubject(i, "step1Resource", v)} /></td>
                <td style={td}>
                  <button onClick={() => removeSubject(i)} style={removeBtn} aria-label="Remove subject">
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addSubject} style={addBtn}>+ Add subject</button>
      </section>

      <section className="card">
        <p className="card-label"><Flag size={13} />Semester goals</p>
        {content.goals.map((g, i) => (
          <input
            key={i}
            value={g}
            onChange={(e) => updateGoal(i, e.target.value)}
            placeholder={`Goal ${i + 1}`}
            style={{ ...inputStyle, marginBottom: 10 }}
          />
        ))}
      </section>
    </div>
  );
}

function Cell({ value, onChange }) {
  return <input value={value || ""} onChange={(e) => onChange(e.target.value)} style={cellStyle} />;
}

const th = { textAlign: "left", padding: "4px 6px" };
const td = { padding: "4px" };

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

const cellStyle = { ...inputStyle, padding: "7px 8px", fontSize: 13 };

const addBtn = {
  marginTop: 12,
  background: "none",
  border: "1px dashed var(--line)",
  borderRadius: 3,
  color: "var(--text-mid)",
  fontSize: 12,
  padding: "8px 12px",
};

const removeBtn = {
  background: "none",
  border: "none",
  color: "var(--text-low)",
  fontSize: 16,
  lineHeight: 1,
  padding: "4px 6px",
};
