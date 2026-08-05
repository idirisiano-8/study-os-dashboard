export default function TabNav({ active, onChange, tabs }) {
  return (
    <nav
      style={{
        display: "flex",
        gap: 4,
        marginBottom: 28,
        borderBottom: "1px solid var(--line)",
        overflowX: "auto",
      }}
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "none",
              border: "none",
              padding: "10px 14px",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              color: active === t.key ? "var(--text-hi)" : "var(--text-low)",
              borderBottom: active === t.key ? "2px solid var(--amber)" : "2px solid transparent",
              marginBottom: -1,
              whiteSpace: "nowrap",
            }}
          >
            {Icon && <Icon size={15} />}
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
