import { useEffect, useState } from "react";
import { LayoutDashboard, CalendarDays, GraduationCap, CheckSquare } from "lucide-react";
import TabNav from "./components/TabNav";
import BottomNav from "./components/BottomNav";
import ThemeToggle from "./components/ThemeToggle";
import LastSynced from "./components/LastSynced";
import DashboardPage from "./components/DashboardPage";
import WeeklyPlan from "./components/WeeklyPlan";
import SemesterPlan from "./components/SemesterPlan";
import Checklists from "./components/Checklists";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "weekly", label: "Weekly plan", icon: CalendarDays },
  { key: "semester", label: "Semester plan", icon: GraduationCap },
  { key: "checklists", label: "Checklists", icon: CheckSquare },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [visited, setVisited] = useState(new Set(["dashboard"]));
  const [theme, setTheme] = useState(() => localStorage.getItem("studyos-theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("studyos-theme", theme);
  }, [theme]);

  function goTo(key) {
    setTab(key);
    setVisited((v) => (v.has(key) ? v : new Set(v).add(key)));
  }

  return (
    <div className="app-shell">
      <header className="masthead">
        <div className="masthead-left">
          <span className="masthead-title">Idirisiano</span>
        </div>
        <div className="masthead-right">
          <LastSynced />
          <span className="masthead-date">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
          <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
        </div>
      </header>

      <div className="top-tabnav">
        <TabNav active={tab} onChange={goTo} tabs={TABS} />
      </div>

      {/* Each page mounts the first time its tab is opened, then stays mounted
          (just hidden) after that — so switching back to an already-visited
          tab is instant, but tabs you never open never cost a fetch. */}
      {visited.has("dashboard") && (
        <div style={{ display: tab === "dashboard" ? "block" : "none" }}>
          <DashboardPage onNavigate={goTo} />
        </div>
      )}
      {visited.has("weekly") && (
        <div style={{ display: tab === "weekly" ? "block" : "none" }}>
          <WeeklyPlan />
        </div>
      )}
      {visited.has("semester") && (
        <div style={{ display: tab === "semester" ? "block" : "none" }}>
          <SemesterPlan />
        </div>
      )}
      {visited.has("checklists") && (
        <div style={{ display: tab === "checklists" ? "block" : "none" }}>
          <Checklists />
        </div>
      )}

      <BottomNav active={tab} onChange={goTo} tabs={TABS} />
    </div>
  );
}
