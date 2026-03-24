const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ybit-hackathon');


const bcrypt = require('bcrypt');
const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
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
        required: true
    }
}, { timestamps: true });
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
