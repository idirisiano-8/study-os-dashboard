import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Collapsible({ title, icon: Icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: 18 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "none",
          border: "none",
          padding: "10px 2px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-display)", fontSize: 17, color: "var(--text-hi)" }}>
          {Icon && <Icon size={16} color="var(--text-mid)" />}
          {title}
        </span>
        <ChevronDown
          size={16}
          color="var(--text-low)"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
        />
      </button>
      {open && <div style={{ paddingTop: 16 }}>{children}</div>}
    </div>
  );
}
