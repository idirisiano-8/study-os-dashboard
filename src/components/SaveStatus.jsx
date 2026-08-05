export default function SaveStatus({ status }) {
  const map = {
    loading: { text: "loading…", color: "var(--text-low)" },
    saving: { text: "saving…", color: "var(--amber)" },
    saved: { text: "saved", color: "var(--teal)" },
    error: { text: "couldn't save — check connection", color: "var(--red)" },
  };
  const s = map[status] || map.saved;
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: s.color,
        letterSpacing: "0.03em",
      }}
    >
      {s.text}
    </span>
  );
}
