const userService = require('../../features/user/user.service');
const matchService = require('../../features/match/match.service');
const chatService = require('../../features/chat/chat.service');

const seedUsers = [
  {
    email: 'test@lonetown.com',
    password: '123456',
    name: 'Alex Thompson',
    age: 28,
    bio: 'Mindful soul seeking genuine connections. Love hiking, meditation, and deep conversations under starlit skies.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    interests: ['Hiking', 'Meditation', 'Photography', 'Cooking', 'Reading'],
    location: 'San Francisco, CA'
  },
  {
    email: 'sarah@lonetown.com',
    password: '123456',
    name: 'Sarah Chen',
    age: 26,
    bio: 'Artist and dreamer who finds beauty in everyday moments. Passionate about sustainable living and creative expression.',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    interests: ['Art', 'Sustainability', 'Yoga', 'Travel', 'Music'],
    location: 'Portland, OR'
  },
  {
    email: 'mike@lonetown.com',
    password: '123456',
    name: 'Michael Rodriguez',
    age: 30,
    bio: 'Tech enthusiast with a love for outdoor adventures. Believe in work-life balance and meaningful relationships.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    interests: ['Technology', 'Rock Climbing', 'Coffee', 'Podcasts', 'Gaming'],
    location: 'Austin, TX'
  },
  {
    email: 'emma@lonetown.com',
    password: '123456',
    name: 'Emma Wilson',
    age: 27,
    bio: 'Wellness coach who believes in authentic connections. Love morning runs, healthy cooking, and inspiring others.',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    interests: ['Fitness', 'Nutrition', 'Mindfulness', 'Dancing', 'Writing'],
    location: 'Denver, CO'
  },
  {
    email: 'david@lonetown.com',
    password: '123456',
    name: 'David Kim',
    age: 29,
    bio: 'Musician and storyteller seeking someone who appreciates life\'s simple pleasures and deep conversations.',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    interests: ['Music', 'Storytelling', 'Philosophy', 'Wine', 'Literature'],
    location: 'Seattle, WA'
  }
];

const seedMessages = [
  "Hey! I love your profile. Your passion for mindful living really resonates with me.",
  "Thank you! I noticed you're into hiking too. What's your favorite trail?",
  "I absolutely love the trails around Mount Tamalpais. The sunrise views are incredible!",
  "That sounds amazing! I've been wanting to explore more Bay Area trails.",
  "We should definitely plan a hike together sometime. I know some hidden gems!",
  "I'd love that! Do you prefer sunrise or sunset hikes?",
  "Sunrise hikes are magical, but I'm not always great at waking up early 😅",
  "Haha, I totally understand! Sunset hikes have their own charm too.",
  "What got you into meditation? I've been trying to build a consistent practice.",
  "It started during a stressful period at work. Now it's become essential for my well-being.",
  "That's inspiring. Any tips for someone just starting out?",
  "Start small - even 5 minutes daily makes a difference. Apps like Headspace helped me initially.",
  "I'll definitely try that. Your approach to mindful living is really refreshing.",
  "Thank you! I believe authentic connections start with being authentic with ourselves.",
  "Couldn't agree more. It's rare to find someone who values depth over surface-level interactions."
];

const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Create users
    const createdUsers = [];
    for (const userData of seedUsers) {
      try {
        const existingUser = await userService.getUserByEmail(userData.email);
        if (!existingUser) {
          const user = await userService.createUser(userData);
          createdUsers.push(user);
          console.log(`✅ Created user: ${user.name}`);
        } else {
          createdUsers.push(existingUser);
          console.log(`📝 User already exists: ${existingUser.name}`);
        }
      } catch (error) {
        console.log(`⚠️ Error creating user ${userData.name}:`, error.message);
      }
    }

    // Create matches for test user
    if (createdUsers.length >= 2) {
      const testUser = createdUsers.find(u => u.email === 'test@lonetown.com');
      const sarahUser = createdUsers.find(u => u.email === 'sarah@lonetown.com');
      
      if (testUser && sarahUser) {
        try {
          const existingMatch = await matchService.getActiveMatch(testUser.id);
          if (!existingMatch) {
            const match = await matchService.createMatch(testUser.id, sarahUser.id);
            console.log('✅ Created match between Alex and Sarah');

            // Seed some messages
            for (let i = 0; i < Math.min(15, seedMessages.length); i++) {
              const senderId = i % 2 === 0 ? testUser.id : sarahUser.id;
              const receiverId = i % 2 === 0 ? sarahUser.id : testUser.id;
              
              await chatService.sendMessage(
                match.id,
                senderId,
                receiverId,
                seedMessages[i]
              );
            }
            console.log('✅ Seeded chat messages');
          } else {
            console.log('📝 Match already exists for test user');
          }
        } catch (error) {
          console.log('⚠️ Error creating match:', error.message);
        }
      }
    }

    console.log('🎉 Data seeding completed!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

module.exports = seedData;