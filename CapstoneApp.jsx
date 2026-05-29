import { useState, useEffect } from "react";

// ─── Inline SVG Icons ──────────────────────────────────────────────────────
const TasksIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// ─── Nav pages ─────────────────────────────────────────────────────────────
const NAV = ["Dashboard", "Tasks", "Notes", "Profile"];

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar({ page, setPage }) {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.navBrand}>🚀 Final Capstone App</h2>
      <div style={styles.navLinks}>
        {NAV.map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            style={{
              ...styles.navBtn,
              color:      page === n ? "#38bdf8" : "white",
              borderBottom: page === n ? "2px solid #38bdf8" : "2px solid transparent",
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
function Dashboard({ setPage }) {
  const cards = [
    { icon: <TasksIcon />, title: "Task Manager",     desc: "Manage your daily tasks efficiently.", goto: "Tasks" },
    { icon: "📝",          title: "Notes App",        desc: "Save important notes and ideas.",       goto: "Notes" },
    { icon: "📊",          title: "State Management", desc: "Practice React state and routing.",     goto: null },
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Welcome To Capstone Project</h1>
      <div style={styles.dashboardCards}>
        {cards.map((c) => (
          <div
            key={c.title}
            style={styles.card}
            onClick={() => c.goto && setPage(c.goto)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
            }}
          >
            <div style={styles.cardIcon}>{c.icon}</div>
            <h3 style={styles.cardTitle}>{c.title}</h3>
            <p style={styles.cardDesc}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tasks ─────────────────────────────────────────────────────────────────
function Tasks() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tasks")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem("tasks", JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: input.trim() }]);
    setInput("");
  };

  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>📋 Task Manager</h1>
      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Enter a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          style={styles.textInput}
        />
        <button
          onClick={addTask}
          style={{ ...styles.addBtn, background: input.trim() ? "#2563eb" : "#94a3b8" }}
          disabled={!input.trim()}
        >
          <PlusIcon />
        </button>
      </div>

      {tasks.length === 0 ? (
        <p style={styles.emptyMsg}>No tasks yet. Add one above!</p>
      ) : (
        <div style={styles.taskList}>
          {tasks.map((t) => (
            <div key={t.id} style={styles.taskItem}>
              <span style={styles.taskText}>{t.text}</span>
              <button style={styles.deleteBtn} onClick={() => deleteTask(t.id)}>
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Notes ─────────────────────────────────────────────────────────────────
const NOTE_COLORS = ["#fef9c3", "#dcfce7", "#fce7f3", "#dbeafe", "#ede9fe", "#ffedd5"];

function Notes() {
  const [input, setInput] = useState("");
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("notes")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem("notes", JSON.stringify(notes)); } catch {}
  }, [notes]);

  const addNote = () => {
    if (!input.trim()) return;
    setNotes(prev => [
      ...prev,
      {
        id:    Date.now(),
        text:  input.trim(),
        color: NOTE_COLORS[prev.length % NOTE_COLORS.length],
      },
    ]);
    setInput("");
  };

  const deleteNote = (id) => setNotes(prev => prev.filter(n => n.id !== id));

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>📝 Notes App</h1>
      <div style={{ ...styles.inputBox, alignItems: "flex-start" }}>
        <textarea
          placeholder="Write your note..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.textarea}
        />
        <button
          onClick={addNote}
          style={{ ...styles.addBtn, background: input.trim() ? "#2563eb" : "#94a3b8" }}
          disabled={!input.trim()}
        >
          <PlusIcon />
        </button>
      </div>

      {notes.length === 0 ? (
        <p style={styles.emptyMsg}>No notes yet. Write one above!</p>
      ) : (
        <div style={styles.notesGrid}>
          {notes.map((n) => (
            <div key={n.id} style={{ ...styles.noteCard, background: n.color }}>
              <p style={styles.noteText}>{n.text}</p>
              <button style={styles.deleteBtn} onClick={() => deleteNote(n.id)}>
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Profile ───────────────────────────────────────────────────────────────
function Profile() {
  const [name,    setName]    = useState("Naveen");
  const [email,   setEmail]   = useState("naveen@gmail.com");
  const [saved,   setSaved]   = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>👤 Profile</h1>
      <div style={styles.profileCard}>
        <h3 style={styles.profileHeading}>User Information</h3>

        {saved && <div style={styles.successBanner}>✅ Profile updated successfully!</div>}

        <label style={styles.label}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.profileInput}
        />

        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.profileInput}
        />

        <button style={styles.updateBtn} onClick={handleSave}>
          <EditIcon />
          Update Profile
        </button>
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Dashboard");

  const renderPage = () => {
    if (page === "Dashboard") return <Dashboard setPage={setPage} />;
    if (page === "Tasks")     return <Tasks />;
    if (page === "Notes")     return <Notes />;
    if (page === "Profile")   return <Profile />;
  };

  return (
    <div style={styles.app}>
      <Navbar page={page} setPage={setPage} />
      <div style={styles.container}>{renderPage()}</div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight:  "100vh",
    background: "#f1f5f9",
    fontFamily: "Arial, sans-serif",
    margin:     0,
    padding:    0,
  },
  navbar: {
    background:      "#1e293b",
    padding:         "16px 40px",
    display:         "flex",
    justifyContent:  "space-between",
    alignItems:      "center",
    flexWrap:        "wrap",
    gap:             "12px",
  },
  navBrand: {
    color:      "white",
    fontSize:   "18px",
    fontWeight: "700",
  },
  navLinks: {
    display:  "flex",
    gap:      "8px",
    flexWrap: "wrap",
  },
  navBtn: {
    background:   "none",
    border:       "none",
    cursor:       "pointer",
    fontWeight:   "600",
    fontSize:     "14px",
    padding:      "6px 12px",
    borderRadius: "6px",
    transition:   "color 0.2s, border-bottom 0.2s",
    paddingBottom: "4px",
  },
  container: {
    padding: "30px",
  },
  page: {},
  pageTitle: {
    marginBottom: "24px",
    color:        "#1e293b",
    fontSize:     "22px",
    fontWeight:   "700",
  },
  dashboardCards: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap:                 "20px",
  },
  card: {
    background:    "white",
    padding:       "28px 24px",
    borderRadius:  "14px",
    boxShadow:     "0 2px 10px rgba(0,0,0,0.08)",
    textAlign:     "center",
    transition:    "transform 0.25s, box-shadow 0.25s",
    cursor:        "pointer",
  },
  cardIcon: {
    fontSize:     "36px",
    marginBottom: "12px",
  },
  cardTitle: {
    margin:     "12px 0 8px",
    color:      "#1e293b",
    fontSize:   "17px",
    fontWeight: "600",
  },
  cardDesc: {
    color:    "#64748b",
    fontSize: "14px",
  },
  inputBox: {
    display:      "flex",
    gap:          "10px",
    marginBottom: "24px",
    flexWrap:     "wrap",
  },
  textInput: {
    flex:         1,
    padding:      "12px 14px",
    border:       "1px solid #cbd5e1",
    borderRadius: "10px",
    outline:      "none",
    fontSize:     "15px",
    minWidth:     "0",
  },
  textarea: {
    flex:         1,
    padding:      "12px 14px",
    border:       "1px solid #cbd5e1",
    borderRadius: "10px",
    outline:      "none",
    fontSize:     "15px",
    minHeight:    "110px",
    resize:       "vertical",
    minWidth:     "0",
  },
  addBtn: {
    color:        "white",
    border:       "none",
    padding:      "12px 18px",
    borderRadius: "10px",
    cursor:       "pointer",
    transition:   "background 0.2s",
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
    flexShrink:   0,
  },
  emptyMsg: {
    color:    "#94a3b8",
    fontSize: "15px",
  },
  taskList: {
    display:       "flex",
    flexDirection: "column",
    gap:           "12px",
  },
  taskItem: {
    background:      "white",
    padding:         "14px 18px",
    borderRadius:    "10px",
    display:         "flex",
    justifyContent:  "space-between",
    alignItems:      "center",
    boxShadow:       "0 2px 8px rgba(0,0,0,0.07)",
  },
  taskText: {
    fontSize: "15px",
    color:    "#1e293b",
  },
  deleteBtn: {
    background:   "#ef4444",
    color:        "white",
    border:       "none",
    padding:      "8px 10px",
    borderRadius: "8px",
    cursor:       "pointer",
    display:      "flex",
    alignItems:   "center",
    flexShrink:   0,
  },
  notesGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap:                 "18px",
  },
  noteCard: {
    padding:       "18px",
    borderRadius:  "12px",
    display:       "flex",
    flexDirection: "column",
    gap:           "12px",
    boxShadow:     "0 2px 8px rgba(0,0,0,0.07)",
  },
  noteText: {
    fontSize:   "14px",
    color:      "#1e293b",
    lineHeight: "1.6",
    flex:       1,
    whiteSpace: "pre-wrap",
  },
  profileCard: {
    maxWidth:     "480px",
    background:   "white",
    padding:      "28px",
    borderRadius: "14px",
    boxShadow:    "0 2px 10px rgba(0,0,0,0.08)",
  },
  profileHeading: {
    color:        "#1e293b",
    fontSize:     "17px",
    fontWeight:   "600",
    marginBottom: "6px",
  },
  successBanner: {
    background:   "#dcfce7",
    color:        "#15803d",
    padding:      "10px 14px",
    borderRadius: "8px",
    fontSize:     "14px",
    margin:       "12px 0",
  },
  label: {
    display:    "block",
    margin:     "16px 0 6px",
    fontWeight: "600",
    fontSize:   "14px",
    color:      "#374151",
  },
  profileInput: {
    width:        "100%",
    padding:      "11px 13px",
    border:       "1px solid #cbd5e1",
    borderRadius: "10px",
    outline:      "none",
    fontSize:     "15px",
    boxSizing:    "border-box",
  },
  updateBtn: {
    marginTop:      "20px",
    width:          "100%",
    padding:        "12px",
    border:         "none",
    borderRadius:   "10px",
    background:     "#2563eb",
    color:          "white",
    cursor:         "pointer",
    display:        "flex",
    justifyContent: "center",
    alignItems:     "center",
    gap:            "8px",
    fontSize:       "15px",
    fontWeight:     "600",
    transition:     "background 0.2s",
  },
};
