import { useState, useEffect, useCallback } from "react";

const QUESTIONS = [
  {
    id: 1,
    question: "What hook is used to manage state in a React functional component?",
    options: ["useEffect", "useContext", "useState", "useReducer"],
    answer: "useState",
    category: "Hooks",
  },
  {
    id: 2,
    question: "Which method is called when a React component is first rendered to the DOM?",
    options: ["componentDidUpdate", "componentDidMount", "componentWillUnmount", "render"],
    answer: "componentDidMount",
    category: "Lifecycle",
  },
  {
    id: 3,
    question: "What does JSX stand for?",
    options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"],
    answer: "JavaScript XML",
    category: "Basics",
  },
  {
    id: 4,
    question: "Which hook runs a side effect after every render by default?",
    options: ["useState", "useRef", "useEffect", "useMemo"],
    answer: "useEffect",
    category: "Hooks",
  },
  {
    id: 5,
    question: "In React, what is the virtual DOM?",
    options: [
      "A real DOM copy stored in memory",
      "A lightweight in-memory representation of the real DOM",
      "The browser's built-in cache",
      "A server-side rendering technique",
    ],
    answer: "A lightweight in-memory representation of the real DOM",
    category: "Core Concepts",
  },
  {
    id: 6,
    question: "What prop is used to pass child elements into a component?",
    options: ["props.children", "props.elements", "props.content", "props.nodes"],
    answer: "props.children",
    category: "Props",
  },
  {
    id: 7,
    question: "Which of the following is a valid way to conditionally render in React?",
    options: ["if/else only", "switch only", "Ternary operator and &&", "for loop"],
    answer: "Ternary operator and &&",
    category: "Rendering",
  },
  {
    id: 8,
    question: "What is the purpose of the `key` prop in React lists?",
    options: [
      "To style list items",
      "To help React identify which items changed",
      "To set list item IDs",
      "To define list order",
    ],
    answer: "To help React identify which items changed",
    category: "Lists",
  },
];

const TIMER_SECONDS = 15;

const categoryColors = {
  Hooks: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  Lifecycle: { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  Basics: { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  "Core Concepts": { bg: "#FAF5FF", text: "#7E22CE", border: "#E9D5FF" },
  Props: { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  Rendering: { bg: "#F0FDFA", text: "#0F766E", border: "#99F6E4" },
  Lists: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
};

export default function QuizApp() {
  const [screen, setScreen] = useState("start"); // start | quiz | result
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [history, setHistory] = useState([]);
  const [timedOut, setTimedOut] = useState(false);

  const question = QUESTIONS[currentQ];
  const isLast = currentQ === QUESTIONS.length - 1;
  const progress = ((currentQ + (answered ? 1 : 0)) / QUESTIONS.length) * 100;

  const handleTimeout = useCallback(() => {
    if (!answered) {
      setTimedOut(true);
      setAnswered(true);
      setHistory((h) => [
        ...h,
        { question: question.question, selected: null, correct: question.answer, isCorrect: false },
      ]);
    }
  }, [answered, question]);

  useEffect(() => {
    if (screen !== "quiz" || answered) return;
    if (timeLeft === 0) { handleTimeout(); return; }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, timeLeft, answered, handleTimeout]);

  const handleSelect = (opt) => {
    if (answered) return;
    const isCorrect = opt === question.answer;
    setSelected(opt);
    setAnswered(true);
    if (isCorrect) setScore((s) => s + 1);
    setHistory((h) => [
      ...h,
      { question: question.question, selected: opt, correct: question.answer, isCorrect },
    ]);
  };

  const handleNext = () => {
    if (isLast) { setScreen("result"); return; }
    setCurrentQ((q) => q + 1);
    setSelected(null);
    setAnswered(false);
    setTimedOut(false);
    setTimeLeft(TIMER_SECONDS);
  };

  const handleRestart = () => {
    setScreen("start");
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setTimedOut(false);
    setScore(0);
    setTimeLeft(TIMER_SECONDS);
    setHistory([]);
  };

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 8 ? "#22C55E" : timeLeft > 4 ? "#F59E0B" : "#EF4444";

  const scorePercent = Math.round((score / QUESTIONS.length) * 100);
  const grade =
    scorePercent >= 90 ? "🏆 Excellent!" :
    scorePercent >= 70 ? "🌟 Great job!" :
    scorePercent >= 50 ? "👍 Keep going!" : "📚 Keep studying!";

  const catColor = categoryColors[question?.category] || { bg: "#F8FAFC", text: "#475569", border: "#E2E8F0" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── START SCREEN ── */}
      {screen === "start" && (
        <div style={{ background: "#fff", borderRadius: 24, padding: "48px 40px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #667eea, #764ba2)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>⚛️</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1E1B4B", marginBottom: 8 }}>React.js Quiz</h1>
          <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>Test your React knowledge! {QUESTIONS.length} questions · {TIMER_SECONDS}s per question · Track your score</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
            {[["📝", `${QUESTIONS.length}`, "Questions"], ["⏱️", `${TIMER_SECONDS}s`, "Per Q"], ["🎯", "Score", "Tracked"]].map(([icon, val, label]) => (
              <div key={label} style={{ background: "#F5F3FF", borderRadius: 12, padding: "14px 8px" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#5B21B6" }}>{val}</div>
                <div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setScreen("quiz")} style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", letterSpacing: 0.3 }}>
            Start Quiz →
          </button>
        </div>
      )}

      {/* ── QUIZ SCREEN ── */}
      {screen === "quiz" && (
        <div style={{ background: "#fff", borderRadius: 24, padding: "36px 40px", maxWidth: 560, width: "100%", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280" }}>Q {currentQ + 1} / {QUESTIONS.length}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#5B21B6" }}>Score: {score} / {QUESTIONS.length}</span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, background: "#E5E7EB", borderRadius: 99, marginBottom: 20, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #667eea, #764ba2)", borderRadius: 99, transition: "width 0.5s ease" }} />
          </div>

          {/* Timer */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 8, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${timerPct}%`, background: timerColor, borderRadius: 99, transition: "width 1s linear, background 0.3s" }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: timerColor, minWidth: 28 }}>{timeLeft}s</span>
          </div>

          {/* Category badge */}
          <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}`, marginBottom: 14 }}>
            {question.category}
          </span>

          {/* Question */}
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", lineHeight: 1.5, marginBottom: 24 }}>
            {question.question}
          </h2>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {question.options.map((opt) => {
              const isCorrect = opt === question.answer;
              const isChosen = opt === selected;
              let bg = "#fff", border = "1.5px solid #E5E7EB", color = "#374151", icon = null;
              if (answered) {
                if (isCorrect) { bg = "#F0FDF4"; border = "1.5px solid #4ADE80"; color = "#15803D"; icon = "✓"; }
                else if (isChosen && !isCorrect) { bg = "#FFF1F2"; border = "1.5px solid #FB7185"; color = "#BE123C"; icon = "✗"; }
              }
              return (
                <button key={opt} onClick={() => handleSelect(opt)} disabled={answered}
                  style={{ padding: "14px 18px", borderRadius: 12, background: bg, border, color, cursor: answered ? "default" : "pointer", textAlign: "left", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s", lineHeight: 1.4 }}>
                  <span>{opt}</span>
                  {icon && <span style={{ fontWeight: 700, fontSize: 16 }}>{icon}</span>}
                </button>
              );
            })}
          </div>

          {/* Timeout notice */}
          {timedOut && (
            <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#C2410C", fontWeight: 500 }}>
              ⏰ Time's up! The correct answer was: <strong>{question.answer}</strong>
            </div>
          )}

          {/* Next / Finish */}
          {answered && (
            <button onClick={handleNext} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              {isLast ? "See Results 🎉" : "Next Question →"}
            </button>
          )}
        </div>
      )}

      {/* ── RESULT SCREEN ── */}
      {screen === "result" && (
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px", maxWidth: 580, width: "100%", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{grade.split(" ")[0]}</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{grade.split(" ").slice(1).join(" ")}</h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F5F3FF", borderRadius: 99, padding: "8px 20px", marginTop: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#5B21B6" }}>{score}</span>
              <span style={{ color: "#7C3AED", fontSize: 15, fontWeight: 500 }}>/ {QUESTIONS.length} correct</span>
            </div>
          </div>

          {/* Score ring area */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Correct", val: score, color: "#22C55E", bg: "#F0FDF4" },
              { label: "Wrong", val: QUESTIONS.length - score, color: "#EF4444", bg: "#FFF1F2" },
              { label: "Score", val: `${scorePercent}%`, color: "#7C3AED", bg: "#F5F3FF" },
            ].map(({ label, val, color, bg }) => (
              <div key={label} style={{ background: bg, borderRadius: 14, padding: "16px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
                <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 12 }}>Question Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto", marginBottom: 24 }}>
            {history.map((h, i) => (
              <div key={i} style={{ background: h.isCorrect ? "#F0FDF4" : "#FFF1F2", borderLeft: `3px solid ${h.isCorrect ? "#4ADE80" : "#FB7185"}`, borderRadius: "0 10px 10px 0", padding: "10px 14px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: h.isCorrect ? "#15803D" : "#BE123C", marginBottom: 3 }}>
                  Q{i + 1}: {h.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </div>
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{h.question}</div>
                {!h.isCorrect && (
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                    {h.selected ? `You answered: ${h.selected}` : "⏰ Timed out"} · Correct: <strong style={{ color: "#15803D" }}>{h.correct}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button onClick={handleRestart} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            🔄 Try Again
          </button>
        </div>
      )}
    </div>
  );
}
