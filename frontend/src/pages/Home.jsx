import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={pageStyle}>
      <div style={heroContainer}>
        {/* Main Branding */}
        <h1
          style={{
            fontSize: "4rem",
            color: "#00ffcc",
            margin: "0 0 10px 0",
            letterSpacing: "2px",
          }}>
          AeroCool OS
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#aaa",
            maxWidth: "600px",
            margin: "0 auto 40px auto",
            lineHeight: "1.6",
          }}>
          The world's first Hybrid Web3 Smart Thermostat for Active Cold Chain
          Logistics. Mathematical proof of integrity, zero gas fees, absolute
          trust.
        </p>

        {/* Primary Call to Action (Login/Signup) */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            marginBottom: "50px",
          }}>
          <Link to="/login" style={primaryBtnStyle}>
            System Login
          </Link>
          <Link to="/signup" style={secondaryBtnStyle}>
            Register Node
          </Link>
        </div>

        {/* Secondary Navigation (User/Supplier Portals) */}
        <div
          style={{
            borderTop: "1px solid #333",
            paddingTop: "30px",
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
          }}>
          <p
            style={{
              color: "#777",
              marginBottom: "15px",
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}>
            Direct Access Portals
          </p>
          <div
            style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <Link to="/user" style={portalBtnStyle}>
              📦 Logistics User Portal
            </Link>
            <Link to="/supplier" style={portalBtnStyle}>
              💊 Supplier Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Styles for a Sleek, Dark-Mode Landing Page ---
const pageStyle = {
  backgroundColor: "#0a0a0a", // Deep black background
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  textAlign: "center",
};

const heroContainer = {
  padding: "40px",
  borderRadius: "15px",
  background:
    "radial-gradient(circle, rgba(0,255,204,0.05) 0%, rgba(10,10,10,1) 70%)", // Subtle glowing effect behind the text
};

const primaryBtnStyle = {
  padding: "15px 30px",
  backgroundColor: "#00ffcc",
  color: "#000",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1.1rem",
  boxShadow: "0 4px 15px rgba(0, 255, 204, 0.3)",
  transition: "all 0.3s ease",
};

const secondaryBtnStyle = {
  padding: "15px 30px",
  backgroundColor: "transparent",
  color: "#00ffcc",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1.1rem",
  border: "2px solid #00ffcc",
  transition: "all 0.3s ease",
};

const portalBtnStyle = {
  padding: "10px 20px",
  backgroundColor: "#1a1a1a",
  color: "#ccc",
  textDecoration: "none",
  borderRadius: "6px",
  border: "1px solid #333",
  fontSize: "0.95rem",
};
