import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

function App() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Normal Telemetry from MongoDB (Web3 has been completely removed)
        const res = await axios.get('http://localhost:8000/api/dashboard/history');
        
        const formattedData = [...res.data].reverse().map(item => {
          const date = new Date(item.createdAt);
          return {
            ...item,
            timeLabel: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
        });
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching live data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- DERIVED STATE FOR SUPERVISOR DASHBOARD ---
  const currentLog = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const isSolar = currentLog?.powerSource?.includes('Solar');
  
  // Is the system currently in a breach state right this exact second?
  const isCurrentlyBreached = currentLog && (currentLog.temperature >= 8.0 || currentLog.temperature < 2.0);

  // Filter historical data to only show critical alerts in the dispatch log
  const criticalAlerts = [...chartData].reverse().filter(log => log.temperature >= 8.0 || log.temperature < 2.0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Courier New, monospace', backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ color: '#00f2fe', margin: 0, fontSize: '28px' }}>🚛 AeroCool Fleet Command</h1>
          <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '14px' }}>Supervisor Logistics & Hardware Telemetry</p>
        </div>
        <div style={{ color: '#00ff00', fontSize: '14px', animation: 'blink 2s infinite' }}>● LIVE SYNC ACTIVE</div>
      </div>

      {/* TOP ROW: 2 GRAPHS (TEMP & BATTERY) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* GRAPH 1: TEMPERATURE */}
        <div style={{ backgroundColor: '#151515', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#ff4b4b' }}>🌡️ Internal Temperature</h3>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="timeLabel" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
                <YAxis domain={[0, 30]} stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                <ReferenceLine y={8.0} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'BREACH (8°C)', fill: 'red', fontSize: 10 }} />
                <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#ff4b4b" strokeWidth={3} dot={{ r: 3, fill: '#ff4b4b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 2: BATTERY */}
        <div style={{ backgroundColor: '#151515', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#00ff00' }}>🔋 Battery Reserve</h3>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="timeLabel" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
                <YAxis domain={[0, 100]} stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                <Area type="monotone" dataKey="batteryLevel" name="Battery (%)" stroke="#00ff00" fill="#00ff00" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: DIAGNOSTICS & ALERTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* PANEL: LIVE DIAGNOSTICS */}
        <div style={{ backgroundColor: '#151515', padding: '20px', borderRadius: '8px', border: '1px solid #222', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#aaa', alignSelf: 'flex-start' }}>⚙️ Active Power Routing</h3>
          
          <div style={{ 
            padding: '20px 40px', 
            borderRadius: '12px', 
            border: `2px solid ${isSolar ? '#00f2fe' : '#ffaa00'}`,
            backgroundColor: isSolar ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255, 170, 0, 0.1)',
            textAlign: 'center',
            boxShadow: `0 0 20px ${isSolar ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 170, 0, 0.2)'}`
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>
              {isSolar ? '☀️' : '🔋'}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: isSolar ? '#00f2fe' : '#ffaa00' }}>
              {isSolar ? 'SOLAR ARRAY ACTIVE' : 'INTERNAL BATTERY'}
            </div>
            <div style={{ fontSize: '14px', color: 'gray', marginTop: '10px' }}>
              {isSolar ? 'Charging internal reserves' : 'Discharging to cooling system'}
            </div>
          </div>
        </div>

        {/* PANEL: SUPERVISOR ALERTS */}
        <div style={{ backgroundColor: isCurrentlyBreached ? '#2a0a0a' : '#151515', padding: '15px', borderRadius: '8px', border: `1px solid ${isCurrentlyBreached ? '#ff4b4b' : '#333'}`, overflowY: 'auto', maxHeight: '290px', transition: 'all 0.3s ease' }}>
          <h3 style={{ margin: '0 0 10px 0', color: isCurrentlyBreached ? '#ff4b4b' : '#aaa', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isCurrentlyBreached && <span style={{ animation: 'blink 1s infinite' }}>🚨</span>}
            Live Supervisor Alerts
          </h3>
          <p style={{ fontSize: '11px', color: 'gray', marginTop: 0 }}>Real-time critical event dispatch</p>
          
          {criticalAlerts.length === 0 ? (
            <div style={{ color: '#00ff00', textAlign: 'center', marginTop: '50px', fontWeight: 'bold', border: '1px dashed #00ff00', padding: '20px', borderRadius: '8px' }}>
              ✅ All Containers Nominal.<br/><span style={{fontSize: '12px', fontWeight: 'normal'}}>No temperature breaches detected.</span>
            </div>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {criticalAlerts.map((alert, index) => (
                <li key={index} style={{ backgroundColor: '#1a0000', margin: '8px 0', padding: '12px', borderLeft: '4px solid red', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>⚠️ CONTAINER: {alert.device_id || "AERO-G16-SIM"}</span>
                    <span style={{ color: '#ff4b4b', fontWeight: 'bold' }}>{alert.temperature}°C</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'gray' }}>
                    <span>Status: {alert.alert_level || 'CRITICAL'}</span>
                    <span>{new Date(alert.createdAt).toLocaleTimeString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

    </div>
  );
}

export default App;