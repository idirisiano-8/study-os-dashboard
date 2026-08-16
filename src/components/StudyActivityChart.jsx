import { useMemo, useState } from "react";
import { localDateKey } from "../lib/dateHelpers";

export default function StudyActivityChart({ reviews = [] }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const daysData = useMemo(() => {
    const days = [];
    const reviewCountsByDay = {};

    reviews.forEach((r) => {
      const key = localDateKey(r.reviewed_at);
      reviewCountsByDay[key] = (reviewCountsByDay[key] || 0) + 1;
    });

    for (let i = 23; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = localDateKey(d);
      const count = reviewCountsByDay[key] || 0;
      const estimatedHours = count > 0 ? parseFloat((count / 110).toFixed(1)) : 0;
      
      days.push({
        dateStr: key,
        dayLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
        dateNum: d.getDate(),
        monthLabel: d.toLocaleDateString("en-US", { month: "short" }),
        hours: estimatedHours,
        reviews: count,
      });
    }
    return days;
  }, [reviews]);

  const pointWidth = 42;
  const chartHeight = 85;
  const paddingY = 14;
  const totalWidth = daysData.length * pointWidth;
  const maxHours = Math.max(...daysData.map((d) => d.hours), 6);

  const points = daysData.map((d, idx) => {
    const x = idx * pointWidth + pointWidth / 2;
    const y = chartHeight - paddingY - (d.hours / maxHours) * (chartHeight - 2 * paddingY);
    return { ...d, x, y };
  });

  const linePath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;
  const totalHoursRecent = daysData.reduce((sum, d) => sum + d.hours, 0).toFixed(1);

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", padding: "16px 20px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <p className="card-label" style={{ margin: 0 }}>Study Activity</p>
          <span style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>
            {totalHoursRecent} hrs <span style={{ fontSize: "11px", opacity: 0.5 }}>/ past 24 days</span>
          </span>
        </div>
        <span style={{ fontSize: "11px", color: "#1D9E75", opacity: 0.8 }}>Scroll for history →</span>
      </div>

      <div style={{ display: "flex", position: "relative", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: `${chartHeight}px`, paddingRight: "8px", fontSize: "10px", opacity: 0.4, borderRight: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <span>{maxHours}h</span>
          <span>{(maxHours / 2).toFixed(0)}h</span>
          <span>0h</span>
        </div>

        <div style={{ overflowX: "auto", overflowY: "hidden", width: "100%", scrollbarWidth: "thin" }}>
          <svg width={totalWidth} height={chartHeight + 20} style={{ display: "block" }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#1D9E75" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1="0" y1={paddingY} x2={totalWidth} y2={paddingY} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="0" y1={chartHeight / 2} x2={totalWidth} y2={chartHeight / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="0" y1={chartHeight - paddingY} x2={totalWidth} y2={chartHeight - paddingY} stroke="rgba(255,255,255,0.08)" />

            <path d={areaPath} fill="url(#areaGradient)" />
            <path d={linePath} fill="none" stroke="#1D9E75" strokeWidth="2.2" />

            {points.map((p, i) => {
              const isHovered = hoveredDay === i;
              return (
                <g key={p.dateStr} onMouseEnter={() => setHoveredDay(i)} onMouseLeave={() => setHoveredDay(null)} style={{ cursor: "pointer" }}>
                  <circle cx={p.x} cy={p.y} r={isHovered ? 5.5 : 3.5} fill={isHovered ? "#26D095" : "#1D9E75"} stroke="#111B15" strokeWidth="1.5" />
                  <text x={p.x} y={chartHeight + 14} textAnchor="middle" fill="currentColor" fontSize="10" opacity={isHovered ? 1 : 0.5}>
                    {p.dayLabel} {p.dateNum}
                  </text>
                </g>
              );
            })}
          </svg>

          {hoveredDay !== null && (
            <div
              style={{
                position: "absolute",
                top: "0px",
                left: `${Math.min(Math.max(points[hoveredDay].x - 35, 40), totalWidth - 90)}px`,
                background: "#1E2A23",
                border: "1px solid #1D9E75",
                borderRadius: "5px",
                padding: "3px 8px",
                fontSize: "11px",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              <strong>{points[hoveredDay].hours} hrs</strong> ({points[hoveredDay].reviews} rev)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
