import { useState } from "react";

// ─── Inline SVG Icons ──────────────────────────────────────────────────────
const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────────────────
const menuItems = ["Dashboard", "Users", "Analytics", "Reports", "Settings"];

const users = [
  { id: 1, name: "Naveen", role: "Frontend Developer", status: "Active" },
  { id: 2, name: "Rahul",  role: "Backend Developer",  status: "Pending" },
  { id: 3, name: "Priya",  role: "UI Designer",         status: "Active" },
  { id: 4, name: "Aman",   role: "React Intern",         status: "Inactive" },
];

const statusColors = {
  Active:   { background: "#16a34a", color: "white" },
  Pending:  { background: "#d97706", color: "white" },
  Inactive: { background: "#dc2626", color: "white" },
};

// ─── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({ active, setActive }) {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>AdminPanel</h2>
      <ul style={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item}
            style={{
              ...styles.menuItem,
              background: active === item ? "#334155" : "transparent",
            }}
            onClick={() => setActive(item)}
            onMouseEnter={(e) => {
              if (active !== item) e.currentTarget.style.background = "#2d3f55";
            }}
            onMouseLeave={(e) => {
              if (active !== item) e.currentTarget.style.background = "transparent";
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar({ search, setSearch }) {
  return (
    <div style={styles.navbar}>
      <div style={styles.searchBox}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      <div style={styles.navIcons}>
        <span style={styles.bellWrap}><BellIcon /></span>
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          style={styles.avatar}
        />
      </div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function Card({ title, value, icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 20px rgba(0,0,0,0.12)"
          : "0 2px 8px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardIcon}>{icon}</div>
      <div>
        <h3 style={styles.cardLabel}>{title}</h3>
        <p style={styles.cardValue}>{value}</p>
      </div>
    </div>
  );
}

// ─── Table ─────────────────────────────────────────────────────────────────
function Table({ filter }) {
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filter.toLowerCase()) ||
      u.role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={styles.tableContainer}>
      <h2 style={styles.tableTitle}>User Details</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            {["ID", "Name", "Role", "Status"].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ ...styles.td, textAlign: "center", color: "#888" }}>
                No users found.
              </td>
            </tr>
          ) : (
            filtered.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.role}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...statusColors[user.status] }}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [search, setSearch] = useState("");

  return (
    <div style={styles.app}>
      <Sidebar active={activeMenu} setActive={setActiveMenu} />

      <div style={styles.main}>
        <Navbar search={search} setSearch={setSearch} />

        <div style={styles.dashboard}>
          <h1 style={styles.pageTitle}>Admin Dashboard</h1>

          <div style={styles.cards}>
            <Card title="Total Users"  value="1,240" icon={<UsersIcon />} />
            <Card title="Reports"      value="320"   icon={<ClipboardIcon />} />
            <Card title="Analytics"    value="89%"   icon={<ChartIcon />} />
          </div>

          <Table filter={search} />
        </div>
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f6f9",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  sidebar: {
    width: "240px",
    background: "#1e293b",
    color: "white",
    padding: "20px",
    flexShrink: 0,
  },
  logo: {
    textAlign: "center",
    marginBottom: "40px",
    fontSize: "20px",
    fontWeight: "700",
    color: "white",
  },
  menu: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  menuItem: {
    padding: "14px 15px",
    marginBottom: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.2s",
    fontSize: "15px",
    color: "white",
  },
  main: {
    flex: 1,
    padding: "20px",
    overflowX: "hidden",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "12px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "white",
    padding: "10px 15px",
    borderRadius: "8px",
    width: "300px",
    gap: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    background: "transparent",
  },
  navIcons: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    color: "#1e293b",
  },
  bellWrap: {
    cursor: "pointer",
    color: "#1e293b",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    cursor: "pointer",
  },
  dashboard: {},
  pageTitle: {
    marginBottom: "20px",
    color: "#1e293b",
    fontSize: "22px",
    fontWeight: "600",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  cardIcon: {
    color: "#2563eb",
    flexShrink: 0,
  },
  cardLabel: {
    fontSize: "15px",
    color: "#555",
    fontWeight: "500",
  },
  cardValue: {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "4px",
    color: "#1e293b",
  },
  tableContainer: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflowX: "auto",
  },
  tableTitle: {
    marginBottom: "20px",
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "600",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "14px 15px",
    textAlign: "left",
    background: "#f1f5f9",
    color: "#374151",
    fontWeight: "600",
    fontSize: "14px",
    borderBottom: "1px solid #ddd",
  },
  tr: {},
  td: {
    padding: "14px 15px",
    textAlign: "left",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "14px",
    color: "#374151",
  },
  badge: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
    display: "inline-block",
  },
};
