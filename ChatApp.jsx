import { useState, useEffect, useRef } from "react";

// ─── Inline SVG Icon ───────────────────────────────────────────────────────
const SendIcon = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────────────────
const USERS = ["You", "Rahul", "Priya", "Aman"];

const initialMessages = [
  { id: 1, user: "Rahul", text: "Hello Everyone 👋",    time: "10:00 AM" },
  { id: 2, user: "Naveen", text: "Hi Rahul! How are you?", time: "10:01 AM" },
];

const userColors = {
  Rahul:  "#7c3aed",
  Naveen: "#0891b2",
  Priya:  "#db2777",
  Aman:   "#d97706",
  You:    "#2563eb",
};

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages]       = useState(initialMessages);
  const [input, setInput]             = useState("");
  const [selectedUser, setSelectedUser] = useState("You");
  const chatEndRef                    = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id:   Date.now(),
        user: selectedUser,
        text: input.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.chatContainer}>

        {/* ── Header ── */}
        <div style={styles.chatHeader}>
          <div style={styles.headerLeft}>
            <span style={styles.onlineDot} />
            <h2 style={styles.headerTitle}>💬 Real-Time Chat UI</h2>
          </div>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={styles.userSelect}
          >
            {USERS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        {/* ── Messages ── */}
        <div style={styles.chatBox}>
          {messages.map((msg) => {
            const isYou = msg.user === selectedUser;
            const color = userColors[msg.user] || "#475569";
            return (
              <div
                key={msg.id}
                style={{
                  ...styles.messageRow,
                  justifyContent: isYou ? "flex-end" : "flex-start",
                }}
              >
                {/* Avatar (other side only) */}
                {!isYou && (
                  <div style={{ ...styles.avatar, background: color }}>
                    {msg.user[0]}
                  </div>
                )}

                <div
                  style={{
                    ...styles.bubble,
                    background:          isYou ? color : "#e2e8f0",
                    color:               isYou ? "white" : "#111827",
                    borderBottomRightRadius: isYou ? "2px" : "12px",
                    borderBottomLeftRadius:  isYou ? "12px" : "2px",
                  }}
                >
                  {!isYou && (
                    <span style={{ ...styles.senderName, color }}>{msg.user}</span>
                  )}
                  <p style={styles.bubbleText}>{msg.text}</p>
                  <span style={styles.timestamp}>{msg.time}</span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* ── Input ── */}
        <div style={styles.chatInput}>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.inputField}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            style={{
              ...styles.sendBtn,
              background:   input.trim() ? "#2563eb" : "#94a3b8",
              cursor:       input.trim() ? "pointer" : "not-allowed",
            }}
          >
            <SendIcon />
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  app: {
    height:          "100vh",
    display:         "flex",
    justifyContent:  "center",
    alignItems:      "center",
    padding:         "20px",
    background:      "#e2e8f0",
    fontFamily:      "Arial, sans-serif",
    boxSizing:       "border-box",
    margin:          0,
  },
  chatContainer: {
    width:          "100%",
    maxWidth:       "500px",
    height:         "90vh",
    background:     "white",
    borderRadius:   "15px",
    overflow:       "hidden",
    display:        "flex",
    flexDirection:  "column",
    boxShadow:      "0 4px 20px rgba(0,0,0,0.15)",
  },
  chatHeader: {
    background:      "#1e293b",
    color:           "white",
    padding:         "16px 20px",
    display:         "flex",
    justifyContent:  "space-between",
    alignItems:      "center",
    flexShrink:      0,
  },
  headerLeft: {
    display:     "flex",
    alignItems:  "center",
    gap:         "10px",
  },
  onlineDot: {
    width:        "10px",
    height:       "10px",
    borderRadius: "50%",
    background:   "#22c55e",
    display:      "inline-block",
    boxShadow:    "0 0 0 2px rgba(34,197,94,0.3)",
  },
  headerTitle: {
    fontSize:   "17px",
    fontWeight: "600",
    color:      "white",
  },
  userSelect: {
    padding:      "8px 10px",
    border:       "none",
    borderRadius: "8px",
    outline:      "none",
    fontSize:     "14px",
    cursor:       "pointer",
  },
  chatBox: {
    flex:       1,
    padding:    "20px",
    overflowY:  "auto",
    background: "#f8fafc",
    display:    "flex",
    flexDirection: "column",
    gap:        "12px",
  },
  messageRow: {
    display:    "flex",
    alignItems: "flex-end",
    gap:        "8px",
  },
  avatar: {
    width:        "32px",
    height:       "32px",
    borderRadius: "50%",
    color:        "white",
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
    fontSize:     "13px",
    fontWeight:   "700",
    flexShrink:   0,
  },
  bubble: {
    maxWidth:     "75%",
    padding:      "10px 14px",
    borderRadius: "12px",
  },
  senderName: {
    display:      "block",
    fontSize:     "12px",
    fontWeight:   "600",
    marginBottom: "4px",
  },
  bubbleText: {
    fontSize:    "15px",
    lineHeight:  "1.45",
    marginBottom: "5px",
    wordBreak:   "break-word",
  },
  timestamp: {
    display:   "block",
    fontSize:  "11px",
    opacity:   0.7,
    textAlign: "right",
  },
  chatInput: {
    display:      "flex",
    padding:      "14px 16px",
    borderTop:    "1px solid #e2e8f0",
    background:   "white",
    gap:          "10px",
    flexShrink:   0,
  },
  inputField: {
    flex:         1,
    padding:      "11px 14px",
    border:       "1px solid #cbd5e1",
    borderRadius: "10px",
    outline:      "none",
    fontSize:     "15px",
    background:   "#f8fafc",
  },
  sendBtn: {
    padding:      "11px 16px",
    border:       "none",
    borderRadius: "10px",
    color:        "white",
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
    transition:   "background 0.2s",
    flexShrink:   0,
  },
};
