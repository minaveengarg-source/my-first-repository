import { useState, useEffect } from "react";

const styles = {
  light: {
    background: "#f5f0e8",
    color: "#1a1410",
    cardBg: "#fffdf8",
    accent: "#e84d2a",
    muted: "#7a6f64",
    toggleBg: "#1a1410",
    toggleFg: "#f5f0e8",
  },
  dark: {
    background: "#0f0e17",
    color: "#fffef8",
    cardBg: "#1a1928",
    accent: "#7f6df2",
    muted: "#8884a0",
    toggleBg: "#fffef8",
    toggleFg: "#0f0e17",
  },
};

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const theme = isDark ? styles.dark : styles.light;
  const [toggleCount, setToggleCount] = useState(0);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleToggle = () => {
    setIsDark((prev) => !prev);
    setToggleCount((c) => c + 1);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.background,
        color: theme.color,
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.45s, color 0.45s",
      }}
    >
      <div style={{ width: "100%", maxWidth: 460, padding: "24px 16px" }}>

        {/* ── TOGGLE ONLY (HEADER REMOVED) ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <button
            onClick={handleToggle}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: theme.toggleBg,
              color: theme.toggleFg,
              fontWeight: 500,
              fontSize: "0.85rem",
              transition: "background 0.45s, color 0.45s",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            <span>{isDark ? "🌙" : "☀️"}</span>
            <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
          </button>
        </div>

        {/* Saved Pill */}
        <div style={{ textAlign: "right", height: 24, marginBottom: 12 }}>
          <span
            style={{
              display: "inline-block",
              padding: "3px 12px",
              borderRadius: 999,
              background: "#22c55e22",
              color: "#22c55e",
              fontSize: "0.7rem",
              fontWeight: 600,
              opacity: showSaved ? 1 : 0,
              transform: showSaved ? "translateY(0)" : "translateY(4px)",
              transition: "opacity 0.4s, transform 0.4s",
            }}
          >
            ✓ Saved to localStorage
          </span>
        </div>

        {/* ── MAIN CARD ── */}
        <div
          style={{
            background: theme.cardBg,
            borderRadius: 20,
            padding: 28,
            marginBottom: 16,
            boxShadow: isDark
              ? "0 8px 40px rgba(0,0,0,0.5)"
              : "0 8px 40px rgba(0,0,0,0.08)",
            transition: "background 0.45s, box-shadow 0.45s",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: 999,
              background: theme.accent,
              color: "#fff",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Day 3 · Project 3
          </div>

          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.2, marginBottom: 10 }}>
            Theme <span style={{ color: theme.accent }}>Toggle</span>
            <br />Light / Dark Mode
          </h1>

          <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: theme.muted }}>
            Using React <strong>useState</strong> hook and saving preference in <strong>localStorage</strong>.
          </p>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { num: toggleCount, label: "Toggles" },
            { num: 2, label: "Themes" },
            { num: 1, label: "useState" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: theme.cardBg,
                borderRadius: 14,
                padding: 16,
                textAlign: "center",
                border: `1px solid ${
                  isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"
                }`,
              }}
            >
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: theme.accent }}>
                {s.num}
              </div>
              <div style={{ fontSize: "0.7rem", color: theme.muted, marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}