import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default to User

  const handleSignup = (e) => {
    e.preventDefault();
    if (role === "supplier") {
      navigate("/supplier");
    } else {
      navigate("/user");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-10 rounded-2xl shadow-2xl w-full max-w-md my-8">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 mb-2 transition-all">
            {role === "supplier" ? "Register Supplier" : "Register User"}
          </h2>
          <p className="text-gray-400 text-sm">Create your organization node</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Full Name / Hospital</label>
            <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all" placeholder="City General Hospital" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Work Email</label>
            <input type="email" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all" placeholder="admin@hospital.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Create Password</label>
            <input type="password" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Select Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all cursor-pointer">
              <option value="user">👤 User (Request Vaccines)</option>
              <option value="supplier">💊 Supplier (Supply Medicines)</option>
            </select>
          </div>

          <button type="submit" className="w-full py-4 mt-2 bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold rounded-lg shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all hover:scale-[1.02]">
            Register Node
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