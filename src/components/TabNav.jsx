import { motion } from "framer-motion";

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
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "none",
              border: "none",
              padding: "10px 14px",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              color: isActive ? "var(--text-hi)" : "var(--text-low)",
              marginBottom: -1,
              whiteSpace: "nowrap",
              transition: "color 0.18s ease",
            }}
          >
            {Icon && <Icon size={15} />}
            {t.label}
            {isActive && (
              <motion.div
                layoutId="tab-underline"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -1,
                  height: 2,
                  background: "var(--amber)",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
