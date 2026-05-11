import { useState } from "react";

// ── FILTER OPTIONS ──
const FILTERS = ["All", "Pending", "Completed"];

export default function AdvancedTodo() {
  // ── COMPLEX STATE ──
  const [tasks, setTasks] = useState([
    { id: 1, text: "Learn React useState & useEffect", completed: true },
    { id: 2, text: "Build controlled form with validation", completed: true },
    { id: 3, text: "Create basic To-Do list", completed: true },
    { id: 4, text: "Build advanced To-Do with filters", completed: false },
  ]);

  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // ── ADD TASK ──
  const handleAdd = () => {
    if (!input.trim()) { setError("Task cannot be empty!"); return; }
    setTasks(prev => [
      ...prev,
      { id: Date.now(), text: input.trim(), completed: false },
    ]);
    setInput("");
    setError("");
  };

  // ── DELETE TASK ──
  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (editId === id) { setEditId(null); setEditText(""); }
  };

  // ── TOGGLE COMPLETE ──
  const handleToggle = (id) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  };

  // ── START EDIT (Bonus) ──
  const handleEditStart = (task) => {
    setEditId(task.id);
    setEditText(task.text);
  };

  // ── SAVE EDIT (Bonus) ──
  const handleEditSave = (id) => {
    if (!editText.trim()) return;
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, text: editText.trim() } : t)
    );
    setEditId(null);
    setEditText("");
  };

  // ── CANCEL EDIT ──
  const handleEditCancel = () => { setEditId(null); setEditText(""); };

  // ── FILTER LOGIC (Bonus) ──
  const filteredTasks = tasks.filter(t => {
    if (filter === "Completed") return t.completed;
    if (filter === "Pending") return !t.completed;
    return true;
  });

  // ── COUNTS ──
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;

  // ── CLEAR COMPLETED ──
  const clearCompleted = () => setTasks(prev => prev.filter(t => !t.completed));

  // ── STYLES ──
  const accent = "#6c63ff";
  const s = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "20px",
    },
    card: {
      background: "#1e1e2e", borderRadius: 24, padding: "32px 28px",
      width: "100%", maxWidth: 500,
      boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      border: "1px solid rgba(255,255,255,0.06)",
    },
    badge: {
      display: "inline-block", background: accent, color: "#fff",
      fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase", padding: "4px 12px", borderRadius: 999, marginBottom: 10,
    },
    title: { fontSize: "1.7rem", fontWeight: 800, color: "#e2e8f0", marginBottom: 4 },
    subtitle: { fontSize: "0.82rem", color: "#64748b", marginBottom: 20 },

    // stats
    statsRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 },
    statBox: (color) => ({
      background: color + "18", border: `1.5px solid ${color}40`,
      borderRadius: 12, padding: "10px 8px", textAlign: "center",
    }),
    statNum: (color) => ({ fontSize: "1.5rem", fontWeight: 800, color }),
    statLbl: { fontSize: "0.65rem", color: "#64748b", fontWeight: 600, marginTop: 2,
      textTransform: "uppercase", letterSpacing: "0.05em" },

    // input
    inputRow: { display: "flex", gap: 10, marginBottom: 6 },
    input: {
      flex: 1, padding: "12px 16px", borderRadius: 12,
      border: "2px solid rgba(255,255,255,0.08)", background: "#2a2a3e",
      fontSize: "0.92rem", outline: "none", fontFamily: "inherit",
      color: "#e2e8f0", transition: "border 0.2s",
    },
    addBtn: {
      padding: "12px 18px", borderRadius: 12, border: "none",
      background: accent, color: "#fff", fontWeight: 700,
      fontSize: "1.3rem", cursor: "pointer", flexShrink: 0,
    },
    errorText: { color: "#f87171", fontSize: "0.75rem", marginBottom: 12, paddingLeft: 4 },

    // filter tabs
    filterRow: { display: "flex", gap: 8, marginBottom: 16 },
    filterBtn: (active) => ({
      flex: 1, padding: "8px 0", borderRadius: 10, border: "none",
      background: active ? accent : "rgba(255,255,255,0.05)",
      color: active ? "#fff" : "#64748b",
      fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
      transition: "all 0.2s",
    }),

    // task item
    taskItem: (completed) => ({
      display: "flex", alignItems: "center", gap: 12,
      padding: "13px 14px", borderRadius: 14, marginBottom: 8,
      background: completed ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)",
      border: `1.5px solid ${completed ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)"}`,
      transition: "all 0.2s",
    }),
    checkbox: (completed) => ({
      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
      border: `2px solid ${completed ? "#22c55e" : "#475569"}`,
      background: completed ? "#22c55e" : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "all 0.2s", color: "#fff",
      fontSize: "0.7rem", fontWeight: 800,
    }),
    taskText: (completed) => ({
      flex: 1, fontSize: "0.92rem",
      color: completed ? "#475569" : "#e2e8f0",
      textDecoration: completed ? "line-through" : "none",
      transition: "all 0.2s",
    }),
    editInput: {
      flex: 1, padding: "6px 10px", borderRadius: 8,
      border: `2px solid ${accent}`, background: "#2a2a3e",
      color: "#e2e8f0", fontSize: "0.9rem", outline: "none",
      fontFamily: "inherit",
    },
    iconBtn: (color) => ({
      background: "transparent", border: "none", cursor: "pointer",
      color: color, fontSize: "0.85rem", padding: "3px 6px",
      borderRadius: 6, flexShrink: 0, transition: "opacity 0.2s",
    }),

    // empty
    empty: {
      textAlign: "center", padding: "28px 0", color: "#475569", fontSize: "2rem",
    },

    // footer
    footer: {
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginTop: 16, paddingTop: 14,
      borderTop: "1px solid rgba(255,255,255,0.06)",
    },
    footerText: { fontSize: "0.78rem", color: "#475569" },
    clearBtn: {
      background: "transparent", border: "1px solid rgba(248,113,113,0.3)",
      color: "#f87171", fontSize: "0.75rem", fontWeight: 600,
      padding: "5px 12px", borderRadius: 8, cursor: "pointer",
    },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* ── HEADER ── */}
        <div style={s.badge}>Day 6 · Project 6</div>
        <div style={s.title}>Advanced To-Do 🚀</div>
        <div style={s.subtitle}>State Arrays · Updating Items · Conditional Rendering</div>

        {/* ── STATS ── */}
        <div style={s.statsRow}>
          <div style={s.statBox("#6c63ff")}>
            <div style={s.statNum("#6c63ff")}>{total}</div>
            <div style={s.statLbl}>Total</div>
          </div>
          <div style={s.statBox("#22c55e")}>
            <div style={s.statNum("#22c55e")}>{completed}</div>
            <div style={s.statLbl}>Done</div>
          </div>
          <div style={s.statBox("#f59e0b")}>
            <div style={s.statNum("#f59e0b")}>{pending}</div>
            <div style={s.statLbl}>Pending</div>
          </div>
        </div>

        {/* ── ADD TASK ── */}
        <div style={s.inputRow}>
          <input
            style={s.input}
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button style={s.addBtn} onClick={handleAdd}>+</button>
        </div>
        {error && <div style={s.errorText}>⚠ {error}</div>}

        {/* ── FILTER TABS (Bonus) ── */}
        <div style={s.filterRow}>
          {FILTERS.map(f => (
            <button
              key={f}
              style={s.filterBtn(filter === f)}
              onClick={() => setFilter(f)}
            >
              {f === "All" ? `📋 All` : f === "Pending" ? `⏳ Pending` : `✅ Done`}
            </button>
          ))}
        </div>

        {/* ── TASK LIST ── */}
        {filteredTasks.length === 0 ? (
          <div style={s.empty}>
            <div>{filter === "Completed" ? "🎯" : filter === "Pending" ? "🎉" : "📭"}</div>
            <div style={{ fontSize: "0.85rem", marginTop: 8 }}>
              {filter === "Completed" ? "No completed tasks yet"
                : filter === "Pending" ? "All tasks completed!"
                : "No tasks yet. Add one above!"}
            </div>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} style={s.taskItem(task.completed)}>

              {/* Checkbox */}
              <div style={s.checkbox(task.completed)} onClick={() => handleToggle(task.id)}>
                {task.completed && "✓"}
              </div>

              {/* Text or Edit Input (Bonus) */}
              {editId === task.id ? (
                <>
                  <input
                    style={s.editInput}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave(task.id);
                      if (e.key === "Escape") handleEditCancel();
                    }}
                    autoFocus
                  />
                  <button style={s.iconBtn("#22c55e")} onClick={() => handleEditSave(task.id)} title="Save">💾</button>
                  <button style={s.iconBtn("#64748b")} onClick={handleEditCancel} title="Cancel">✕</button>
                </>
              ) : (
                <>
                  <span style={s.taskText(task.completed)}>{task.text}</span>
                  {/* Edit Button (Bonus) */}
                  {!task.completed && (
                    <button style={s.iconBtn("#6c63ff")} onClick={() => handleEditStart(task)} title="Edit">✏️</button>
                  )}
                  {/* Delete Button */}
                  <button style={s.iconBtn("#f87171")} onClick={() => handleDelete(task.id)} title="Delete">🗑</button>
                </>
              )}
            </div>
          ))
        )}

        {/* ── FOOTER ── */}
        <div style={s.footer}>
          <span style={s.footerText}>{pending} task{pending !== 1 ? "s" : ""} remaining</span>
          {completed > 0 && (
            <button style={s.clearBtn} onClick={clearCompleted}>
              Clear Completed
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
