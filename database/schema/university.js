const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    major: {
        type: String,
        required: [true, 'Major is required!'],
    },
    year: {
        type: Number,
        required: [true, 'Year is required!'],
    }
})

module.exports = mongoose.model('University', universitySchema)