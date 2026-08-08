import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <motion.button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ display: "flex" }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
