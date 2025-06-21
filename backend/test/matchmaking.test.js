const connectDB = require('../shared/config/database');
const userService = require('../features/user/user.service');
const matchService = require('../features/match/match.service');
const compatibilityService = require('../features/match/compatibility.service');

// Test data
const testUsers = [
  {
    email: 'emma@test.com',
    password: '123456',
    name: 'Emma Wilson',
    age: 28,
    bio: 'Creative soul who loves art and mindful living',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    interests: ['art', 'yoga', 'mindfulness', 'reading', 'travel'],
    location: 'San Francisco, CA',
    coordinates: {
      type: 'Point',
      coordinates: [-122.419416, 37.774929] // San Francisco coordinates
    },
    preferences: {
      ageRange: { min: 25, max: 35 },
      maxDistance: 30,
      mustHaveInterests: ['art', 'mindfulness'],
      dealBreakers: ['smoking']
    },
    personalityTraits: [
      { trait: 'openness', score: 0.9 },
      { trait: 'conscientiousness', score: 0.7 },
      { trait: 'extraversion', score: 0.5 },
      { trait: 'agreeableness', score: 0.8 },
      { trait: 'neuroticism', score: 0.3 }
    ],
    activityMetrics: {
      responseTime: 5,
      messageLength: 120,
      dailyActiveTime: 180,
      engagementScore: 0.85
    }
  },
  {
    email: 'james@test.com',
    password: '123456',
    name: 'James Chen',
    age: 30,
    bio: 'Tech enthusiast with a passion for photography',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    interests: ['photography', 'technology', 'hiking', 'mindfulness', 'coffee'],
    location: 'San Francisco, CA',
    coordinates: {
      type: 'Point',
      coordinates: [-122.409416, 37.784929] // Close to Emma
    },
    preferences: {
      ageRange: { min: 25, max: 35 },
      maxDistance: 25,
      mustHaveInterests: ['photography', 'technology'],
      dealBreakers: ['smoking']
    },
    personalityTraits: [
      { trait: 'openness', score: 0.8 },
      { trait: 'conscientiousness', score: 0.8 },
      { trait: 'extraversion', score: 0.6 },
      { trait: 'agreeableness', score: 0.7 },
      { trait: 'neuroticism', score: 0.4 }
    ],
    activityMetrics: {
      responseTime: 8,
      messageLength: 100,
      dailyActiveTime: 160,
      engagementScore: 0.8
    }
  },
  {
    email: 'sophia@test.com',
    password: '123456',
    name: 'Sophia Rodriguez',
    age: 26,
    bio: 'Adventure seeker and nature lover',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    interests: ['hiking', 'travel', 'photography', 'yoga', 'cooking'],
    location: 'Oakland, CA',
    coordinates: {
      type: 'Point',
      coordinates: [-122.271114, 37.804363] // Oakland coordinates
    },
    preferences: {
      ageRange: { min: 25, max: 35 },
      maxDistance: 40,
      mustHaveInterests: ['hiking', 'travel'],
      dealBreakers: []
    },
    personalityTraits: [
      { trait: 'openness', score: 0.9 },
      { trait: 'conscientiousness', score: 0.6 },
      { trait: 'extraversion', score: 0.8 },
      { trait: 'agreeableness', score: 0.7 },
      { trait: 'neuroticism', score: 0.3 }
    ],
    activityMetrics: {
      responseTime: 10,
      messageLength: 90,
      dailyActiveTime: 200,
      engagementScore: 0.9
    }
  }
];

async function runMatchmakingTest() {
  console.log('🧪 Starting matchmaking algorithm test...\n');

  try {
    // Create test users
    const createdUsers = [];
    for (const userData of testUsers) {
      const user = await userService.createUser(userData);
      createdUsers.push(user);
      console.log(`✅ Created test user: ${user.name}`);
    }

    console.log('\n📊 Testing compatibility scores...');

    // Test compatibility between Emma and James
    const emmaJamesScore = await compatibilityService.calculateCompatibilityScore(
      createdUsers[0], // Emma
      createdUsers[1]  // James
    );
    console.log('\nEmma & James Compatibility:');
    console.log(`Overall Score: ${(emmaJamesScore * 100).toFixed(2)}%`);

    // Test compatibility between Emma and Sophia
    const emmaSophiaScore = await compatibilityService.calculateCompatibilityScore(
      createdUsers[0], // Emma
      createdUsers[2]  // Sophia
    );
    console.log('\nEmma & Sophia Compatibility:');
    console.log(`Overall Score: ${(emmaSophiaScore * 100).toFixed(2)}%`);

    // Test best match finder
    console.log('\n🎯 Testing best match finder...');
    const bestMatch = await compatibilityService.findBestMatch(createdUsers[0].id);
    console.log(`Best match for Emma: ${bestMatch.match.name}`);
    console.log(`Match Score: ${(bestMatch.score * 100).toFixed(2)}%`);

    // Create the match
    console.log('\n🤝 Creating match with best candidate...');
    const match = await matchService.createMatch(
      createdUsers[0].id,
      bestMatch.match.id
    );
    console.log('Match created successfully!');
    console.log(`Match ID: ${match.id}`);
    console.log(`Compatibility Score: ${(match.compatibilityScore * 100).toFixed(2)}%`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
console.log('🚀 Initializing test environment...');
connectDB().then(() => {
  runMatchmakingTest().then(() => {
    console.log('\n✨ Test completed!');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
}).catch(error => {
  console.error('❌ Database connection failed:', error);
  process.exit(1);
});
