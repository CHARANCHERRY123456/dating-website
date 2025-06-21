const userService = require('../user/user.service');

class CompatibilityService {
  // Calculate interest similarity using Jaccard similarity coefficient
  calculateInterestSimilarity(userInterests, candidateInterests) {
    const intersection = userInterests.filter(interest => 
      candidateInterests.includes(interest)
    ).length;
    const union = new Set([...userInterests, ...candidateInterests]).size;
    return intersection / union;
  }

  // Calculate personality compatibility
  calculatePersonalityCompatibility(userTraits, candidateTraits) {
    const traitMap = new Map();
    userTraits.forEach(t => traitMap.set(t.trait, t.score));
    
    let compatibility = 0;
    let count = 0;
    
    candidateTraits.forEach(trait => {
      if (traitMap.has(trait.trait)) {
        // Higher score for complementary traits (closer to 0.5 difference)
        const diff = Math.abs(traitMap.get(trait.trait) - trait.score);
        compatibility += 1 - (Math.abs(0.5 - diff) * 2);
        count++;
      }
    });

    return count > 0 ? compatibility / count : 0;
  }

  // Calculate location-based score
  calculateLocationScore(userCoords, candidateCoords, maxDistance) {
    if (!userCoords || !candidateCoords) return 0;

    const distance = this.calculateDistance(
      userCoords.coordinates[1],
      userCoords.coordinates[0],
      candidateCoords.coordinates[1],
      candidateCoords.coordinates[0]
    );

    return Math.max(0, 1 - (distance / maxDistance));
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(value) {
    return value * Math.PI / 180;
  }

  // Calculate engagement compatibility
  calculateEngagementCompatibility(userMetrics, candidateMetrics) {
    const responseTimeComp = 1 - Math.abs(userMetrics.responseTime - candidateMetrics.responseTime) / 
      Math.max(userMetrics.responseTime, candidateMetrics.responseTime);
    
    const messageLengthComp = 1 - Math.abs(userMetrics.messageLength - candidateMetrics.messageLength) / 
      Math.max(userMetrics.messageLength, candidateMetrics.messageLength);
    
    const activeTimeComp = 1 - Math.abs(userMetrics.dailyActiveTime - candidateMetrics.dailyActiveTime) / 
      Math.max(userMetrics.dailyActiveTime, candidateMetrics.dailyActiveTime);

    return (responseTimeComp + messageLengthComp + activeTimeComp) / 3;
  }

  // Calculate overall compatibility score
  async calculateCompatibilityScore(user, candidate) {
    // Check deal breakers first
    const dealBreakers = user.preferences?.dealBreakers || [];
    const candidateTraits = new Set(candidate.personalityTraits.map(t => t.trait));
    if (dealBreakers.some(trait => candidateTraits.has(trait))) {
      return 0;
    }

    // Check must-have interests
    const mustHave = user.preferences?.mustHaveInterests || [];
    if (mustHave.length > 0 && !mustHave.some(interest => candidate.interests.includes(interest))) {
      return 0;
    }

    // Calculate individual scores
    const interestScore = this.calculateInterestSimilarity(user.interests, candidate.interests);
    const personalityScore = this.calculatePersonalityCompatibility(
      user.personalityTraits,
      candidate.personalityTraits
    );
    const locationScore = this.calculateLocationScore(
      user.coordinates,
      candidate.coordinates,
      user.preferences?.maxDistance || 50
    );
    const engagementScore = this.calculateEngagementCompatibility(
      user.activityMetrics,
      candidate.activityMetrics
    );

    // Weighted average of all scores
    const weights = {
      interests: 0.3,
      personality: 0.3,
      location: 0.2,
      engagement: 0.2
    };

    return (
      interestScore * weights.interests +
      personalityScore * weights.personality +
      locationScore * weights.location +
      engagementScore * weights.engagement
    );
  }

  // Find best match for a user
  async findBestMatch(userId) {
    const user = await userService.getUserById(userId);
    if (!user) throw new Error('User not found');

    // Get all potential matches
    const potentialMatches = await userService.getPotentialMatches(userId);
    
    // Calculate compatibility scores
    const scoredMatches = await Promise.all(
      potentialMatches.map(async candidate => ({
        candidate,
        score: await this.calculateCompatibilityScore(user, candidate)
      }))
    );

    // Sort by score and get the best match
    const bestMatches = scoredMatches
      .filter(match => match.score > 0.5) // Minimum compatibility threshold
      .sort((a, b) => b.score - a.score);

    return bestMatches.length > 0 ? {
      match: bestMatches[0].candidate,
      score: bestMatches[0].score
    } : null;
  }
}

module.exports = new CompatibilityService();
