const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
    email: {
        type: String,
        required: [true, 'email is required!'],
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);