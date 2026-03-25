// import { Link } from "react-router-dom";

// export default function Supplier() {
//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h1>Supplier Profile</h1>
//       <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
//         <Link to="/">
//           <button>Back to Home</button>
//         </Link>
//         <Link to="/dashboard">
//           <button>Go to Dashboard</button>
//         </Link>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Supplier() {
  const navigate = useNavigate();

  // Fleet overview: managing multiple simulator nodes
  const [fleet] = useState([
    {
      id: "AERO-G16-SIM",
      assigned_to: "City General Hospital",
      route: "Sawantwadi Sector 4",
      battery: "82%",
      temp: "4.0°C",
      status: "Online",
      sync: "Live",
      power: "Solar"
    },
    {
      id: "AERO-B22-SIM",
      assigned_to: "Red Cross Depot",
      route: "Sawantwadi Central",
      battery: "14%",
      temp: "15.2°C",
      status: "Critical",
      sync: "26 Cached",
      power: "Battery"
    },
    {
      id: "AERO-X10-SIM",
      assigned_to: "Rural Health Center",
      route: "Sawantwadi Checkpost",
      battery: "95%",
      temp: "5.5°C",
      status: "Online",
      sync: "Live",
      power: "Solar"
    }
  ]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans p-8 relative overflow-hidden">
      {/* Design Accent */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">
              Fleet Commander
            </h1>
            <p className="text-gray-400 mt-2">Global oversight of active Cold-Chain Nodes</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Active Nodes</p>
              <p className="text-teal-400 font-mono font-bold">03 / 10</p>
            </div>
            <button 
              onClick={() => navigate("/login")}
              className="px-6 py-2 border border-slate-700 rounded-full hover:bg-slate-800 transition-all text-sm font-bold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Fleet List */}
        <div className="space-y-4">
          {fleet.map((node) => (
            <div 
              key={node.id}
              className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between hover:border-emerald-500/50 transition-all group shadow-lg"
            >
              {/* Node Identity */}
              <div className="flex items-center gap-6 w-full md:w-1/3">
                <div className={`p-4 rounded-xl ${node.status === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 112 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">{node.id}</h3>
                  <p className="text-slate-500 text-sm">{node.assigned_to}</p>
                </div>
              </div>

              {/* Deployment Details */}
              <div className="flex flex-col items-center md:items-start w-full md:w-1/4 my-4 md:my-0">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Route</span>
                <span className="text-sm text-slate-300 font-medium">{node.route}</span>
                <div className="flex items-center gap-2 mt-1">
                   <div className={`w-2 h-2 rounded-full ${node.status === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                   <span className="text-xs text-slate-400 italic">{node.status}</span>
                </div>
              </div>

              {/* Hardware Health Preview */}
              <div className="flex gap-8 items-center w-full md:w-1/4 justify-center">
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Battery</p>
                  <p className={`text-xl font-bold ${parseInt(node.battery) < 20 ? 'text-red-500' : 'text-white'}`}>
                    {node.battery}
                  </p>
                </div>
                <div className="text-center border-l border-slate-800 pl-8">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Temp</p>
                  <p className={`text-xl font-bold ${node.status === 'Critical' ? 'text-red-500' : 'text-teal-400'}`}>
                    {node.temp}
                  </p>
                </div>
              </div>

              {/* Management Action */}
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full px-6 py-3 bg-slate-800 hover:bg-emerald-400 hover:text-slate-900 font-bold rounded-xl transition-all shadow-md border border-slate-700"
                >
                  Manage Node
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}