import React, { useState, useEffect } from "react";

export default function SimpleForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("formData");

    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save form data to localStorage
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));

    const noErrors =
      errors.name === "" &&
      errors.email === "" &&
      formData.name.trim() !== "" &&
      formData.email.trim() !== "";

    setIsValid(noErrors);
  }, [formData, errors]);

  // Validation Function
  const validate = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = `${name} is required`;
    } else {
      if (name === "name" && value.trim().length < 3) {
        error = "Name must be at least 3 characters";
      }

      if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
        error = "Invalid email format";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate(name, value);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // Fake API delay
    setTimeout(() => {
      setSubmittedData(formData);
      setLoading(false);
    }, 1000);
  };

  // Reset Form
  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
    });

    setErrors({
      name: "",
      email: "",
    });

    setSubmittedData(null);

    localStorage.removeItem("formData");
  };

  // Styles
  const s = {
    page: {
      minHeight: "100vh",
      background: "#f4f7fb",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      fontFamily: "Arial",
    },

    card: {
      width: "100%",
      maxWidth: "450px",
      background: "#fff",
      padding: "30px",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },

    title: {
      textAlign: "center",
      marginBottom: "25px",
      color: "#222",
    },

    inputGroup: {
      marginBottom: "18px",
    },

    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#333",
    },

    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "15px",
      boxSizing: "border-box",
    },

    error: {
      color: "red",
      fontSize: "13px",
      marginTop: "5px",
    },

    counter: {
      textAlign: "right",
      fontSize: "12px",
      color: "#666",
      marginTop: "4px",
    },

    buttonContainer: {
      display: "flex",
      gap: "10px",
      marginTop: "20px",
    },

    submitBtn: {
      flex: 1,
      padding: "12px",
      border: "none",
      borderRadius: "10px",
      background: isValid ? "#007bff" : "#9bbcf3",
      color: "#fff",
      fontWeight: "bold",
      cursor: isValid ? "pointer" : "not-allowed",
      transition: "0.3s",
    },

    resetBtn: {
      flex: 1,
      padding: "12px",
      border: "none",
      borderRadius: "10px",
      background: "#ff4d4d",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
    },

    resultCard: {
      marginTop: "25px",
      padding: "15px",
      background: "#f0f5ff",
      borderRadius: "10px",
    },

    success: {
      color: "green",
      fontWeight: "bold",
      marginBottom: "10px",
    },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Simple React Form</h1>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={s.inputGroup}>
            <label style={s.label}>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-invalid={!!errors.name}
              style={{
                ...s.input,
                borderColor: errors.name ? "red" : "#ccc",
              }}
            />

            <div style={s.counter}>
              {formData.name.length}/30
            </div>

            {errors.name && (
              <p style={s.error}>{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div style={s.inputGroup}>
            <label style={s.label}>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-invalid={!!errors.email}
              style={{
                ...s.input,
                borderColor: errors.email ? "red" : "#ccc",
              }}
            />

            {errors.email && (
              <p style={s.error}>{errors.email}</p>
            )}
          </div>

          {/* Buttons */}
          <div style={s.buttonContainer}>
            <button
              type="submit"
              disabled={!isValid || loading}
              style={s.submitBtn}
              onMouseEnter={(e) => {
                if (isValid) {
                  e.target.style.opacity = "0.9";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = "1";
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              style={s.resetBtn}
            >
              Reset
            </button>
          </div>
        </form>

        {/* Submitted Data */}
        {submittedData && (
          <div style={s.resultCard}>
            <p style={s.success}>
              Form Submitted Successfully ✅
            </p>

            <p>
              <strong>Name:</strong>{" "}
              {submittedData.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {submittedData.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}