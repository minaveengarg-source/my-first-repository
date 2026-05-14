import { useState } from "react";

const CATEGORIES = ["🥦 Produce", "🥛 Dairy", "🍞 Bakery", "🥩 Meat", "🧴 Other"];

const categoryColors = {
  "🥦 Produce": { bg: "#EAF3DE", text: "#27500A", border: "#639922" },
  "🥛 Dairy": { bg: "#E6F1FB", text: "#0C447C", border: "#378ADD" },
  "🍞 Bakery": { bg: "#FAEEDA", text: "#633806", border: "#EF9F27" },
  "🥩 Meat": { bg: "#FAECE7", text: "#712B13", border: "#D85A30" },
  "🧴 Other": { bg: "#EEEDFE", text: "#3C3489", border: "#7F77DD" },
};

let nextId = 1;

export default function ShoppingListManager() {
  const [items, setItems] = useState([
    { id: nextId++, name: "Apples", quantity: 4, category: "🥦 Produce", bought: false },
    { id: nextId++, name: "Whole Milk", quantity: 1, category: "🥛 Dairy", bought: false },
    { id: nextId++, name: "Sourdough Bread", quantity: 1, category: "🍞 Bakery", bought: true },
  ]);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("🥩 Meat");
  const [filter, setFilter] = useState("All");

  const addItem = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setItems(prev => [
      ...prev,
      { id: nextId++, name: trimmed, quantity, category, bought: false },
    ]);
    setName("");
    setQuantity(1);
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const toggleBought = (id) =>
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, bought: !i.bought } : i))
    );

  const updateQty = (id, delta) =>
    setItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );

  const clearBought = () => setItems(prev => prev.filter(i => !i.bought));

  const filters = ["All", "Pending", "Bought"];
  const displayed = items.filter(i =>
    filter === "All" ? true : filter === "Pending" ? !i.bought : i.bought
  );

  const total = items.length;
  const bought = items.filter(i => i.bought).length;
  const progress = total === 0 ? 0 : Math.round((bought / total) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f6ff 0%, #fff8f0 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "#1a1a2e",
        color: "#fff",
        padding: "1.5rem 1.5rem 1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.25rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🛒</span>
          <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.5px" }}>
            ShoppingListManager
          </h1>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#c9c4e8", marginBottom: "6px" }}>
            <span>{bought}/{total} items bought</span>
            <span>{progress}%</span>
          </div>
          <div style={{ background: "#2d2d4e", borderRadius: "99px", height: "6px", overflow: "hidden" }}>
            <div style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7F77DD, #5DCAA5)",
              height: "100%",
              borderRadius: "99px",
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      </div>

      <div style={{ padding: "1.25rem 1rem", maxWidth: "520px", margin: "0 auto" }}>
        {/* Add Item Card */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          padding: "1.1rem",
          marginBottom: "1rem",
        }}>
          <p style={{ margin: "0 0 0.75rem", fontWeight: 600, fontSize: "0.85rem", color: "#444", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Add Item
          </p>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addItem()}
            placeholder="Item name…"
            style={{
              width: "100%", boxSizing: "border-box",
              border: "1.5px solid #e0ddf0", borderRadius: "10px",
              padding: "10px 12px", fontSize: "0.95rem",
              marginBottom: "0.65rem", outline: "none",
              fontFamily: "inherit",
            }}
          />

          <div style={{ display: "flex", gap: "8px", marginBottom: "0.65rem" }}>
            {/* Quantity control */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "#f5f3ff", borderRadius: "10px", padding: "6px 12px",
              flex: "0 0 auto",
            }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: "1.1rem", color: "#7F77DD", lineHeight: 1, padding: "0 2px",
                }}
              >−</button>
              <span style={{ fontWeight: 600, fontSize: "0.95rem", minWidth: "20px", textAlign: "center" }}>{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: "1.1rem", color: "#7F77DD", lineHeight: 1, padding: "0 2px",
                }}
              >+</button>
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{
                flex: 1, border: "1.5px solid #e0ddf0", borderRadius: "10px",
                padding: "8px 10px", fontSize: "0.85rem", outline: "none",
                background: "#fff", fontFamily: "inherit", cursor: "pointer",
              }}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <button
            onClick={addItem}
            style={{
              width: "100%", background: "#1a1a2e", color: "#fff",
              border: "none", borderRadius: "10px", padding: "10px",
              fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
              letterSpacing: "0.3px", transition: "opacity 0.15s",
            }}
            onMouseOver={e => e.target.style.opacity = "0.85"}
            onMouseOut={e => e.target.style.opacity = "1"}
          >
            + Add to List
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "0.85rem" }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flex: 1, padding: "7px 0", borderRadius: "99px",
                border: filter === f ? "none" : "1.5px solid #e0ddf0",
                background: filter === f ? "#1a1a2e" : "#fff",
                color: filter === f ? "#fff" : "#666",
                fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {displayed.length === 0 && (
            <div style={{
              textAlign: "center", padding: "2.5rem 1rem",
              color: "#aaa", fontSize: "0.9rem",
            }}>
              {filter === "Bought" ? "Nothing bought yet 🛒" : "Your list is empty — add something!"}
            </div>
          )}

          {displayed.map(item => {
            const col = categoryColors[item.category] || categoryColors["🧴 Other"];
            return (
              <div
                key={item.id}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  padding: "0.85rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  opacity: item.bought ? 0.6 : 1,
                  transition: "opacity 0.2s",
                  borderLeft: `4px solid ${col.border}`,
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleBought(item.id)}
                  aria-label={item.bought ? "Mark as pending" : "Mark as bought"}
                  style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    border: `2px solid ${item.bought ? col.border : "#d0cce8"}`,
                    background: item.bought ? col.border : "transparent",
                    cursor: "pointer", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", padding: 0,
                  }}
                >
                  {item.bought && <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>✓</span>}
                </button>

                {/* Name + category */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: 0, fontWeight: 600, fontSize: "0.95rem",
                    textDecoration: item.bought ? "line-through" : "none",
                    color: item.bought ? "#aaa" : "#1a1a2e",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {item.name}
                  </p>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 500,
                    background: col.bg, color: col.text,
                    borderRadius: "99px", padding: "2px 8px", display: "inline-block",
                    marginTop: "2px",
                  }}>
                    {item.category}
                  </span>
                </div>

                {/* Quantity control */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  background: "#f7f5ff", borderRadius: "8px", padding: "4px 8px",
                }}>
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#7F77DD", fontWeight: 700, fontSize: "1rem", padding: "0 2px" }}
                  >−</button>
                  <span style={{ fontWeight: 700, fontSize: "0.88rem", minWidth: "18px", textAlign: "center" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#7F77DD", fontWeight: 700, fontSize: "1rem", padding: "0 2px" }}
                  >+</button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove item"
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#ccc", fontSize: "1.1rem", padding: "0 2px",
                    flexShrink: 0, lineHeight: 1, transition: "color 0.15s",
                  }}
                  onMouseOver={e => e.target.style.color = "#E24B4A"}
                  onMouseOut={e => e.target.style.color = "#ccc"}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* Clear bought */}
        {bought > 0 && (
          <button
            onClick={clearBought}
            style={{
              marginTop: "1rem", width: "100%",
              background: "none", border: "1.5px dashed #FCEBEB",
              borderRadius: "10px", padding: "9px",
              color: "#A32D2D", fontSize: "0.85rem", fontWeight: 600,
              cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseOver={e => e.target.style.background = "#FCEBEB"}
            onMouseOut={e => e.target.style.background = "none"}
          >
            🗑 Clear {bought} bought item{bought > 1 ? "s" : ""}
          </button>
        )}

        {/* Stats row */}
        <div style={{ display: "flex", gap: "8px", marginTop: "1rem" }}>
          {[
            { label: "Total Items", value: total },
            { label: "Pending", value: total - bought },
            { label: "Bought", value: bought },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: "#fff", borderRadius: "12px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              padding: "0.75rem", textAlign: "center",
            }}>
              <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#1a1a2e" }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#999", marginTop: "2px" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
