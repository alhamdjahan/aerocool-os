const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Hospital or User name is required'],
        trim: true
    },
    email: {  // <--- ADD THIS OPENING BRACE
        type: String,
        required: [true, 'Work email is required'],
        unique: true,
        lowercase: true,
        trim: true
    }, // <--- ENSURE THIS CLOSING BRACE EXISTS
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'supplier'], 
        default: 'user'
    }
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);