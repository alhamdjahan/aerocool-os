require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const connectDB = require('./config/db');
const Telemetry = require('./models/telemetry-model');
const User = require('./models/user-models');

const app = express();

// Middleware - Ensure React (5173) can talk to Backend (8000)
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// --- Helper: Blockchain Hashing Function ---
// Creates a SHA-256 chain: Hash(Previous Hash + Current Temperature) 
const generateBlockHash = async (newTemp) => {
    const lastEntry = await Telemetry.findOne().sort({ _id: -1 });
    const prevHash = lastEntry ? lastEntry.block_hash : "GENESIS_HASH";
    return crypto.createHash('sha256').update(prevHash + newTemp.toString()).digest('hex');
};

// --- API Routes ---

// 1. Ingestion API: Receives real-time data from aerocool_sim.py [cite: 25]
app.post('/api/telemetry', async (req, res) => {
    try {
        // Destructure keys exactly as they appear in the Python simulator payload
        const { device_id, temperature, battery_level, power_source, alert_level } = req.body;
        
        // Generate blockchain hash for data integrity [cite: 16]
        const block_hash = await generateBlockHash(temperature);

        // Save to MongoDB - Ensure these keys match your Schema exactly! [cite: 24, 27]
        const log = await Telemetry.create({
            device_id: device_id || "AERO-G16-SIM",
            temperature,
            battery_level, // Ensure your Model uses snake_case here
            power_source,  // Ensure your Model uses snake_case here
            alert_level,
            block_hash
        });

        // Backend console logging for real-time monitoring [cite: 29]
        if (temperature > 8 || temperature < 2) {
            console.log(`⚠️ ALERT: Thermal Breach Detected! ${temperature}°C [${alert_level}]`);
        }

        res.status(201).json({ success: true, log });
    } catch (err) {
        console.error("Ingestion Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 2. Auth Routes: (Retained your current logic)
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User exists" });
        const user = await User.create({ name, email, password, role });
        res.status(201).json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json({ success: true, user: { name: user.name, role: user.role } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Dashboard API: Polled by React every 2 seconds
app.get('/api/dashboard/history', async (req, res) => {
    try {
        // Fetch last 30 logs to provide a better trend curve on the chart
        const history = await Telemetry.find().sort({ createdAt: -1 }).limit(30);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// --- SERVER START ---
// Fixed on Port 8000 to match Simulator
const PORT = 8000; 
connectDB().then(() => {
    app.listen(PORT, () => console.log(`❄️ AeroCool Server Live: http://localhost:${PORT}`));
});