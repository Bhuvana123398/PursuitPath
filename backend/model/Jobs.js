const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String], 
    deadline: { type: Date, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isManual: { type: Boolean, default: true }, 
    createdAt: { type: Date, default: Date.now }
});

// Ensure this line is exactly like this
module.exports = mongoose.model('Job', JobSchema);