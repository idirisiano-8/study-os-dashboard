export default function BottomNav({ active, onChange, tabs }) {
  return (
    <nav className="bottom-nav">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className="bottom-nav-item"
            style={{ color: isActive ? "var(--amber)" : "var(--text-low)" }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            <span>{t.label.split(" ")[0]}</span>
          </button>
        );
      })}
    </nav>
  );
}
