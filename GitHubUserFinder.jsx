import { useState } from "react";

const langColors = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  Java: "#b07219", "C++": "#f34b7d", C: "#555555", "C#": "#178600",
  Go: "#00ADD8", Rust: "#dea584", Ruby: "#701516", PHP: "#4F5D95",
  Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", HTML: "#e34c26",
  CSS: "#563d7c", Shell: "#89e051", Vue: "#41b883", Svelte: "#ff3e00",
};

function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n;
}

// ── Sub-components ──────────────────────────────────────────

function StatBox({ label, value }) {
  return (
    <div style={styles.statBox}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{fmtNum(value)}</div>
    </div>
  );
}

function RepoItem({ repo, index }) {
  const lang = repo.language || "";
  const color = langColors[lang] || "#8b949e";
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      style={styles.repoItem}
      onMouseEnter={e => (e.currentTarget.style.background = "#21262d")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <span style={styles.repoName}>{repo.name}</span>
      <span style={styles.repoMeta}>
        {lang && (
          <span style={styles.repoLang}>
            <span style={{ ...styles.langDot, background: color }} />
            {lang}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span style={styles.metaChip}>⭐ {repo.stargazers_count}</span>
        )}
        {repo.forks_count > 0 && (
          <span style={styles.metaChip}>🍴 {repo.forks_count}</span>
        )}
      </span>
    </a>
  );
}

function ProfileCard({ user }) {
  return (
    <div style={styles.profileCard}>
      <div style={styles.profileTop}>
        <img src={user.avatar_url} alt={user.login} style={styles.avatar} />
        <div style={styles.profileInfo}>
          <div style={styles.profileName}>{user.name || user.login}</div>
          <div style={styles.profileLogin}>@{user.login}</div>
          {user.bio && <p style={styles.profileBio}>{user.bio}</p>}
          <div style={styles.profileMeta}>
            {user.company && (
              <span style={styles.metaItem}>🏢 {user.company}</span>
            )}
            {user.location && (
              <span style={styles.metaItem}>📍 {user.location}</span>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith("http") ? user.blog : "https://" + user.blog}
                target="_blank"
                rel="noreferrer"
                style={styles.metaLink}
              >
                🔗 {user.blog}
              </a>
            )}
            {user.twitter_username && (
              <a
                href={`https://twitter.com/${user.twitter_username}`}
                target="_blank"
                rel="noreferrer"
                style={styles.metaLink}
              >
                🐦 @{user.twitter_username}
              </a>
            )}
          </div>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatBox label="Public Repos" value={user.public_repos} />
        <StatBox label="Followers" value={user.followers} />
        <StatBox label="Following" value={user.following} />
      </div>
    </div>
  );
}

function RepoList({ repos }) {
  const [visible, setVisible] = useState(6);
  if (!repos.length) return null;

  const remaining = repos.length - visible;

  return (
    <div style={styles.reposCard}>
      <div style={styles.reposHeader}>
        📁 Repositories ({repos.length})
      </div>
      {repos.slice(0, visible).map((repo, i) => (
        <RepoItem key={repo.id} repo={repo} index={i} />
      ))}
      {remaining > 0 && (
        <button
          style={styles.showMoreBtn}
          onClick={() => setVisible(v => v + 6)}
          onMouseEnter={e => (e.currentTarget.style.background = "#21262d")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          Show {Math.min(6, remaining)} more · {remaining} remaining
        </button>
      )}
    </div>
  );
}

function ErrorBox({ title, detail }) {
  return (
    <div style={styles.errorBox}>
      <span style={{ fontSize: 22 }}>❌</span>
      <div>
        <div style={styles.errorTitle}>{title}</div>
        {detail && <div style={styles.errorMono}>{detail}</div>}
      </div>
    </div>
  );
}

function Spinner() {
  return <div style={styles.spinner} />;
}

// ── Main App ────────────────────────────────────────────────

export default function GitHubUserFinder() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null); // { title, detail }

  const handleSearch = async () => {
    const query = username.trim();
    if (!query) return;

    setLoading(true);
    setUser(null);
    setRepos([]);
    setError(null);

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(query)}`),
        fetch(`https://api.github.com/users/${encodeURIComponent(query)}/repos?per_page=100&sort=stars`),
      ]);

      if (userRes.status === 404) {
        setError({ title: "User not found", detail: `GET /users/${query} → 404 Not Found` });
        setLoading(false);
        return;
      }

      if (userRes.status === 403) {
        setError({ title: "Rate limit reached", detail: "GitHub API limit hit. Try again in a minute." });
        setLoading(false);
        return;
      }

      if (!userRes.ok) throw new Error(`HTTP ${userRes.status}`);

      const userData = await userRes.json();
      const reposData = reposRes.ok ? await reposRes.json() : [];

      setUser(userData);
      setRepos(reposData);
    } catch (err) {
      setError({ title: "Network error", detail: err.message });
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.ghLogo}>
            <svg viewBox="0 0 24 24" width={24} height={24} fill="#0d1117">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </div>
          <div>
            <div style={styles.title}>GitHub UserFinder</div>
            <div style={styles.subtitle}>// Day 12 · GOW AI Academy · React.js Internship</div>
          </div>
        </div>

        {/* Search */}
        <div style={styles.searchRow}>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter GitHub username..."
            style={styles.input}
            disabled={loading}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !username.trim()}
            style={{
              ...styles.searchBtn,
              opacity: loading || !username.trim() ? 0.5 : 1,
              cursor: loading || !username.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Fetching…" : "🔍 Search"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={styles.loadingRow}>
            <Spinner />
            Fetching <strong style={{ color: "#e6edf3" }}>@{username.trim()}</strong>…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <ErrorBox title={error.title} detail={error.detail} />
        )}

        {/* Profile */}
        {!loading && user && (
          <>
            <ProfileCard user={user} />
            <RepoList repos={repos} />
          </>
        )}

        {/* Empty state */}
        {!loading && !user && !error && (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>👤</div>
            Search for any GitHub username
            <br />
            to view their profile &amp; repositories
          </div>
        )}

      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0d1117",
    color: "#e6edf3",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2.5rem 1rem 4rem",
  },
  container: {
    width: "100%",
    maxWidth: 680,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: "2rem",
  },
  ghLogo: {
    width: 40, height: 40,
    background: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 12,
    color: "#8b949e",
    fontFamily: "monospace",
    marginTop: 2,
  },
  searchRow: {
    display: "flex",
    gap: 8,
    marginBottom: "1.5rem",
  },
  input: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: 14,
    padding: "0 14px",
    height: 44,
    border: "1px solid #30363d",
    borderRadius: 8,
    background: "#161b22",
    color: "#e6edf3",
    outline: "none",
  },
  searchBtn: {
    height: 44,
    padding: "0 20px",
    background: "#58a6ff",
    color: "#0d1117",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    transition: "opacity 0.15s",
    whiteSpace: "nowrap",
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#8b949e",
    fontSize: 13,
    fontFamily: "monospace",
    padding: "1.5rem 0",
  },
  spinner: {
    width: 18, height: 18,
    border: "2px solid #30363d",
    borderTopColor: "#58a6ff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    flexShrink: 0,
  },
  profileCard: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: 12,
    padding: "1.4rem",
    marginBottom: "1rem",
  },
  profileTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: "1.2rem",
  },
  avatar: {
    width: 72, height: 72,
    borderRadius: "50%",
    border: "2px solid #484f58",
    flexShrink: 0,
  },
  profileInfo: { flex: 1, minWidth: 0 },
  profileName: {
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: "-0.4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  profileLogin: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#8b949e",
    marginTop: 2,
  },
  profileBio: {
    fontSize: 13,
    color: "#8b949e",
    marginTop: 6,
    lineHeight: 1.5,
  },
  profileMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  metaItem: {
    fontSize: 12,
    color: "#8b949e",
    fontFamily: "monospace",
  },
  metaLink: {
    fontSize: 12,
    color: "#58a6ff",
    fontFamily: "monospace",
    textDecoration: "none",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
  },
  statBox: {
    background: "#21262d",
    border: "1px solid #30363d",
    borderRadius: 8,
    padding: 12,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#8b949e",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontFamily: "monospace",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.5px",
    color: "#e6edf3",
  },
  reposCard: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: 12,
    overflow: "hidden",
  },
  reposHeader: {
    padding: "12px 16px",
    borderBottom: "1px solid #30363d",
    fontSize: 12,
    fontWeight: 600,
    color: "#8b949e",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  repoItem: {
    padding: "12px 16px",
    borderBottom: "1px solid #30363d",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    textDecoration: "none",
    transition: "background 0.1s",
    cursor: "pointer",
  },
  repoName: {
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: 500,
    color: "#58a6ff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
  },
  repoMeta: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
    fontFamily: "monospace",
    fontSize: 12,
    color: "#8b949e",
  },
  repoLang: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  langDot: {
    width: 10, height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  metaChip: {
    display: "flex",
    alignItems: "center",
    gap: 3,
  },
  showMoreBtn: {
    width: "100%",
    padding: 12,
    background: "transparent",
    border: "none",
    borderTop: "1px solid #30363d",
    fontFamily: "monospace",
    fontSize: 12,
    color: "#8b949e",
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
  },
  errorBox: {
    background: "#1c1011",
    border: "1px solid #6e2121",
    borderRadius: 8,
    padding: 16,
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#f85149",
  },
  errorMono: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#9d4343",
    marginTop: 4,
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 1rem",
    color: "#484f58",
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 2,
  },
};
