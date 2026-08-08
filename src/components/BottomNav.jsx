import { motion } from "framer-motion";

export default function BottomNav({ active, onChange, tabs }) {
  return (
    <nav className="bottom-nav">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.key;
        return (
          <motion.button
            key={t.key}
            onClick={() => onChange(t.key)}
            className="bottom-nav-item"
            whileTap={{ scale: 0.9 }}
            animate={{ color: isActive ? "var(--amber)" : "var(--text-low)" }}
            transition={{ duration: 0.18 }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            <span>{t.label.split(" ")[0]}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
