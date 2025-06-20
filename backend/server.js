require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const connectDB = require('./shared/config/database');
const { PORT, CLIENT_URL } = require('./shared/config/constants');
const seedData = require('./shared/utils/seedData');

// Import routes
const authRoutes = require('./features/auth/auth.routes');
const matchRoutes = require('./features/match/match.routes');
const chatRoutes = require('./features/chat/chat.routes');
const feedbackRoutes = require('./features/feedback/feedback.routes');

// Import services for socket handling
const chatService = require('./features/chat/chat.service');
const userService = require('./features/user/user.service');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// HTTP request logging
app.use(morgan('dev'));

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LoneTown API is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  socket.on('join', async (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Update user online status
    try {
      await userService.updateUserStatus(userId, true);
      socket.broadcast.emit('userOnline', userId);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  });

  socket.on('joinMatch', (matchId) => {
    socket.join(matchId);
    console.log(`👥 User ${socket.userId} joined match ${matchId}`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { matchId, receiverId, content, type = 'text' } = data;
      
      const message = await chatService.sendMessage(
        matchId,
        socket.userId,
        receiverId,
        content,
        type
      );

      // Emit to all users in the match
      io.to(matchId).emit('newMessage', message);
      
      // Emit to specific receiver if they're online
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('messageNotification', {
          matchId,
          senderId: socket.userId,
          content: content.substring(0, 50) + (content.length > 50 ? '...' : '')
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: error.message });
    }
  });

  socket.on('typing', (data) => {
    const { matchId, receiverId } = data;
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userTyping', {
        matchId,
        userId: socket.userId
      });
    }
  });

  socket.on('stopTyping', (data) => {
    const { matchId, receiverId } = data;
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userStoppedTyping', {
        matchId,
        userId: socket.userId
      });
    }
  });

  socket.on('disconnect', async () => {
    console.log('👤 User disconnected:', socket.id);
    
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      
      // Update user offline status
      try {
        await userService.updateUserStatus(socket.userId, false);
        socket.broadcast.emit('userOffline', socket.userId);
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    }
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Seed initial data
    setTimeout(async () => {
      await seedData();
    }, 1000);

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 LoneTown Server running on port ${PORT}`);
      console.log(`🌐 Client URL: ${CLIENT_URL}`);
      console.log(`📱 Socket.io enabled for real-time features`);
      console.log(`🔑 Test credentials: test@lonetown.com / 123456`);
    });

  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server, io };