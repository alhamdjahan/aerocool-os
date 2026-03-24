require('dotenv').config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const session = require('express-session');
const Complaint = require('./models/complaint-model');
const User = require('./models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'civicconnect',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('home'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/deshboard', (req, res) => res.render('deshboard'));
app.get('/user', (req, res) => res.render('user'));
app.get('/supplier', (req, res) => res.render('supplier'));

app.post('/report/classify', async (req, res) => {
    const { complaint, lat, lng } = req.body;
    try {
        const pyRes = await fetch('https://aerocool-os.onrender.com/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ complaint })
        });
        const result = await pyRes.json();
        console.log('CLASSIFIER RESULT:', JSON.stringify(result));

        const ticketId = 'CIV' + Math.floor(1000 + Math.random() * 9000);

        await Complaint.create({
            complaint,
            department: result.department,
            category: result.category,
            priority: result.priority,
            summary: result.summary,
            lat: parseFloat(lat) || 0,
            lng: parseFloat(lng) || 0,
            ticketId
        });

        req.session.result = { ...result, complaint, lat, lng, ticketId };
        if (!req.session.complaints) req.session.complaints = [];
        req.session.complaints.push(req.session.result);

        res.json({ ...result, ticketId });

    } catch (error) {
        console.error('CLASSIFY ERROR:', error);
        res.status(500).json({ error: 'Classifier unavailable' });
    }
});

app.get('/status', (req, res) => {
    const result = req.session.result;
    if (!result) return res.redirect('/report');
    res.render('status', { result });
});

app.get('/api/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find({}, 'complaint department category priority summary lat lng ticketId createdAt');
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch complaints' });
    }
});

app.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email already registered' });
        const user = await User.create({ name, email, password, role });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
