require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const connectDB = require('./config/db');
const Telemetry = require('./models/telemetry-model');
const User = require('./models/user-models');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// --- Helper: Blockchain Hashing Function ---
const generateBlockHash = async (newTemp) => {
    const lastEntry = await Telemetry.findOne().sort({ _id: -1 });
    const prevHash = lastEntry ? lastEntry.block_hash : "GENESIS_HASH";
    // Chain complexity: Hash(Previous Hash + Current Temperature)
    return crypto.createHash('sha256').update(prevHash + newTemp).digest('hex');
};

// --- API Routes ---

// 1. Ingestion API: IoT Telemetry
app.post('/api/telemetry', async (req, res) => {
    try {
        const { temperature, battery_level, power_source } = req.body;
        const block_hash = await generateBlockHash(temperature);

        const log = await Telemetry.create({
            temperature,
            battery_level,
            power_source,
            block_hash
        });

        if (temperature > 8) {
            console.log(`⚠️ ALERT: Thermal Breach! Current Temp: ${temperature}°C`);
        }

        res.status(201).json({ success: true, log });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Auth: Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const user = await User.create({ name, email, password, role });

        res.status(201).json({ 
            success: true, 
            message: "Node registered successfully",
            user: { id: user._id, name: user.name, role: user.role } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Auth: Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({ 
            success: true, 
            user: { name: user.name, role: user.role } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Dashboard API: Fetch logs
app.get('/api/logs/latest', async (req, res) => {
    try {
        const latestLogs = await Telemetry.find().sort({ _id: -1 }).limit(10);
        res.json(latestLogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`❄️ Cold Chain Server live on port ${PORT}`));
});