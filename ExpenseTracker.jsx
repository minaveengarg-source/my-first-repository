import { useState } from "react";

const CATEGORIES = ["Food", "Transport", "Shopping", "Health", "Entertainment", "Bills", "Other"];

const CAT_STYLE = {
  Food:          { bg: "#EAF3DE", text: "#27500A", dot: "#639922" },
  Transport:     { bg: "#E6F1FB", text: "#0C447C", dot: "#378ADD" },
  Shopping:      { bg: "#FBEAF0", text: "#72243E", dot: "#D4537E" },
  Health:        { bg: "#E1F5EE", text: "#085041", dot: "#1D9E75" },
  Entertainment: { bg: "#EEEDFE", text: "#3C3489", dot: "#7F77DD" },
  Bills:         { bg: "#FAEEDA", text: "#633806", dot: "#EF9F27" },
  Other:         { bg: "#F1EFE8", text: "#444441", dot: "#888780" },
};

let nextId = 1;

const defaultExpenses = [
  { id: nextId++, title: "Groceries",       amount: 850,  category: "Food",          date: "2026-05-12" },
  { id: nextId++, title: "Metro Pass",      amount: 300,  category: "Transport",     date: "2026-05-13" },
  { id: nextId++, title: "Netflix",         amount: 199,  category: "Entertainment", date: "2026-05-13" },
  { id: nextId++, title: "Electricity Bill",amount: 1200, category: "Bills",         date: "2026-05-14" },
];

function Badge({ category }) {
  const s = CAT_STYLE[category] || CAT_STYLE.Other;
  return (
    <span style={{
      background: s.bg, color: s.text,
      fontSize: "0.7rem", fontWeight: 600,
      borderRadius: "99px", padding: "2px 10px",
      display: "inline-flex", alignItems: "center", gap: "5px",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {category}
    </span>
  );
}

export default function ExpenseTracker() {
  const [expenses, setExpenses]   = useState(defaultExpenses);
  const [filter, setFilter]       = useState("All");
  const [editId, setEditId]       = useState(null);

  const blank = { title: "", amount: "", category: "Food", date: new Date().toISOString().slice(0, 10) };
  const [form, setForm] = useState(blank);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    const title = form.title.trim();
    const amount = parseFloat(form.amount);
    if (!title || isNaN(amount) || amount <= 0) return;
    if (editId !== null) {
      setExpenses(prev => prev.map(e => e.id === editId ? { ...e, title, amount, category: form.category, date: form.date } : e));
      setEditId(null);
    } else {
      setExpenses(prev => [{ id: nextId++, title, amount, category: form.category, date: form.date }, ...prev]);
    }
    setForm(blank);
  };

  const remove  = id => setExpenses(prev => prev.filter(e => e.id !== id));
  const startEdit = e => { setEditId(e.id); setForm({ title: e.title, amount: String(e.amount), category: e.category, date: e.date }); };
  const cancel  = () => { setEditId(null); setForm(blank); };

  const shown = filter === "All" ? expenses : expenses.filter(e => e.category === filter);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const shownTotal = shown.reduce((s, e) => s + e.amount, 0);

  const topCat = CATEGORIES.reduce((best, c) => {
    const sum = expenses.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0);
    return sum > (best.sum || 0) ? { cat: c, sum } : best;
  }, {});

  const inp = (override = {}) => ({
    style: {
      width: "100%", boxSizing: "border-box",
      border: "1.5px solid #e8e4f7", borderRadius: "10px",
      padding: "9px 12px", fontSize: "0.9rem",
      fontFamily: "inherit", outline: "none",
      background: "#fff",
      ...override,
    }
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f4f2fb", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d2250 100%)", padding: "1.4rem 1.25rem 1.1rem", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.6rem" }}>💸</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.5px" }}>Expense Tracker</h1>
            <p style={{ margin: 0, fontSize: "0.73rem", color: "#a89fd8" }}>Day 9 · State management with objects</p>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: "8px", marginTop: "1.1rem" }}>
          {[
            { label: "Total Spent",  value: `₹${total.toLocaleString("en-IN")}`,  accent: "#7F77DD" },
            { label: "Transactions", value: expenses.length,                        accent: "#5DCAA5" },
            { label: "Top Category", value: topCat.cat || "—",                     accent: "#EF9F27" },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: "rgba(255,255,255,0.09)",
              borderRadius: "12px", padding: "0.65rem 0.75rem",
              borderTop: `3px solid ${s.accent}`,
            }}>
              <p style={{ margin: 0, fontSize: "0.68rem", color: "#b5aed8" }}>{s.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "1rem" }}>

        {/* Form */}
        <div style={{
          background: "#fff", borderRadius: "16px",
          boxShadow: "0 2px 14px rgba(90,70,180,0.09)",
          padding: "1.1rem", marginBottom: "1rem",
        }}>
          <p style={{ margin: "0 0 0.75rem", fontWeight: 700, fontSize: "0.8rem", color: "#7F77DD", textTransform: "uppercase", letterSpacing: "0.6px" }}>
            {editId !== null ? "✏️ Edit Expense" : "➕ Add Expense"}
          </p>

          <input {...inp()} placeholder="Title (e.g. Lunch, Metro)" value={form.title}
            onChange={e => set("title", e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={{ ...inp().style, marginBottom: "8px" }} />

          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input {...inp()} placeholder="Amount (₹)" type="number" min="0" value={form.amount}
              onChange={e => set("amount", e.target.value)}
              style={{ ...inp().style, flex: 1 }} />
            <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
              style={{ ...inp().style, flex: 1 }} />
          </div>

          <select value={form.category} onChange={e => set("category", e.target.value)}
            style={{ ...inp().style, marginBottom: "10px", cursor: "pointer" }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={submit} style={{
              flex: 1, background: "#1a1a2e", color: "#fff",
              border: "none", borderRadius: "10px", padding: "10px",
              fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
            }}>
              {editId !== null ? "Save Changes" : "Add Expense"}
            </button>
            {editId !== null && (
              <button onClick={cancel} style={{
                padding: "10px 16px", background: "none",
                border: "1.5px solid #e0ddf0", borderRadius: "10px",
                fontSize: "0.88rem", cursor: "pointer", color: "#888",
              }}>Cancel</button>
            )}
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px", marginBottom: "0.85rem" }}>
          {["All", ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              flexShrink: 0, padding: "5px 14px",
              borderRadius: "99px", border: filter === c ? "none" : "1.5px solid #ddd",
              background: filter === c ? "#1a1a2e" : "#fff",
              color: filter === c ? "#fff" : "#666",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            }}>{c}</button>
          ))}
        </div>

        {/* Filter total */}
        {filter !== "All" && (
          <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#888", marginBottom: "0.5rem" }}>
            {filter} total: <strong style={{ color: "#1a1a2e" }}>₹{shownTotal.toLocaleString("en-IN")}</strong>
          </div>
        )}

        {/* Expense list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {shown.length === 0 && (
            <div style={{ textAlign: "center", padding: "2.5rem", color: "#bbb", fontSize: "0.9rem" }}>
              No expenses here yet.
            </div>
          )}
          {shown.map(e => {
            const s = CAT_STYLE[e.category] || CAT_STYLE.Other;
            return (
              <div key={e.id} style={{
                background: "#fff", borderRadius: "13px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                padding: "0.85rem 1rem",
                display: "flex", alignItems: "center", gap: "10px",
                borderLeft: `4px solid ${s.dot}`,
              }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "10px",
                  background: s.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "1.1rem", flexShrink: 0,
                }}>
                  {e.category === "Food" ? "🍽" : e.category === "Transport" ? "🚌" :
                   e.category === "Shopping" ? "🛍" : e.category === "Health" ? "💊" :
                   e.category === "Entertainment" ? "🎬" : e.category === "Bills" ? "📄" : "📦"}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem", color: "#1a1a2e",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {e.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px", flexWrap: "wrap" }}>
                    <Badge category={e.category} />
                    <span style={{ fontSize: "0.7rem", color: "#bbb" }}>{e.date}</span>
                  </div>
                </div>

                <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "#1a1a2e", flexShrink: 0 }}>
                  ₹{e.amount.toLocaleString("en-IN")}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
                  <button onClick={() => startEdit(e)} style={{
                    background: "#f0edff", border: "none", borderRadius: "7px",
                    width: "28px", height: "28px", cursor: "pointer", fontSize: "0.75rem",
                  }}>✏️</button>
                  <button onClick={() => remove(e.id)} style={{
                    background: "#fff0f0", border: "none", borderRadius: "7px",
                    width: "28px", height: "28px", cursor: "pointer", fontSize: "0.75rem",
                  }}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total bar */}
        {shown.length > 0 && (
          <div style={{
            marginTop: "1rem", background: "#1a1a2e", borderRadius: "12px",
            padding: "0.9rem 1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ color: "#a89fd8", fontSize: "0.85rem", fontWeight: 500 }}>
              {filter === "All" ? "Total Expenses" : `${filter} Total`} ({shown.length} items)
            </span>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>
              ₹{shownTotal.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
