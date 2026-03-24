import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative font-sans">
      <div className="absolute top-0 right-0 w-full h-full z-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 right-0 w-full md:w-[70%] h-full object-cover object-left opacity-90">
          <path
            d="M0,0 L1440,0 L1440,800 L400,800 C600,600 200,300 0,0 Z"
            fill="url(#teal-gradient)"
            opacity="0.15"
          />
          <path
            d="M200,0 L1440,0 L1440,800 L600,800 C800,600 400,400 200,0 Z"
            fill="url(#teal-gradient)"
            opacity="0.3"
          />
          <defs>
            <linearGradient
              id="teal-gradient"
              x1="1440"
              y1="0"
              x2="0"
              y2="800"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#00ffcc" />
              <stop offset="1" stopColor="#0284c7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">
          AeroCool OS
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center min-h-[80vh]">
        <div className="md:w-1/2 flex flex-col items-start text-left pt-12 md:pt-0">
          <p className="text-teal-400 font-bold tracking-widest uppercase text-sm mb-4">
            Smart Cold-Chain Command Center
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-white">
            Proactive <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
              Integrity.
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
            The world's first Hybrid Web3 Smart Thermostat for logistics.
            Mathematical proof of cold-chain safety with zero bloated gas fees.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/signup"
              className="flex items-center justify-center px-10 py-4 bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold rounded-full shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all hover:scale-105 text-center tracking-wide">
              Sign Up
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center px-10 py-4 bg-transparent border-2 border-slate-700 hover:border-teal-400 text-gray-300 hover:text-teal-400 font-bold rounded-full transition-all hover:scale-105 text-center tracking-wide">
              Login
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 w-full mt-20 md:mt-0 flex justify-center md:justify-end relative">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 bg-teal-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
            <div className="relative bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
              <div className="flex justify-between items-center mb-4">
                <div className="text-teal-400 font-mono text-xs">
                  TX_HASH: 0x7a2...
                </div>
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              </div>
              <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-end">
                  <svg
                    className="w-full h-20 text-teal-400 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 100 50"
                    preserveAspectRatio="none">
                    <path d="M0 40 L20 40 L30 10 L50 30 L70 5 L80 25 L100 25" />
                  </svg>
                </div>
                <span className="text-4xl font-bold text-white z-10 drop-shadow-lg">
                  15.2°C
                </span>
              </div>
              <div className="flex gap-2">
                <div className="h-8 flex-1 bg-slate-800 rounded"></div>
                <div className="h-8 w-16 bg-red-500/20 border border-red-500/50 rounded flex items-center justify-center text-red-400 text-xs font-bold">
                  SMS
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 bg-slate-800 border border-teal-500/30 p-4 rounded-xl shadow-xl transform -rotate-6 z-20 backdrop-blur-md bg-opacity-90">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-teal-400"></div>
                </div>
                <div>
                  <div className="text-white text-sm font-bold">
                    Smart Contract
                  </div>
                  <div className="text-teal-400 text-xs font-mono">
                    Breach Minted to Chain
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
