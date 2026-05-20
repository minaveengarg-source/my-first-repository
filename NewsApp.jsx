import { useState, useEffect, useCallback } from "react";

const CATEGORIES = ["All", "Technology", "Business", "Science", "Health", "Sports", "Entertainment"];
const PER_PAGE = 6;

const CATEGORY_META = {
  Technology: { color: "#3B82F6", bg: "#EFF6FF", icon: "💻" },
  Business:   { color: "#F59E0B", bg: "#FFFBEB", icon: "📈" },
  Science:    { color: "#8B5CF6", bg: "#F5F3FF", icon: "🔬" },
  Health:     { color: "#10B981", bg: "#ECFDF5", icon: "🏥" },
  Sports:     { color: "#EF4444", bg: "#FEF2F2", icon: "⚽" },
  Entertainment: { color: "#EC4899", bg: "#FDF2F8", icon: "🎬" },
};

const PLACEHOLDER_IMG = (cat) => {
  const meta = CATEGORY_META[cat] || { color: "#6B7280", bg: "#F9FAFB" };
  const icon = CATEGORY_META[cat]?.icon || "📰";
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'><rect width='400' height='200' fill='${encodeURIComponent(meta.bg)}'/><text x='200' y='110' text-anchor='middle' font-size='48'>${encodeURIComponent(icon)}</text></svg>`;
};

async function fetchNewsFromClaude(category) {
  const cats = category === "All"
    ? ["Technology", "Business", "Science", "Health", "Sports", "Entertainment"]
    : [category];

  const prompt = `Generate exactly 12 realistic, diverse news article summaries for today (${new Date().toDateString()}).
Categories to cover: ${cats.join(", ")}.
Distribute evenly if multiple categories.

Return ONLY valid JSON (no markdown, no backticks):
{
  "articles": [
    {
      "id": 1,
      "title": "Article headline here",
      "description": "2-3 sentence summary of the news story with specific details, numbers, and context.",
      "category": "Technology",
      "source": "Reuters",
      "publishedAt": "2 hours ago",
      "url": "https://example.com/news/article-slug",
      "readTime": "3 min read"
    }
  ]
}

Make articles feel like real breaking news with specific names, places, numbers. Sources: Reuters, BBC, CNN, AP, Bloomberg, TechCrunch, ESPN, NYT, WSJ, Forbes.`;

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
  const raw = data.content?.find(b => b.type === "text")?.text || "{}";
  const clean = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  return parsed.articles || [];
}

function ArticleCard({ article, index }) {
  const meta = CATEGORY_META[article.category] || { color: "#6B7280", bg: "#F9FAFB" };
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid #E5E7EB",
      display: "flex",
      flexDirection: "column",
      animation: `fadeUp 0.4s ease both`,
      animationDelay: `${index * 60}ms`,
    }}>
      {/* Image placeholder */}
      <div style={{
        height: 140,
        background: `linear-gradient(135deg, ${meta.bg} 0%, ${meta.color}22 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
        position: "relative",
        flexShrink: 0,
      }}>
        <span style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>
          {meta.icon}
        </span>
        <span style={{
          position: "absolute", top: 10, left: 12,
          background: meta.color, color: "#fff",
          fontSize: 10, fontWeight: 700, padding: "3px 8px",
          borderRadius: 99, letterSpacing: 0.5, textTransform: "uppercase",
        }}>
          {article.category}
        </span>
        <span style={{
          position: "absolute", top: 10, right: 12,
          background: "rgba(0,0,0,0.35)", color: "#fff",
          fontSize: 10, padding: "3px 7px", borderRadius: 6,
        }}>
          {article.readTime}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontSize: 15, fontWeight: 700, color: "#111827",
          lineHeight: 1.45, marginBottom: 10,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {article.title}
        </h3>
        <p style={{
          fontSize: 13, color: "#6B7280", lineHeight: 1.6,
          marginBottom: 14, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {article.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: meta.color + "33",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10,
            }}>
              {meta.icon}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF" }}>
              {article.source}
            </span>
            <span style={{ fontSize: 11, color: "#D1D5DB" }}>·</span>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>{article.publishedAt}</span>
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.preventDefault()}
            style={{
              fontSize: 12, fontWeight: 600, color: meta.color,
              textDecoration: "none", display: "flex", alignItems: "center", gap: 3,
              padding: "4px 10px", borderRadius: 6,
              border: `1px solid ${meta.color}44`,
              background: meta.bg,
              transition: "all 0.15s",
            }}
          >
            Read →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function NewsApp() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const loadNews = useCallback(async (cat) => {
    setLoading(true);
    setError(null);
    setPage(1);
    try {
      const data = await fetchNewsFromClaude(cat);
      setArticles(data);
    } catch (e) {
      setError("Failed to load news. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNews("All"); }, [loadNews]);

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
    setSearchQuery("");
    loadNews(cat);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .cat-btn:hover { transform: translateY(-1px); }
        .page-btn:hover { background: #F3F4F6 !important; }
      `}</style>

      {/* ── MASTHEAD ── */}
      <header style={{
        background: "#0F172A",
        padding: "0",
        borderBottom: "3px solid #F59E0B",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <h1 style={{
                  fontSize: 36, fontWeight: 900, color: "#fff",
                  letterSpacing: -1, margin: 0, lineHeight: 1,
                  fontFamily: "'Georgia', serif",
                }}>
                  The <span style={{ color: "#F59E0B" }}>Daily</span> Brief
                </h1>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "#F59E0B",
                  background: "#F59E0B22", border: "1px solid #F59E0B44",
                  padding: "2px 6px", borderRadius: 4, letterSpacing: 1,
                }}>
                  AI POWERED
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: 12, margin: "4px 0 0", letterSpacing: 0.3 }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                {" · "}{articles.length} articles loaded
              </p>
            </div>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#64748B" }}>🔍</span>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                style={{
                  background: "#1E293B", border: "1px solid #334155",
                  borderRadius: 10, color: "#E2E8F0", padding: "9px 12px 9px 36px",
                  fontSize: 13, outline: "none", width: 220,
                  fontFamily: "system-ui, sans-serif",
                }}
              />
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 24px",
          display: "flex", gap: 2, overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {CATEGORIES.map(cat => {
            const active = cat === activeCategory;
            const meta = CATEGORY_META[cat];
            return (
              <button key={cat} className="cat-btn"
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: "10px 16px", border: "none", cursor: "pointer",
                  borderBottom: active ? "3px solid #F59E0B" : "3px solid transparent",
                  background: "transparent",
                  color: active ? "#F59E0B" : "#94A3B8",
                  fontWeight: active ? 700 : 500,
                  fontSize: 13, whiteSpace: "nowrap",
                  transition: "all 0.15s", letterSpacing: 0.2,
                  fontFamily: "system-ui, sans-serif",
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                {meta && <span style={{ fontSize: 13 }}>{meta.icon}</span>}
                {cat}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 48px" }}>

        {/* Stats bar */}
        {!loading && articles.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 20, flexWrap: "wrap", gap: 8,
          }}>
            <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "system-ui, sans-serif", margin: 0 }}>
              Showing <strong style={{ color: "#111827" }}>{filtered.length}</strong> articles
              {searchQuery && <> matching "<strong>{searchQuery}</strong>"</>}
              {activeCategory !== "All" && <> in <strong>{activeCategory}</strong></>}
            </p>
            <button onClick={() => loadNews(activeCategory)} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: 8, padding: "6px 14px", cursor: "pointer",
              fontSize: 12, fontWeight: 600, color: "#374151",
              fontFamily: "system-ui, sans-serif",
            }}>
              🔄 Refresh
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{
              width: 48, height: 48, border: "3px solid #E5E7EB",
              borderTopColor: "#F59E0B", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 20px",
            }} />
            <p style={{ color: "#6B7280", fontSize: 14, fontFamily: "system-ui, sans-serif" }}>
              Fetching latest news with AI…
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA",
            borderRadius: 12, padding: "20px 24px", textAlign: "center",
          }}>
            <p style={{ color: "#DC2626", fontSize: 14, margin: "0 0 12px", fontFamily: "system-ui, sans-serif" }}>
              ⚠️ {error}
            </p>
            <button onClick={() => loadNews(activeCategory)} style={{
              background: "#DC2626", color: "#fff", border: "none",
              borderRadius: 8, padding: "8px 20px", cursor: "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: "system-ui, sans-serif",
            }}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && articles.length > 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ color: "#6B7280", fontSize: 15, fontFamily: "system-ui, sans-serif" }}>
              No articles found for your search.
            </p>
          </div>
        )}

        {/* Article Grid */}
        {!loading && paginated.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
            marginBottom: 32,
          }}>
            {paginated.map((article, i) => (
              <ArticleCard key={article.id || i} article={article} index={i} />
            ))}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && !loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <button className="page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "8px 14px", borderRadius: 8, border: "1px solid #E5E7EB",
                background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.4 : 1, fontSize: 14, fontFamily: "system-ui, sans-serif",
                color: "#374151",
              }}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className="page-btn"
                onClick={() => setPage(p)}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: p === page ? "none" : "1px solid #E5E7EB",
                  background: p === page ? "#0F172A" : "#fff",
                  color: p === page ? "#F59E0B" : "#374151",
                  fontWeight: p === page ? 700 : 500,
                  cursor: "pointer", fontSize: 13,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {p}
              </button>
            ))}

            <button className="page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: "8px 14px", borderRadius: 8, border: "1px solid #E5E7EB",
                background: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.4 : 1, fontSize: 14,
                fontFamily: "system-ui, sans-serif", color: "#374151",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: "#0F172A", padding: "16px 24px", textAlign: "center" }}>
        <p style={{ color: "#475569", fontSize: 12, margin: 0, fontFamily: "system-ui, sans-serif" }}>
          The Daily Brief · Powered by Claude AI · Day 13 — GOW AI Academy React.js Internship
        </p>
      </footer>
    </div>
  );
}
