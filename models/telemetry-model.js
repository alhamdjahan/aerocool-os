const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
    temperature: { 
        type: Number, 
        required: true 
    },
    batteryLevel: { 
        type: Number, 
        required: true 
    },
    powerSource: { 
        type: String, 
        enum: ['Solar', 'Battery'], // Matches simulator requirements [cite: 40]
        required: true 
    },
    previousHash: { 
        type: String, 
        required: true 
    },
    blockHash: { 
        type: String, 
        required: true 
    }
}, { timestamps: true }); // Automatically adds the "timestamp" column required [cite: 24]

module.exports = mongoose.model('Telemetry', telemetrySchema);