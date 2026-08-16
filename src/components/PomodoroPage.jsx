import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Pause, Play, RotateCcw, TimerReset } from "lucide-react";

const DURATIONS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remaining = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

export default function PomodoroPage() {
  const [mode, setMode] = useState("focus");
  const [seconds, setSeconds] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return undefined;
    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current > 1) return current - 1;
        setRunning(false);
        if (mode === "focus") setCycles((count) => count + 1);
        return DURATIONS[mode];
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [mode, running]);

  const progress = useMemo(() => 1 - seconds / DURATIONS[mode], [mode, seconds]);
  const selectMode = (nextMode) => {
    setRunning(false);
    setMode(nextMode);
    setSeconds(DURATIONS[nextMode]);
  };

  return (
    <section className="pomodoro-page">
      <div className="pomodoro-intro">
        <div>
          <h1>Make this block count.</h1>
          <p>A quiet timer for the work directly in front of you.</p>
        </div>
        <div className="pomodoro-cycle-count"><Coffee size={16} /> {cycles} focus cycles today</div>
      </div>

      <div className="pomodoro-stage">
        <div className="pomodoro-mode-tabs" role="tablist" aria-label="Timer mode">
          {[['focus', 'Focus'], ['short', 'Short break'], ['long', 'Long break']].map(([key, label]) => (
            <button key={key} onClick={() => selectMode(key)} className={mode === key ? "is-active" : ""} role="tab" aria-selected={mode === key}>{label}</button>
          ))}
        </div>

        <motion.div className={`pomodoro-dial ${running ? "is-running" : ""}`} animate={{ scale: running ? 1.015 : 1 }} transition={{ duration: .5 }}>
          <svg viewBox="0 0 280 280" aria-hidden="true">
            <circle className="pomodoro-track" cx="140" cy="140" r="119" />
            <motion.circle className="pomodoro-progress" cx="140" cy="140" r="119" pathLength="1" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ duration: .65, ease: "linear" }} />
          </svg>
          <div className="pomodoro-time"><strong>{formatTime(seconds)}</strong><span>{mode === "focus" ? "Focus block" : mode === "short" ? "Short reset" : "Long reset"}</span></div>
        </motion.div>

        <div className="pomodoro-controls">
          <button className="pomodoro-reset" onClick={() => { setRunning(false); setSeconds(DURATIONS[mode]); }} aria-label="Reset timer"><RotateCcw size={20} /></button>
          <motion.button className="pomodoro-play" onClick={() => setRunning((value) => !value)} whileTap={{ scale: .96 }}>
            {running ? <><Pause size={21} fill="currentColor" /> Pause</> : <><Play size={21} fill="currentColor" /> Start focus</>}
          </motion.button>
          <button className="pomodoro-reset" onClick={() => setCycles(0)} aria-label="Reset cycles"><TimerReset size={20} /></button>
        </div>
      </div>
    </section>
  );
}
