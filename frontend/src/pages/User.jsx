import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();

  // Hardcoded shipments for the Sawantwadi sector
  const [shipments] = useState([
    {
      id: "AERO-G16-SIM",
      item: "Polio Vaccine Batch A",
      location: "Sawantwadi (Sector 4)",
      eta: "March 26, 2026",
      temp: "4.0°C",
      status: "Secure",
      sync: "Live Sync",
      power: "Solar"
    },
    {
      id: "AERO-B22-SIM",
      item: "Blood Samples - Unit 12",
      location: "Sawantwadi (Central)",
      eta: "March 27, 2026",
      temp: "15.2°C",
      status: "Breach",
      sync: "26 Cached",
      power: "Battery"
    },
    {
      id: "AERO-X10-SIM",
      item: "Insulin Refrigerated",
      location: "Sawantwadi (Checkpost)",
      eta: "March 26, 2026",
      temp: "5.5°C",
      status: "Secure",
      sync: "Live Sync",
      power: "Solar"
    }
  ]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans p-8 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">
              Active Deliveries
            </h1>
            <p className="text-gray-400 mt-2">Tracking cold-chain nodes heading to Sawantwadi</p>
          </div>
          <button 
            onClick={() => navigate("/login")}
            className="px-6 py-2 border border-slate-700 rounded-full hover:bg-slate-800 transition-all text-sm font-bold"
          >
            Logout
          </button>
        </div>

        {/* Shipment List */}
        <div className="space-y-4">
          {shipments.map((truck) => (
            <div 
              key={truck.id}
              className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between hover:border-teal-500/50 transition-all group shadow-lg"
            >
              {/* Truck Icon & Identity */}
              <div className="flex items-center gap-6 w-full md:w-1/3">
                <div className={`p-4 rounded-xl ${truck.status === 'Breach' ? 'bg-red-500/10 text-red-500' : 'bg-teal-500/10 text-teal-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold group-hover:text-teal-400 transition-colors">{truck.item}</h3>
                  <p className="text-slate-500 text-sm font-mono">{truck.id}</p>
                </div>
              </div>

              {/* Destination Info */}
              <div className="flex flex-col items-center md:items-start w-full md:w-1/4 my-4 md:my-0">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Location</span>
                <span className="text-sm text-slate-300">{truck.location}</span>
                <span className="text-xs text-slate-500 mt-1 italic">ETA: {truck.eta}</span>
              </div>

              {/* Simulator Stats Preview */}
              <div className="flex gap-8 items-center w-full md:w-1/4 justify-center">
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Temp</p>
                  <p className={`text-xl font-bold ${truck.status === 'Breach' ? 'text-red-500' : 'text-teal-400'}`}>
                    {truck.temp}
                  </p>
                </div>
                <div className="text-center border-l border-slate-800 pl-8">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Sync</p>
                  <p className="text-sm font-semibold text-slate-300">{truck.sync} [cite: 42]</p>
                </div>
              </div>

              {/* Action */}
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full px-6 py-3 bg-slate-800 hover:bg-teal-400 hover:text-slate-900 font-bold rounded-xl transition-all shadow-md border border-slate-700"
                >
                  View Console
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}