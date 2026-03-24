import { Link } from "react-router-dom";

export default function Supplier() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Supplier Profile</h1>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <Link to="/">
          <button>Back to Home</button>
        </Link>
        <Link to="/dashboard">
          <button>Go to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}
