const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  matchedUserId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'frozen', 'unpinned'], 
    default: 'active' 
  },
  isPinned: { type: Boolean, default: true },
  freezeUntil: { type: Date },
  messageCount: { type: Number, default: 0 },
  videoCallUnlocked: { type: Boolean, default: false },
  compatibilityScore: { type: Number, required: true },
  compatibilityDetails: {
    interestScore: { type: Number },
    personalityScore: { type: Number },
    locationScore: { type: Number },
    engagementScore: { type: Number }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);