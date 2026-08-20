const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobTitle: String,
  company: String,
  location: String,
  description: String,
  status: { 
    type: String, 
    enum: ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'], 
    default: 'Wishlist' 
  },
  matchScore: Number,
  notes: { type: String, default: "" }, 
  appliedDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Application', applicationSchema);