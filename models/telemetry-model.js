const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
    temperature: {
        type: Number,
        required: true
    },
    battery_level: { // Changed from batteryLevel
        type: Number,
        required: true
    },
    power_source: { // Changed from powerSource
        type: String,
        enum: ['Solar Array', 'Internal Battery'], // Matches simulator logic
        required: true
    },
    block_hash: {
        type: String,
        required: true
    },
    device_id: { // Added this to match simulator payload
        type: String,
        default: "AERO-G16-SIM"
    }
}, { timestamps: true });

module.exports = mongoose.model('Telemetry', telemetrySchema);