import { useState } from "react";

const validate = ({ name, email, password }) => {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required.";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";

  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";

  if (!password) errors.password = "Password is required.";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters.";
  else if (!/[A-Z]/.test(password)) errors.password = "Include at least one uppercase letter.";
  else if (!/[0-9]/.test(password)) errors.password = "Include at least one number.";

  return errors;
};

const strength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#E24B4A", "#EF9F27", "#1D9E75", "#0F6E56"];

export default function ContactFormWithValidation() {
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors  = validate(form);
  const isValid = Object.keys(errors).length === 0;
  const pw_str  = strength(form.password);

  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const touch = (k)    => setTouched(t => ({ ...t, [k]: true }));

  const handleSubmit = () => {
    setTouched({ name: true, email: true, password: true });
    if (isValid) setSubmitted(true);
  };

  if (submitted) return (
    <div style={{
      minHeight: "100vh", background: "#f0faf5",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "1rem",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px",
        boxShadow: "0 4px 24px rgba(15,110,86,0.12)",
        padding: "2.5rem 2rem", textAlign: "center", maxWidth: "380px", width: "100%",
      }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "#E1F5EE", margin: "0 auto 1.2rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.8rem",
        }}>✅</div>
        <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.3rem", fontWeight: 700, color: "#0F6E56" }}>
          Form Submitted!
        </h2>
        <p style={{ margin: "0 0 0.4rem", color: "#555", fontSize: "0.9rem" }}>
          Welcome, <strong>{form.name}</strong>!
        </p>
        <p style={{ margin: "0 0 1.5rem", color: "#888", fontSize: "0.82rem" }}>{form.email}</p>
        <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", password: "" }); setTouched({}); }}
          style={{
            background: "#0F6E56", color: "#fff", border: "none",
            borderRadius: "10px", padding: "10px 24px",
            fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
          }}>
          Submit Another
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4ff 0%, #faf0ff 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "1rem",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: "20px",
          boxShadow: "0 4px 32px rgba(100,80,200,0.10)",
          overflow: "hidden",
        }}>
          {/* Top bar */}
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #2d2250 100%)",
            padding: "1.6rem 1.75rem 1.3rem", color: "#fff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>📋</span>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>Contact Form</h1>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "#a89fd8" }}>
                  Day 7 · Controlled Components & Validation
                </p>
              </div>
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: "6px", marginTop: "1.1rem" }}>
              {["name", "email", "password"].map(k => (
                <div key={k} style={{
                  height: "4px", flex: 1, borderRadius: "99px",
                  background: touched[k] && !errors[k] ? "#5DCAA5" : "rgba(255,255,255,0.2)",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>
          </div>

          {/* Fields */}
          <div style={{ padding: "1.5rem 1.75rem" }}>

            {/* Name */}
            <Field
              label="Full Name" icon="👤" type="text"
              value={form.name} placeholder="e.g. Rahul Sharma"
              onChange={v => set("name", v)}
              onBlur={() => touch("name")}
              error={touched.name && errors.name}
              valid={touched.name && !errors.name}
            />

            {/* Email */}
            <Field
              label="Email Address" icon="📧" type="email"
              value={form.email} placeholder="you@example.com"
              onChange={v => set("email", v)}
              onBlur={() => touch("email")}
              error={touched.email && errors.email}
              valid={touched.email && !errors.email}
            />

            {/* Password */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#444", marginBottom: "5px" }}>
                🔒 Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  onChange={e => set("password", e.target.value)}
                  onBlur={() => touch("password")}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    border: `1.5px solid ${touched.password ? (errors.password ? "#E24B4A" : "#1D9E75") : "#e0ddf0"}`,
                    borderRadius: "10px", padding: "10px 42px 10px 12px",
                    fontSize: "0.9rem", fontFamily: "inherit", outline: "none",
                    background: touched.password && !errors.password ? "#f0faf5" : "#fff",
                    transition: "border 0.2s, background 0.2s",
                  }}
                />
                <button onClick={() => setShowPw(s => !s)} style={{
                  position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: "1rem", padding: 0,
                }}>{showPw ? "🙈" : "👁"}</button>
              </div>

              {/* Strength bar */}
              {form.password && (
                <div style={{ marginTop: "6px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "3px" }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: "3px", borderRadius: "99px",
                        background: i <= pw_str ? strengthColor[pw_str] : "#eee",
                        transition: "background 0.3s",
                      }} />
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: "0.7rem", color: strengthColor[pw_str], fontWeight: 600 }}>
                    {strengthLabel[pw_str]}
                  </p>
                </div>
              )}

              {touched.password && errors.password && (
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#E24B4A" }}>⚠ {errors.password}</p>
              )}
              {touched.password && !errors.password && (
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#1D9E75" }}>✓ Password looks good</p>
              )}
            </div>

            {/* Requirements checklist */}
            {form.password && (
              <div style={{
                background: "#f8f6ff", borderRadius: "10px",
                padding: "0.75rem 1rem", marginBottom: "1.1rem",
              }}>
                {[
                  { ok: form.password.length >= 8,        label: "At least 8 characters" },
                  { ok: /[A-Z]/.test(form.password),      label: "One uppercase letter" },
                  { ok: /[0-9]/.test(form.password),      label: "One number" },
                  { ok: /[^A-Za-z0-9]/.test(form.password), label: "Special character (bonus)" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <span style={{ fontSize: "0.75rem", color: r.ok ? "#1D9E75" : "#ccc" }}>{r.ok ? "✓" : "○"}</span>
                    <span style={{ fontSize: "0.75rem", color: r.ok ? "#1D9E75" : "#aaa" }}>{r.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={touched.name && touched.email && touched.password && !isValid}
              style={{
                width: "100%",
                background: isValid ? "linear-gradient(135deg, #1D9E75, #0F6E56)" : "#1a1a2e",
                color: "#fff", border: "none", borderRadius: "12px",
                padding: "12px", fontSize: "0.95rem", fontWeight: 700,
                cursor: (touched.name && touched.email && touched.password && !isValid) ? "not-allowed" : "pointer",
                opacity: (touched.name && touched.email && touched.password && !isValid) ? 0.45 : 1,
                transition: "all 0.25s",
                letterSpacing: "0.3px",
              }}
            >
              {isValid ? "✓ Submit Form" : "Complete All Fields"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#bbb", marginTop: "0.75rem", marginBottom: 0 }}>
              All fields required · Errors shown dynamically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, type, value, placeholder, onChange, onBlur, error, valid }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#444", marginBottom: "5px" }}>
        {icon} {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        style={{
          width: "100%", boxSizing: "border-box",
          border: `1.5px solid ${error ? "#E24B4A" : valid ? "#1D9E75" : "#e0ddf0"}`,
          borderRadius: "10px", padding: "10px 12px",
          fontSize: "0.9rem", fontFamily: "inherit", outline: "none",
          background: valid ? "#f0faf5" : "#fff",
          transition: "border 0.2s, background 0.2s",
        }}
      />
      {error && <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#E24B4A" }}>⚠ {error}</p>}
      {valid && <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#1D9E75" }}>✓ Looks good</p>}
    </div>
  );
}
