import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you send this to Member 2's FastAPI here.
    // For now, let's just push them to the Dashboard on click!
    console.log("Logging in with:", email);
    navigate("/dashboard");
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: "#00ffcc", marginBottom: "5px" }}>AeroCool OS</h2>
        <p style={{ color: "#aaa", marginBottom: "30px" }}>
          Secure Personnel Access
        </p>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={primaryBtnStyle}>
            Authenticate
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
          <Link to="/signup" style={linkStyle}>
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- Styles to keep it looking like a high-tech OS ---
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
