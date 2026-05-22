import { useState, useCallback } from "react";

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    color: #e8e6f0;
  }

  .app {
    max-width: 960px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  .header h1 {
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: #f0eeff;
    margin-bottom: 6px;
  }
  .header h1 span { color: #7c6af7; }
  .header p {
    font-size: 13px;
    color: #5a566e;
    font-family: 'DM Mono', monospace;
  }

  /* Controls */
  .controls {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }
  .count-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #13121c;
    border: 1px solid #2a2740;
    border-radius: 10px;
    padding: 0 14px;
    height: 42px;
  }
  .count-wrap label {
    font-size: 13px;
    color: #5a566e;
    font-family: 'DM Mono', monospace;
  }
  .count-wrap input {
    width: 44px;
    background: #1e1c2e;
    border: 1px solid #2a2740;
    border-radius: 6px;
    padding: 4px 6px;
    font-size: 13px;
    text-align: center;
    color: #e8e6f0;
    font-family: 'DM Mono', monospace;
    outline: none;
  }
  .count-wrap input:focus { border-color: #7c6af7; }

  .btn {
    height: 42px;
    padding: 0 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
    border: none;
  }
  .btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-primary {
    background: #7c6af7;
    color: #fff;
  }
  .btn-primary:hover:not(:disabled) { background: #9080ff; }
  .btn-secondary {
    background: #13121c;
    color: #c8c4e0;
    border: 1px solid #2a2740;
  }
  .btn-secondary:hover:not(:disabled) { background: #1e1c2e; border-color: #7c6af7; }
  .btn-danger {
    background: #13121c;
    color: #e0506e;
    border: 1px solid #2a2740;
  }
  .btn-danger:hover:not(:disabled) { background: #1e0e14; border-color: #e0506e; }

  /* Spin animation for loading */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinning { display: inline-block; animation: spin 0.8s linear infinite; }

  /* Grid */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 14px;
    margin-bottom: 2rem;
  }

  /* User Card */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .user-card {
    background: #13121c;
    border: 1px solid #2a2740;
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    position: relative;
    animation: fadeUp 0.3s ease both;
    transition: border-color 0.2s, transform 0.15s;
  }
  .user-card:hover {
    border-color: #7c6af7;
    transform: translateY(-2px);
  }
  .user-card .remove-btn {
    position: absolute;
    top: 10px; right: 10px;
    background: none;
    border: none;
    color: #3a3650;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    padding: 2px;
    border-radius: 4px;
    transition: color 0.15s, background 0.15s;
  }
  .user-card .remove-btn:hover { color: #e0506e; background: #1e0e14; }

  .avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #2a2740;
  }
  .user-name {
    font-size: 14px;
    font-weight: 600;
    color: #f0eeff;
    line-height: 1.3;
  }
  .badge {
    display: inline-block;
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    padding: 2px 10px;
    border-radius: 20px;
    background: #1e1c2e;
    color: #7c6af7;
    border: 1px solid #2a2740;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .user-email {
    font-size: 11px;
    color: #5a566e;
    word-break: break-all;
    font-family: 'DM Mono', monospace;
  }
  .user-location {
    font-size: 11px;
    color: #3a3650;
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: center;
  }
  .save-btn {
    width: 100%;
    height: 32px;
    background: transparent;
    border: 1px solid #2a2740;
    border-radius: 8px;
    color: #7c6af7;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .save-btn:hover { background: #1e1c2e; border-color: #7c6af7; }
  .save-btn.saved-btn {
    color: #4ade80;
    border-color: #1a3a28;
    background: #0d1f15;
    cursor: default;
  }

  /* Skeleton */
  .skeleton-card {
    background: #13121c;
    border: 1px solid #2a2740;
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:0.6} }
  .sk { background: #2a2740; border-radius: 4px; animation: pulse 1.4s infinite; }
  .sk-circle { width: 72px; height: 72px; border-radius: 50%; }
  .sk-line { height: 10px; width: 80%; }
  .sk-line-sm { height: 9px; width: 60%; }

  /* Saved Section */
  .saved-section {
    border-top: 1px solid #2a2740;
    padding-top: 2rem;
  }
  .saved-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  .saved-header h3 {
    font-size: 15px;
    font-weight: 600;
    color: #f0eeff;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .count-pill {
    background: #1e1c2e;
    border: 1px solid #2a2740;
    color: #7c6af7;
    font-size: 12px;
    font-family: 'DM Mono', monospace;
    padding: 1px 10px;
    border-radius: 20px;
  }
  .saved-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: #13121c;
    border: 1px solid #2a2740;
    border-radius: 10px;
    margin-bottom: 7px;
    transition: border-color 0.15s;
  }
  .saved-row:hover { border-color: #3a3650; }
  .saved-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #2a2740;
    flex-shrink: 0;
  }
  .saved-info { flex: 1; min-width: 0; }
  .saved-name { font-size: 13px; font-weight: 500; color: #e8e6f0; }
  .saved-email {
    font-size: 11px;
    color: #5a566e;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: 'DM Mono', monospace;
  }
  .saved-remove {
    background: none;
    border: none;
    color: #3a3650;
    cursor: pointer;
    font-size: 15px;
    padding: 3px;
    border-radius: 4px;
    transition: color 0.15s;
  }
  .saved-remove:hover { color: #e0506e; }

  /* Empty state */
  .empty {
    text-align: center;
    padding: 3rem 1rem;
    color: #3a3650;
    font-size: 14px;
  }
  .empty-icon { font-size: 32px; margin-bottom: 10px; }

  /* Toast */
  .toast-wrap {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 999;
  }
  @keyframes toastIn {
    from { transform: translateX(40px); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }
  .toast {
    background: #f0eeff;
    color: #13121c;
    padding: 9px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    animation: toastIn 0.2s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
`;

// ─── Toast hook ────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  }, []);
  return { toasts, show };
}

// ─── SkeletonCard ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="sk sk-circle" />
      <div className="sk sk-line" />
      <div className="sk sk-line-sm" />
      <div className="sk sk-line" />
    </div>
  );
}

// ─── UserCard ─────────────────────────────────────────────────────────────
function UserCard({ user, isSaved, onSave, onRemove, animDelay }) {
  return (
    <div className="user-card" style={{ animationDelay: `${animDelay}ms` }}>
      <button className="remove-btn" onClick={onRemove} title="Remove">✕</button>
      <img className="avatar" src={user.picture.medium} alt={user.name.first} />
      <div>
        <div className="user-name">{user.name.first} {user.name.last}</div>
        <span className="badge">{user.gender}</span>
      </div>
      <div className="user-email">✉ {user.email}</div>
      <div className="user-location">📍 {user.location.city}, {user.location.country}</div>
      <button
        className={`save-btn ${isSaved ? "saved-btn" : ""}`}
        onClick={onSave}
        disabled={isSaved}
      >
        {isSaved ? "✓ Saved" : "＋ Save"}
      </button>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function RandomUserGenerator() {
  const [users, setUsers] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(3);
  const { toasts, show: toast } = useToast();

  const savedEmails = new Set(saved.map((u) => u.email));

  const fetchUsers = async () => {
    const n = Math.min(10, Math.max(1, count || 1));
    setLoading(true);
    setUsers([]);
    try {
      const res = await fetch(`https://randomuser.me/api/?results=${n}`);
      const data = await res.json();
      setUsers(data.results);
    } catch {
      toast("⚠ Network error — try again");
    } finally {
      setLoading(false);
    }
  };

  const saveOne = (user) => {
    if (savedEmails.has(user.email)) {
      toast("Already in saved list");
      return;
    }
    setSaved((s) => [...s, user]);
    toast(`${user.name.first} saved!`);
  };

  const saveAll = () => {
    const newOnes = users.filter((u) => !savedEmails.has(u.email));
    if (newOnes.length === 0) {
      toast("All already saved");
      return;
    }
    setSaved((s) => [...s, ...newOnes]);
    toast(`${newOnes.length} user(s) saved!`);
  };

  const removeGenerated = (email) => {
    setUsers((u) => u.filter((x) => x.email !== email));
  };

  const removeSaved = (email) => {
    setSaved((s) => s.filter((x) => x.email !== email));
  };

  return (
    <>
      <style>{styles}</style>

      <div className="app">
        {/* Header */}
        <div className="header">
          <h1>Random <span>User</span> Generator</h1>
          <p>GOW AI Academy · React Internship · Day 15</p>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="count-wrap">
            <label htmlFor="count">count:</label>
            <input
              id="count"
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>

          <button className="btn btn-primary" onClick={fetchUsers} disabled={loading}>
            {loading
              ? <><span className="spinning">↻</span> Fetching...</>
              : <>↻ Generate users</>
            }
          </button>

          <button
            className="btn btn-secondary"
            onClick={saveAll}
            disabled={users.length === 0 || loading}
          >
            ⬇ Save all
          </button>

          <button
            className="btn btn-danger"
            onClick={() => setUsers([])}
            disabled={users.length === 0}
          >
            ✕ Clear
          </button>
        </div>

        {/* User Grid */}
        {loading ? (
          <div className="grid">
            {Array(count).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : users.length > 0 ? (
          <div className="grid">
            {users.map((u, i) => (
              <UserCard
                key={u.email}
                user={u}
                isSaved={savedEmails.has(u.email)}
                onSave={() => saveOne(u)}
                onRemove={() => removeGenerated(u.email)}
                animDelay={i * 60}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <div className="empty-icon">👤</div>
            Click "Generate users" to fetch random profiles
          </div>
        )}

        {/* Saved List */}
        {saved.length > 0 && (
          <div className="saved-section">
            <div className="saved-header">
              <h3>
                Saved list
                <span className="count-pill">{saved.length}</span>
              </h3>
              <button className="btn btn-danger" onClick={() => setSaved([])}>
                ✕ Clear saved
              </button>
            </div>

            {saved.map((u) => (
              <div className="saved-row" key={u.email}>
                <img className="saved-avatar" src={u.picture.thumbnail} alt={u.name.first} />
                <div className="saved-info">
                  <div className="saved-name">{u.name.first} {u.name.last}</div>
                  <div className="saved-email">{u.email}</div>
                </div>
                <button className="saved-remove" onClick={() => removeSaved(u.email)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toasts */}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>{t.msg}</div>
        ))}
      </div>
    </>
  );
}
