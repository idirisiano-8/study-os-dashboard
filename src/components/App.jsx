import { useEffect, useState } from "react";
import { LayoutDashboard, CalendarDays, GraduationCap, CheckSquare, Clock } from "lucide-react";
import BottomNav from "./components/BottomNav";
import ThemeToggle from "./components/ThemeToggle";
import LastSynced from "./components/LastSynced";
import DashboardPage from "./components/DashboardPage";
import WeeklyPlan from "./components/WeeklyPlan";
import SemesterPlan from "./components/SemesterPlan";
import Checklists from "./components/Checklists";
import PomodoroPage from "./components/PomodoroPage";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "weekly", label: "Weekly plan", icon: CalendarDays },
  { key: "semester", label: "Semester plan", icon: GraduationCap },
  { key: "checklists", label: "Checklists", icon: CheckSquare },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [visited, setVisited] = useState(new Set(["dashboard"]));
  const [theme, setTheme] = useState(() => localStorage.getItem("studyos-theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("studyos-theme", theme);
  }, [theme]);

  function goTo(key) {
    setTab(key);
    setVisited((v) => (v.has(key) ? v : new Set(v).add(key)));
  }

  const activeTabMeta = TABS.find((item) => item.key === tab);

  return (
    <div className="app-shell">
      <aside className="workspace-sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">S</div>
          <div>
            <span className="brand-name">Study OS</span>
            <span className="brand-subtitle">Idirisiano's workspace</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          <span className="nav-group-label">Workspace</span>
          {TABS.map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.key;
            return (
              <button
                key={item.key}
                className={`sidebar-nav-item ${isActive ? "is-active" : ""}`}
                onClick={() => goTo(item.key)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-footer-label">Study mode</span>
          <div className="study-mode"><span /> Deep work</div>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="masthead">
          <div className="masthead-left">
            <div>
              <span className="masthead-title">
                {tab === "pomodoro" ? "Pomodoro timer" : activeTabMeta?.label}
              </span>
              <span className="masthead-context">
                {tab === "pomodoro" ? "Focus in short, timed bursts" : "Your personal study command center"}
              </span>
            </div>
          </div>
          <div className="masthead-right">
            <span className="masthead-date">
              {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </span>
            <button
              className="masthead-icon"
              aria-label="Pomodoro timer"
              aria-current={tab === "pomodoro" ? "page" : undefined}
              onClick={() => goTo("pomodoro")}
            >
              <Clock size={18} />
            </button>
          </div>
        </header>

        <div className="workspace-statusbar">
          <LastSynced />
          <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
        </div>

        <div className="workspace-content">
          {visited.has("dashboard") && <div style={{ display: tab === "dashboard" ? "block" : "none" }}><DashboardPage onNavigate={goTo} /></div>}
          {visited.has("weekly") && <div style={{ display: tab === "weekly" ? "block" : "none" }}><WeeklyPlan /></div>}
          {visited.has("semester") && <div style={{ display: tab === "semester" ? "block" : "none" }}><SemesterPlan /></div>}
          {visited.has("checklists") && <div style={{ display: tab === "checklists" ? "block" : "none" }}><Checklists /></div>}
          {visited.has("pomodoro") && <div style={{ display: tab === "pomodoro" ? "block" : "none" }}><PomodoroPage /></div>}
        </div>
      </main>

      <BottomNav active={tab} onChange={goTo} tabs={TABS} />
    </div>
  );
}
