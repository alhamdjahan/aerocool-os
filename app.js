require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // Built-in for SHA-256 hashing
const connectDB = require('./config/db');
const Telemetry = require('./models/telemetry-model');
const User = require('./models/user-models');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// --- Helper: Blockchain Hashing Function ---
// Takes previous hash + new temp to create a chain 
const generateBlockHash = async (newTemp) => {
    const lastEntry = await Telemetry.findOne().sort({ _id: -1 });
    const prevHash = lastEntry ? lastEntry.block_hash : "GENESIS_HASH";
    return crypto.createHash('sha256').update(prevHash + newTemp).digest('hex');
};

// --- API Routes ---

// 1. Ingestion API: Receives data from Member 3's IoT Script [cite: 25]
app.post('/api/telemetry', async (req, res) => {
    try {
        const { temperature, battery_level, power_source } = req.body;

        // Generate the new blockchain hash 
        const block_hash = await generateBlockHash(temperature);

        const log = await Telemetry.create({
            temperature,
            battery_level,
            power_source,
            block_hash
        });

        // Trigger Alert: If temp > 8°C, call Member 4's logic [cite: 14, 29]
        if (temperature > 8) {
            console.log(`⚠️ ALERT: Thermal Breach! Current Temp: ${temperature}°C`);
            // You would call your Twilio function here [cite: 30, 48]
        }

        res.status(201).json({ success: true, log });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Dashboard API: Member 1's React app polls this every 2s 
app.get('/api/logs/latest', async (req, res) => {
    try {
        const latestLogs = await Telemetry.find().sort({ _id: -1 }).limit(10);
        res.json(latestLogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

// 3. Auth Routes (Signup/Login) - Keeping these from before
app.post('/api/signup', async (req, res) => { /* ... (same as previous code) ... */ });
app.post('/api/login', async (req, res) => { /* ... (same as previous code) ... */ });

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`❄️ Cold Chain Server live on port ${PORT}`));
});