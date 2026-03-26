const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 1. Define the Schema
const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Hospital or User name is required'],
        trim: true
    },
    email: { 
        type: String,
        required: [true, 'Work email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
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

// 2. Password hashing middleware
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// 3. Export the model
// The "||" check prevents errors during hot-reloads in development
module.exports = mongoose.models.User || mongoose.model('User', userSchema);