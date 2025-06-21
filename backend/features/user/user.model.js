const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  bio: { type: String, required: true },
  avatar: { type: String, required: true },
  interests: [{ type: String }],
  location: { type: String, required: true },
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  preferences: {
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 50 }
    },
    maxDistance: { type: Number, default: 50 }, // in kilometers
    dealBreakers: [{ type: String }],
    mustHaveInterests: [{ type: String }]
  },
  personalityTraits: [{
    trait: { type: String },
    score: { type: Number, min: 0, max: 1 }
  }],
  activityMetrics: {
    responseTime: { type: Number, default: 0 }, // avg response time in minutes
    messageLength: { type: Number, default: 0 }, // avg message length
    dailyActiveTime: { type: Number, default: 0 }, // minutes per day
    engagementScore: { type: Number, default: 0 } // 0-1 scale
  },
  matchHistory: [{
    matchId: { type: String },
    userId: { type: String },
    duration: { type: Number }, // in days
    messageCount: { type: Number },
    compatibility: { type: Number }, // 0-1 scale
    outcome: { type: String, enum: ['success', 'unmatched', 'expired'] }
  }],
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for geospatial queries
userSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('User', userSchema);