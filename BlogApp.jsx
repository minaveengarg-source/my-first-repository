import { useState } from "react";

const initialPosts = [
  {
    id: 1,
    title: "Getting Started with React",
    category: "React",
    content:
      "React is a JavaScript library used for building user interfaces. It helps create reusable UI components and makes frontend development easier.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80",
  },
  {
    id: 2,
    title: "Understanding React Router",
    category: "Routing",
    content:
      "React Router is used for navigation in React applications. It allows you to create multiple pages without refreshing the browser.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  },
  {
    id: 3,
    title: "JavaScript ES6 Features",
    category: "JavaScript",
    content:
      "ES6 introduced features like arrow functions, destructuring, spread operators, classes, and template literals.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
  },
];

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar({ setPage }) {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.navBrand}>📝 Blog App</h2>
      <div style={styles.navLinks}>
        <button style={styles.navBtn} onClick={() => setPage({ name: "home" })}>
          Home
        </button>
        <button style={styles.navBtn} onClick={() => setPage({ name: "create" })}>
          Create Post
        </button>
      </div>
    </nav>
  );
}

// ─── Home ──────────────────────────────────────────────────────────────────
function Home({ posts, setPage }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(posts.map((p) => p.category))];

  const filtered = posts.filter((post) => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || post.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div style={styles.home}>
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.filterInput}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.filterInput}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "#64748b" }}>No posts found.</p>
      ) : (
        <div style={styles.blogGrid}>
          {filtered.map((post) => (
            <div key={post.id} style={styles.blogCard}>
              <img
                src={post.image}
                alt={post.title}
                style={styles.cardImage}
                onError={(e) => {
                  e.target.style.background = "#e2e8f0";
                  e.target.removeAttribute("src");
                }}
              />
              <div style={styles.blogContent}>
                <span style={styles.catBadge}>{post.category}</span>
                <h3 style={styles.cardTitle}>{post.title}</h3>
                <p style={styles.cardExcerpt}>{post.content.substring(0, 90)}...</p>
                <button
                  style={styles.readBtn}
                  onClick={() => setPage({ name: "post", id: post.id })}
                  onMouseEnter={(e) => (e.target.style.background = "#2563eb")}
                  onMouseLeave={(e) => (e.target.style.background = "#1e293b")}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Blog Details ──────────────────────────────────────────────────────────
function BlogDetails({ posts, postId, setPage }) {
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div>
        <h2 style={{ color: "#1e293b" }}>Post Not Found</h2>
        <button style={styles.backBtn} onClick={() => setPage({ name: "home" })}>
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={styles.detailsPage}>
      <img
        src={post.image}
        alt={post.title}
        style={styles.detailsImage}
        onError={(e) => {
          e.target.style.background = "#e2e8f0";
          e.target.removeAttribute("src");
        }}
      />
      <div style={styles.detailsContent}>
        <span style={styles.catBadge}>{post.category}</span>
        <h1 style={styles.detailsTitle}>{post.title}</h1>
        <p style={styles.detailsText}>{post.content}</p>
        <button
          style={styles.backBtn}
          onClick={() => setPage({ name: "home" })}
          onMouseEnter={(e) => (e.target.style.background = "#2563eb")}
          onMouseLeave={(e) => (e.target.style.background = "#1e293b")}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

// ─── Create Post ───────────────────────────────────────────────────────────
function CreatePost({ posts, setPosts, setPage }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !category.trim() || !content.trim()) return;

    const newPost = {
      id: Math.max(...posts.map((p) => p.id)) + 1,
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
      image:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80",
    };

    setPosts([newPost, ...posts]);
    setTitle("");
    setCategory("");
    setContent("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div style={styles.createPage}>
      <form onSubmit={handleSubmit} style={styles.createForm}>
        <h2 style={styles.formTitle}>Create New Post</h2>

        {success && (
          <div style={styles.successMsg}>✅ Post created successfully!</div>
        )}

        <input
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.formInput}
          required
        />
        <input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.formInput}
          required
        />
        <textarea
          placeholder="Write your content..."
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ ...styles.formInput, resize: "vertical" }}
          required
        />
        <button
          type="submit"
          style={styles.submitBtn}
          onMouseEnter={(e) => (e.target.style.background = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.background = "#2563eb")}
        >
          Create Post
        </button>
      </form>
    </div>
  );
}

// ─── App (Root) ────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState({ name: "home" });
  const [posts, setPosts] = useState(initialPosts);

  return (
    <div style={styles.appWrapper}>
      <Navbar setPage={setPage} />
      <div style={styles.container}>
        {page.name === "home" && (
          <Home posts={posts} setPage={setPage} />
        )}
        {page.name === "post" && (
          <BlogDetails posts={posts} postId={page.id} setPage={setPage} />
        )}
        {page.name === "create" && (
          <CreatePost posts={posts} setPosts={setPosts} setPage={setPage} />
        )}
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  appWrapper: {
    fontFamily: "Arial, sans-serif",
    background: "#f4f6f9",
    minHeight: "100vh",
  },
  navbar: {
    background: "#1e293b",
    color: "white",
    padding: "18px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBrand: {
    color: "white",
    fontSize: "18px",
    fontWeight: "600",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
  },
  navBtn: {
    background: "none",
    border: "none",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  container: {
    padding: "30px",
  },
  home: {},
  filters: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  filterInput: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    minWidth: "250px",
    outline: "none",
    fontSize: "14px",
  },
  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
  },
  blogCard: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.3s",
  },
  cardImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  blogContent: {
    padding: "20px",
  },
  catBadge: {
    background: "#2563eb",
    color: "white",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  cardTitle: {
    margin: "15px 0 8px",
    color: "#1e293b",
    fontSize: "16px",
  },
  cardExcerpt: {
    color: "#555",
    marginBottom: "20px",
    fontSize: "14px",
  },
  readBtn: {
    display: "inline-block",
    background: "#1e293b",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.3s",
  },
  detailsPage: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "900px",
    margin: "auto",
  },
  detailsImage: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
  },
  detailsContent: {
    padding: "30px",
  },
  detailsTitle: {
    margin: "20px 0",
    color: "#1e293b",
    fontSize: "24px",
    fontWeight: "600",
  },
  detailsText: {
    color: "#444",
    lineHeight: "1.7",
    marginBottom: "25px",
  },
  backBtn: {
    background: "#1e293b",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.3s",
  },
  createPage: {
    display: "flex",
    justifyContent: "center",
  },
  createForm: {
    background: "white",
    padding: "30px",
    width: "100%",
    maxWidth: "600px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  formTitle: {
    marginBottom: "20px",
    textAlign: "center",
    color: "#1e293b",
    fontSize: "18px",
  },
  formInput: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    display: "block",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    border: "none",
    background: "#2563eb",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s",
  },
  successMsg: {
    background: "#dbeafe",
    color: "#1e40af",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
    textAlign: "center",
  },
};
