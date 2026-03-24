import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSignup = (e) => {
    e.preventDefault();
    // Route them based on the role they picked!
    if (role === "supplier") {
      navigate("/supplier");
    } else {
      navigate("/user");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: "#00ffcc", marginBottom: "5px" }}>
          Create Account
        </h2>
        <p style={{ color: "#aaa", marginBottom: "30px" }}>
          Register your organization
        </p>

        <form
          onSubmit={handleSignup}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            placeholder="Full Name / Company"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="email"
            placeholder="Work Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          {/* Role Dropdown */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}>
            <option value="user">Logistics / Driver (User)</option>
            <option value="supplier">Pharmaceutical Supplier</option>
          </select>

          <button type="submit" style={primaryBtnStyle}>
            Register Node
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.9rem",
          }}>
          <Link to="/" style={linkStyle}>
            ⬅ Back to Home
          </Link>
          <Link to="/login" style={linkStyle}>
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- Styles (Same as Login for consistency) ---
const pageStyle = {
  backgroundColor: "#111",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "sans-serif",
};
const cardStyle = {
  backgroundColor: "#222",
  padding: "40px",
  borderRadius: "10px",
  width: "350px",
  textAlign: "center",
  border: "1px solid #333",
  boxShadow: "0 4px 15px rgba(0, 255, 204, 0.1)",
};
const inputStyle = {
  padding: "12px",
  borderRadius: "5px",
  border: "1px solid #444",
  backgroundColor: "#111",
  color: "white",
  outline: "none",
};
const primaryBtnStyle = {
  padding: "12px",
  backgroundColor: "#00ffcc",
  color: "#000",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
};
const linkStyle = { color: "#888", textDecoration: "none" };
