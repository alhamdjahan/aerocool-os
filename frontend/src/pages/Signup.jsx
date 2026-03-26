import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // Status States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Corrected to Port 8000 to match your app.js and aerocool_sim.py
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful!
        alert("Node registered successfully!");
        // Logic for role-based lane selection [cite: 3]
        navigate(role === "supplier" ? "/supplier" : "/user");
      } else {
        // Server returned an error (e.g., User already exists)
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      // Network or Server is down
      setError("Server unreachable. Ensure 'node app.js' is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-sans relative overflow-hidden">
      {/* AeroCool Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-10 rounded-2xl shadow-2xl w-full max-w-md my-8">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 mb-2">
            {role === "supplier" ? "Register Supplier" : "Register User"}
          </h2>
          <p className="text-gray-400 text-sm">Create your organization node</p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Full Name / Hospital</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all" 
              placeholder={role === 'supplier' ? "Pharma Corp" : "City General Hospital"} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Work Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all" 
              placeholder="admin@org.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Create Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Select Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all cursor-pointer"
            >
              <option value="user">👤 User (Request Vaccines)</option>
              <option value="supplier">💊 Supplier (Supply Medicines)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 mt-2 font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)] ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-teal-400 hover:bg-teal-300 hover:scale-[1.02] text-slate-900"
            }`}
          >
            {loading ? "Registering Node..." : "Register Node"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 hover:text-teal-300 font-bold transition-colors">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}