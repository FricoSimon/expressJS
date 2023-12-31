const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required!'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);