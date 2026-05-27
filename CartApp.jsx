import { useState, useEffect } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────
const productsData = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 4999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  },
  {
    id: 3,
    name: "Gaming Mouse",
    price: 1499,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80",
  },
  {
    id: 4,
    name: "Laptop",
    price: 55999,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
  },
];

// ─── Inline SVG Icons ──────────────────────────────────────────────────────
const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

// ─── ProductCard ───────────────────────────────────────────────────────────
function ProductCard({ product, addToCart }) {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.productCard,
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 20px rgba(0,0,0,0.15)"
          : "0 2px 10px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={product.image}
        alt={product.name}
        style={styles.productImage}
        onError={(e) => {
          e.target.style.background = "#e2e8f0";
          e.target.removeAttribute("src");
        }}
      />
      <h3 style={styles.productName}>{product.name}</h3>
      <p style={styles.productPrice}>₹ {product.price.toLocaleString("en-IN")}</p>
      <button
        onClick={() => addToCart(product)}
        style={{
          ...styles.addBtn,
          background: btnHovered ? "#1d4ed8" : "#2563eb",
        }}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
      >
        <CartIcon />
        Add to Cart
      </button>
    </div>
  );
}

// ─── Cart ──────────────────────────────────────────────────────────────────
function Cart({ cart, increaseQty, decreaseQty, removeItem, totalPrice }) {
  return (
    <div style={styles.cartSection}>
      <h2 style={styles.sectionTitle}>🛒 Cart Items</h2>

      {cart.length === 0 ? (
        <p style={styles.emptyCart}>Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <img
                src={item.image}
                alt={item.name}
                style={styles.cartImage}
                onError={(e) => {
                  e.target.style.background = "#e2e8f0";
                  e.target.removeAttribute("src");
                }}
              />
              <div style={styles.cartDetails}>
                <h4 style={styles.cartName}>{item.name}</h4>
                <p style={styles.cartPrice}>₹ {item.price.toLocaleString("en-IN")}</p>
                <div style={styles.quantity}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => decreaseQty(item.id)}
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon />
                  </button>
                  <span style={styles.qtyNum}>{item.quantity}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => increaseQty(item.id)}
                    aria-label="Increase quantity"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
              <button
                style={styles.deleteBtn}
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
              >
                <TrashIcon />
              </button>
            </div>
          ))}

          <div style={styles.total}>
            <h3 style={styles.totalPrice}>
              Total: ₹ {totalPrice.toLocaleString("en-IN")}
            </h3>
            <h4 style={styles.totalItems}>Items: {cart.length}</h4>
            <button
              style={styles.checkoutBtn}
              onClick={() => alert("Proceeding to checkout!")}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // localStorage not available in all environments
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQty = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  const decreaseQty = (id) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );

  const removeItem = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>🛍️ E-Commerce Cart System</h1>
      </header>

      <div style={styles.container}>
        <div style={styles.productsSection}>
          <h2 style={styles.sectionTitle}>Products</h2>
          <div style={styles.productsGrid}>
            {productsData.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>

        <Cart
          cart={cart}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          removeItem={removeItem}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: "100vh",
    background: "#f4f6f9",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  header: {
    background: "#1e293b",
    color: "white",
    padding: "20px",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "white",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    padding: "20px",
  },
  productsSection: {},
  sectionTitle: {
    marginBottom: "20px",
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "600",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  productCard: {
    background: "white",
    borderRadius: "12px",
    padding: "15px",
    textAlign: "center",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "default",
  },
  productImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  productName: {
    margin: "15px 0 10px",
    color: "#1e293b",
    fontSize: "15px",
    fontWeight: "600",
  },
  productPrice: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: "15px",
  },
  addBtn: {
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "auto",
    fontSize: "14px",
    transition: "background 0.3s",
  },
  cartSection: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    height: "fit-content",
  },
  emptyCart: {
    textAlign: "center",
    color: "gray",
    marginTop: "30px",
    fontSize: "14px",
  },
  cartItem: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "15px",
  },
  cartImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "10px",
    flexShrink: 0,
  },
  cartDetails: {
    flex: 1,
  },
  cartName: {
    marginBottom: "5px",
    color: "#1e293b",
    fontSize: "14px",
    fontWeight: "600",
  },
  cartPrice: {
    color: "#2563eb",
    fontWeight: "bold",
    marginBottom: "10px",
    fontSize: "14px",
  },
  quantity: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  qtyBtn: {
    background: "#1e293b",
    color: "white",
    border: "none",
    width: "28px",
    height: "28px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyNum: {
    fontSize: "15px",
    fontWeight: "600",
    minWidth: "20px",
    textAlign: "center",
    color: "#1e293b",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  total: {
    marginTop: "20px",
    textAlign: "center",
  },
  totalPrice: {
    color: "#16a34a",
    marginBottom: "8px",
    fontSize: "16px",
  },
  totalItems: {
    color: "#64748b",
    fontWeight: "normal",
    fontSize: "14px",
    marginBottom: "16px",
  },
  checkoutBtn: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    width: "100%",
    transition: "background 0.3s",
  },
};
