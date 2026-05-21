import { useState, useEffect, useRef, useCallback } from "react";

// ── Constants ──────────────────────────────────────────────────────────────
const POSTER_GRADIENTS = [
  "linear-gradient(135deg,#1a0533,#4a1060)",
  "linear-gradient(135deg,#0a1628,#1e3a5f)",
  "linear-gradient(135deg,#1a0a00,#5c2d00)",
  "linear-gradient(135deg,#001a0a,#003d1a)",
  "linear-gradient(135deg,#1a001a,#4a0030)",
  "linear-gradient(135deg,#0d0d1a,#1a1a4a)",
  "linear-gradient(135deg,#1a0505,#4a0f0f)",
  "linear-gradient(135deg,#050d1a,#0f2040)",
];

// ── API Call ───────────────────────────────────────────────────────────────
async function fetchMovies(query) {
  const prompt = `Search results for movies matching: "${query}"
Return ONLY valid JSON, no markdown, no backticks:
{"movies":[{"id":1,"title":"Movie Title","year":2022,"genre":"Drama, Thriller","rating":"8.2","runtime":"132 min","director":"Director Name","cast":["Actor 1","Actor 2","Actor 3","Actor 4"],"plot":"2-3 sentence compelling synopsis.","emoji":"🎭","awards":"Won 3 Academy Awards including Best Picture","language":"English","country":"USA"}]}
Return 8 movies relevant to the query. Emojis should reflect tone/genre.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const raw = (data.content || []).find(b => b.type === "text")?.text || "{}";
  const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
  return parsed.movies || [];
}

// ── MovieCard ──────────────────────────────────────────────────────────────
function MovieCard({ movie, index, isFav, onFavToggle, onOpen }) {
  const grad = POSTER_GRADIENTS[index % POSTER_GRADIENTS.length];
  return (
    <div
      onClick={() => onOpen(movie)}
      style={{
        background: "#13131F", border: "1px solid #1E1E2E", borderRadius: 14,
        overflow: "hidden", cursor: "pointer", transition: "all .25s",
        animation: `fadeUp .4s ease both`, animationDelay: `${index * 55}ms`,
      }}
    >
      <div style={{ height: 220, background: grad, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: 52, filter: "drop-shadow(0 4px 12px rgba(0,0,0,.4))" }}>{movie.emoji}</span>
        <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.7)", color: "#F5C842", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
          ⭐ {movie.rating}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onFavToggle(movie); }}
          style={{ position: "absolute", top: 10, left: 10, background: isFav ? "rgba(224,82,82,.25)" : "rgba(0,0,0,.6)", border: `1px solid ${isFav ? "#E05252" : "#1E1E2E"}`, borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}
        >
          {isFav ? "♥" : "♡"}
        </button>
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.35 }}>{movie.title}</div>
        <div style={{ fontSize: 11, color: "#6B6B80" }}>{movie.year} · {movie.runtime}</div>
        <span style={{ display: "inline-block", background: "#1A1A2A", border: "1px solid #1E1E2E", fontSize: 10, padding: "2px 7px", borderRadius: 99, color: "#6B6B80", marginTop: 7 }}>
          {movie.genre.split(",")[0]}
        </span>
      </div>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
function MovieModal({ movie, index, isFav, onFavToggle, onClose }) {
  const grad = POSTER_GRADIENTS[index % POSTER_GRADIENTS.length];
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div style={{ background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 20, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ height: 200, background: grad, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "20px 20px 0 0", position: "relative" }}>
          <span style={{ fontSize: 72, filter: "drop-shadow(0 8px 20px rgba(0,0,0,.5))" }}>{movie.emoji}</span>
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,.6)", border: "1px solid #1E1E2E", color: "#6B6B80", fontSize: 16, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <button onClick={() => onFavToggle(movie)} style={{ position: "absolute", top: 14, left: 14, background: isFav ? "rgba(224,82,82,.2)" : "rgba(0,0,0,.6)", border: `1px solid ${isFav ? "#E05252" : "#1E1E2E"}`, color: isFav ? "#E05252" : "#6B6B80", fontSize: 16, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isFav ? "♥" : "♡"}
          </button>
        </div>
        <div style={{ padding: "22px 24px 28px" }}>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 24, fontWeight: 900, marginBottom: 10, lineHeight: 1.2 }}>{movie.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {[movie.year, `⭐ ${movie.rating}`, movie.runtime, movie.language].map(b => (
              <span key={b} style={{ background: "#1A1A2A", border: "1px solid #1E1E2E", fontSize: 11, padding: "3px 10px", borderRadius: 99, color: b.includes("⭐") ? "#F5C842" : "#E8E8F0" }}>{b}</span>
            ))}
          </div>
          <p style={{ fontSize: 14, color: "#B0B0C0", lineHeight: 1.7, marginBottom: 18 }}>{movie.plot}</p>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6B6B80", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>Director</div>
            <div style={{ fontSize: 14, color: "#F5C842", fontWeight: 600 }}>🎬 {movie.director}</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6B6B80", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Cast</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {movie.cast.map(c => <span key={c} style={{ background: "#13131F", border: "1px solid #1E1E2E", fontSize: 11, padding: "4px 10px", borderRadius: 8, color: "#E8E8F0" }}>👤 {c}</span>)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6B6B80", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>Awards</div>
            <div style={{ fontSize: 13, color: "#B0B0C0", fontStyle: "italic" }}>🏆 {movie.awards}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function MovieSearchApp() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [showFavPanel, setShowFavPanel] = useState(false);
  const debounceRef = useRef(null);

  const handleSearch = useCallback(async (q) => {
    if (!q.trim()) { setMovies([]); return; }
    setLoading(true);
    setError(null);
    try {
      const results = await fetchMovies(q);
      setMovies(results);
    } catch {
      setError("Failed to fetch movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onInput = (val) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setMovies([]); return; }
    debounceRef.current = setTimeout(() => handleSearch(val), 500); // ← debounce
  };

  const toggleFav = (movie) => {
    setFavorites(prev => {
      const copy = { ...prev };
      if (copy[movie.id]) delete copy[movie.id];
      else copy[movie.id] = movie;
      return copy;
    });
  };

  const favList = Object.values(favorites);

  return (
    <div style={{ background: "#080810", color: "#E8E8F0", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <header style={{ padding: "24px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 28, fontWeight: 900, color: "#F5C842" }}>🎬 CineSearch</div>
            <div style={{ fontSize: 11, color: "#6B6B80", letterSpacing: "2px", textTransform: "uppercase" }}>Day 14 · Movie Search App</div>
          </div>
          <button onClick={() => setShowFavPanel(v => !v)} style={{ display: "flex", alignItems: "center", gap: 7, background: "#1A1A2A", border: "1px solid #1E1E2E", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#E8E8F0" }}>
            ♥ Watchlist {favList.length > 0 && <span style={{ background: "#E05252", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 99 }}>{favList.length}</span>}
          </button>
        </div>
        <div style={{ maxWidth: 560, margin: "0 auto 24px", position: "relative" }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#6B6B80" }}>🔍</span>
          <input
            value={query}
            onChange={e => onInput(e.target.value)}
            placeholder="Search movies, directors, actors…"
            style={{ width: "100%", background: "#1A1A2A", border: "1.5px solid #1E1E2E", borderRadius: 14, padding: "13px 14px 13px 44px", fontSize: 15, color: "#E8E8F0", outline: "none", fontFamily: "inherit" }}
          />
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 48px" }}>
        {!query && !loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🎞️</div>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontStyle: "italic", color: "#6B6B80" }}>Your personal cinema awaits</div>
            <p style={{ fontSize: 13, color: "#6B6B80", marginTop: 8, opacity: .7 }}>Search any movie title, actor, or director</p>
          </div>
        )}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              {[0,1,2,3,4].map(i => <div key={i} style={{ width: 14, height: 24, border: "2px solid #F5C842", borderRadius: 2, animation: `fadeUp .7s ease-in-out ${i*0.15}s infinite alternate` }} />)}
            </div>
            <p style={{ color: "#6B6B80", fontSize: 13 }}>Searching for "<strong style={{ color: "#F5C842" }}>{query}</strong>"…</p>
          </div>
        )}
        {error && (
          <div style={{ background: "#1A0A0A", border: "1px solid #4A1A1A", borderRadius: 12, padding: 22, textAlign: "center" }}>
            <p style={{ color: "#E05252", fontSize: 13, marginBottom: 12 }}>⚠️ {error}</p>
            <button onClick={() => handleSearch(query)} style={{ background: "#E05252", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Retry</button>
          </div>
        )}
        {!loading && movies.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 15, fontStyle: "italic", color: "#6B6B80" }}>{movies.length} results for "{query}"</span>
              <span style={{ fontSize: 11, color: "#6B6B80" }}>Debounced · 500ms</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 16 }}>
              {movies.map((m, i) => (
                <MovieCard key={m.id} movie={m} index={i} isFav={!!favorites[m.id]} onFavToggle={toggleFav} onOpen={setSelected} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Favorites Panel */}
      {showFavPanel && (
        <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 290, background: "#0E0E1A", borderLeft: "1px solid #1E1E2E", zIndex: 90, padding: 22, overflowY: "auto" }}>
          <button onClick={() => setShowFavPanel(false)} style={{ background: "#1A1A2A", border: "1px solid #1E1E2E", color: "#6B6B80", fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 8, cursor: "pointer", marginBottom: 16, fontFamily: "inherit" }}>← Close</button>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 700, fontStyle: "italic", color: "#F5C842", marginBottom: 16 }}>♥ My Watchlist</div>
          {favList.length === 0
            ? <div style={{ textAlign: "center", padding: "40px 0", color: "#6B6B80", fontSize: 13, fontStyle: "italic" }}>No favorites yet.<br />Heart a movie to save it.</div>
            : favList.map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: "#13131F", border: "1px solid #1E1E2E", borderRadius: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{m.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: "#6B6B80" }}>{m.year} · ⭐ {m.rating}</div>
                </div>
                <button onClick={() => toggleFav(m)} style={{ background: "none", border: "none", color: "#6B6B80", cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
            ))
          }
        </div>
      )}

      {/* Modal */}
      {selected && (
        <MovieModal
          movie={selected}
          index={movies.findIndex(m => m.id === selected.id)}
          isFav={!!favorites[selected.id]}
          onFavToggle={toggleFav}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
