import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  // This holds our live graph data
  const [data, setData] = useState([{ time: "00:00", temperature: 4.0 }]);

  const [currentTemp, setCurrentTemp] = useState(4.0);

  // SIMULATION: This acts like your IoT sensor sending data every 3 seconds
  // (Later, you will replace this with a real fetch() to Member 2's FastAPI)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      // Simulate temperature fluctuating around 4 degrees, occasionally spiking
      const randomTemp = (Math.random() * (8.5 - 2.0) + 2.0).toFixed(1);

      setCurrentTemp(parseFloat(randomTemp));

      setData((prevData) => {
        const newData = [
          ...prevData,
          { time: timeString, temperature: parseFloat(randomTemp) },
        ];
        // Keep only the last 10 readings so the chart scrolls nicely
        if (newData.length > 10) return newData.slice(1);
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Determine if we are in a safe zone or breach
  const isBreach = currentTemp > 8.0 || currentTemp < 2.0;

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#111",
        color: "white",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}>
        <h1>AeroCool Command Center</h1>
        <div>
          <button onClick={() => navigate(-1)} style={btnStyle}>
            ⬅ Go Back
          </button>
          <Link to="/user">
            <button style={btnStyle}>User Portal</button>
          </Link>
          <Link to="/supplier">
            <button style={btnStyle}>Supplier Portal</button>
          </Link>
        </div>
      </div>

      {/* Massive Status Indicator */}
      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          backgroundColor: isBreach ? "#ff4d4d" : "#2ecc71",
          color: isBreach ? "white" : "#000",
          marginBottom: "30px",
          transition: "background-color 0.3s ease",
        }}>
        <h2 style={{ margin: 0, fontSize: "2rem" }}>
          STATUS:{" "}
          {isBreach ? "CRITICAL BREACH DETECTED" : "SYSTEM STABLE (2°C - 8°C)"}
        </h2>
        <p
          style={{
            margin: "5px 0 0 0",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}>
          Current Internal Temp: {currentTemp}°C
        </p>
      </div>

      {/* The Live Telemetry Chart */}
      <div
        style={{
          backgroundColor: "#222",
          padding: "20px",
          borderRadius: "10px",
          height: "400px",
        }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis domain={[0, 15]} stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "none" }}
            />

            {/* The Safe Zone Guideline */}
            <ReferenceLine
              y={8}
              label="Max Safe Temp (8°C)"
              stroke="red"
              strokeDasharray="3 3"
            />
            <ReferenceLine
              y={2}
              label="Min Safe Temp (2°C)"
              stroke="lightblue"
              strokeDasharray="3 3"
            />

            {/* The Actual Data Line */}
            <Line
              type="monotone"
              dataKey="temperature"
              stroke={isBreach ? "#ff4d4d" : "#00ffcc"}
              strokeWidth={4}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Just a quick helper style for the buttons to look decent in dark mode
const btnStyle = {
  padding: "10px 15px",
  marginLeft: "10px",
  backgroundColor: "#333",
  color: "white",
  border: "1px solid #555",
  borderRadius: "5px",
  cursor: "pointer",
};
