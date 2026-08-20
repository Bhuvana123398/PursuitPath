const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'recruiter'], default: 'candidate' },
  skills: [String], // Used for the Match Score
  targetRole: { type: String, default: "Set your Role" } 
});
module.exports = mongoose.model('User', userSchema);