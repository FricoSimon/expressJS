const mongoose = require('mongoose');

const discordUserSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('Discord', discordUserSchema);