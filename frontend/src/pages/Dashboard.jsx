import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Note: You'll need to install recharts: npm install recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Simulated data state to match your Telemetry Engine
  const [data, setData] = useState([
    { time: '02:00:30', temp: 4.0, battery: 98 },
    { time: '02:00:44', temp: 12.5, battery: 97 },
    { time: '02:01:00', temp: 0.9, battery: 96 },
  ]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Navigation / Status Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.8)]"></div>
            <div>
              <h2 className="text-xl font-black tracking-tighter text-teal-400">AeroCool Fleet Command</h2>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">Live Sync Active • AERO-G16-SIM</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate(-1)} className="px-4 py-2 text-xs font-bold border border-slate-700 rounded-lg hover:bg-slate-800 transition-all">Back to Fleet</button>
            <button onClick={() => navigate("/login")} className="px-4 py-2 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all">Emergency Exit</button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Temperature Chart - Span 2 Columns */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <span className="text-teal-400 text-xl">🌡️</span> Internal Temperature
              </h3>
              <div className="px-3 py-1 bg-teal-400/10 border border-teal-400/20 rounded text-teal-400 text-xs font-mono">Range: 2°C - 8°C</div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 20]} />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px'}} />
                  <Area type="monotone" dataKey="temp" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Battery Reserve */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <span className="text-emerald-400 text-xl">🔋</span> Power Reserve
              </h3>
              <div className="relative h-48 flex items-center justify-center">
                 {/* Large Percentage Display */}
                 <div className="text-center">
                   <p className="text-6xl font-black text-white">96<span className="text-2xl text-slate-500">%</span></p>
                   <p className="text-[10px] text-emerald-400 font-bold uppercase mt-2 tracking-widest">Optimal Charge</p>
                 </div>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
               <div className="bg-emerald-400 h-full w-[96%] shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
            </div>
          </div>

          {/* Power Routing Status */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Active Power Routing</h3>
            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-teal-500/20 rounded-2xl bg-teal-500/5">
              <span className="text-5xl mb-4">☀️</span>
              <h4 className="text-2xl font-black text-teal-400 tracking-tighter">SOLAR ARRAY ACTIVE</h4>
              <p className="text-xs text-slate-500 mt-2 font-mono italic">Charging internal reserves...</p>
            </div>
          </div>

          {/* Live Alerts Feed */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-red-500/20 p-6 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-red-400">Live Supervisor Alerts</h3>
            </div>
            <div className="space-y-3 h-[180px] overflow-y-auto pr-2 custom-scrollbar">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="text-sm font-bold text-slate-200">CONTAINER: AERO-G16-SIM</p>
                      <p className="text-[10px] text-red-400 font-mono">STATUS: CRITICAL BREACH DETECTED</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">0.9°C</p>
                    <p className="text-[10px] text-slate-500 font-mono">2:01:00 AM</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}