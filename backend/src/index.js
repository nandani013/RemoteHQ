require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const initNotifications = require('./sockets/notifications');

const authRoutes = require('./routes/auth.routes');

const app = express();
const server = http.createServer(app);



// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
initNotifications(io);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// In-memory data for the demo
const onlineUsers = new Set();
const channelMessages = {
  general: [],
  engineering: [],
  design: [],
};

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('user_connected', (user) => {
    socket.user = user;
    onlineUsers.add(user.name);
    io.emit('online_users', Array.from(onlineUsers));
  });

  socket.on('join_channel', (channelId) => {
    // Leave previous rooms
    Array.from(socket.rooms).forEach(room => {
      if (room !== socket.id) socket.leave(room);
    });
    
    socket.join(channelId);
    
    // Send message history for this channel
    socket.emit('channel_history', channelMessages[channelId] || []);
  });

  socket.on('send_message', (data) => {
    const { channelId, message } = data;
    const msg = {
      id: Math.random().toString(36).substring(7),
      ...message,
      timestamp: new Date().toISOString()
    };
    
    if (!channelMessages[channelId]) {
      channelMessages[channelId] = [];
    }
    
    channelMessages[channelId].push(msg);
    // Keep only last 100 messages in memory
    if (channelMessages[channelId].length > 100) {
      channelMessages[channelId].shift();
    }

    io.to(channelId).emit('receive_message', msg);
  });

  socket.on('typing', ({ channelId, user, isTyping }) => {
    socket.to(channelId).emit('user_typing', { user, isTyping });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    if (socket.user) {
      onlineUsers.delete(socket.user.name);
      io.emit('online_users', Array.from(onlineUsers));
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
