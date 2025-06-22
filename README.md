# Lone Town - Intelligent Matchmaking System

**Duration:** 21 June 2025  
**Frontend:** React.js  
**Backend:** Node.js, Express.js, Socket.io  
**Database:** MongoDB

## Project Overview
Lone Town is a mindful dating platform designed to fight swipe fatigue by offering users one deeply compatible match at a time. The system leverages advanced emotional, psychological, and behavioral analysis to create intentional, meaningful connections. Every match is exclusive, and users must make conscious decisions to invest or move on, promoting slow, thoughtful relationship building.

---

## Features

### Backend
- **Deep Compatibility Algorithm:**
  - Analyzes emotional intelligence, psychological traits, behavioral patterns, and relationship values.
  - Uses a weighted scoring system (interests, personality, location, engagement).
  - Learns from user behavior and match history.
- **Exclusive Match Management:**
  - Users can only have one active match at a time.
  - Reciprocal match records ensure exclusivity.
- **Complex State Engine:**
  - Manages states: matched, pinned, frozen, available.
  - Automatic transitions for unpinning, freezing, and new match delays.
- **Intelligent Timer Systems:**
  - 24-hour reflection freeze after unpinning.
  - 2-hour delay before new match for the unmatched user.
- **Conversation Milestone Tracking:**
  - Tracks message count and timing (100 messages in 48 hours unlocks video call).
- **Real-time Messaging:**
  - WebSocket-based chat with message counting, typing indicators, and timestamps.
- **Intentionality Analytics:**
  - Tracks user engagement, response times, and commitment levels to improve matching.
- **Automated Feedback System:**
  - Provides personalized insights and suggestions after unpinning.

### Frontend
- **Mindful Match Interface:**
  - Clean, focused UI showing only the current match.
- **Pin/Unpin Decision Flow:**
  - Modal-driven, intentional unpinning with reflection period explanation.
- **Conversation Milestone Display:**
  - Visual progress bar for message count and video call unlock.
- **Freeze Period Communication:**
  - Empathetic UI for reflection phase and wait times.
- **Match Feedback Display:**
  - Personalized feedback modal after unpinning.
- **Intentional Onboarding:**
  - Assessment capturing deep compatibility factors.
- **State Awareness:**
  - Visual indicators for user state (matched, frozen, available, milestone progress).

---

## Technical Stack
- **Frontend:** React.js, Tailwind CSS, Zustand (state), Socket.io-client
- **Backend:** Node.js, Express.js, Socket.io, Mongoose
- **Database:** MongoDB
- **Deployment:** Vercel (frontend), Render (backend)

---

## Matchmaking Algorithm Documentation
- **Interest Similarity:** Jaccard coefficient on user interests.
- **Personality Compatibility:** Compares Big Five trait scores for complementarity.
- **Location Proximity:** Haversine formula for distance, weighted by user preference.
- **Engagement Patterns:** Analyzes response time, message length, and daily activity.
- **Deal Breakers & Must-Haves:** Filters out incompatible matches before scoring.
- **Learning:** Updates engagement score and match history after each match.

---

## How to Run Locally
1. **Clone the repository:**
   ```zsh
   git clone <your-repo-url>
   cd dating-website
   ```
2. **Backend:**
   ```zsh
   cd backend
   npm install
   npm start
   ```
3. **Frontend:**
   ```zsh
   cd ../frontend
   npm install
   npm run dev
   ```
4. **Environment:**
   - Set up `.env` files for both frontend and backend as per deployment URLs.

---

## Deployment
- **Frontend:** [Vercel Deployment Link](https://dating-website-chi.vercel.app)
- **Backend:** [Render Deployment Link](https://dating-website-z6zg.onrender.com)

---

## Bonus Features
- Machine learning improvements to matching algorithm (planned)
- Advanced analytics dashboard (planned)
- Voice messaging capabilities (planned)

---

## Submission
- [GitHub Repository](<your-repo-url>)
- [Vercel Deployed App](https://dating-website-chi.vercel.app)
- [Render Backend API](https://dating-website-z6zg.onrender.com)
- [Demo Video/Google Drive Link](<your-demo-link>)

---

## License
MIT
