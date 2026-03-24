require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Required for React to talk to Node
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const session = require('express-session');

// Models
const Complaint = require('./models/complaint-model');
const User = require('./models/user-model');

const app = express();

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Allow Vite/React
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'civicconnect',
    resave: false,
    saveUninitialized: true
}));

// --- API Routes ---

// 1. Signup Route
app.post('/api/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email already registered' });
        
        // The password hashing happens automatically in your user-model.js pre-save hook
        const user = await User.create({ name, email, password, role });
        
        res.status(201).json({ success: true, message: "User registered successfully", role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await user.comparePassword(password); // Using the method from our new model
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        // Include the role in the response so React knows where to redirect
        res.json({ success: true, role: user.role, name: user.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. AI Classifier Route (From your previous project)
app.post('/api/report/classify', async (req, res) => {
    const { complaint, lat, lng } = req.body;
    try {
        const pyRes = await fetch('https://aerocool-os.onrender.com/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ complaint })
        });
        const result = await pyRes.json();
        const ticketId = 'CIV' + Math.floor(1000 + Math.random() * 9000);

        const newComplaint = await Complaint.create({
            complaint,
            department: result.department,
            category: result.category,
            priority: result.priority,
            summary: result.summary,
            lat: parseFloat(lat) || 0,
            lng: parseFloat(lng) || 0,
            ticketId
        });

        res.json({ success: true, ...result, ticketId });
    } catch (error) {
        console.error('CLASSIFY ERROR:', error);
        res.status(500).json({ error: 'Classifier unavailable' });
    }
});

// 4. Get All Complaints
app.get('/api/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find({});
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch complaints' });
    }
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`🚀 API Server running on port ${PORT}`));
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

startServer();