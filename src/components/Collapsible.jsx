import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Collapsible({ title, icon: Icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: 18 }}>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.99 }}
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
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ display: "flex" }}
        >
          <ChevronDown size={16} color="var(--text-low)" />
        </motion.span>
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingTop: 16 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
