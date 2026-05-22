const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt');

// Export a function to attach the notifications namespace
module.exports = (io) => {
  const nsp = io.of('/notifications');

  // Middleware to verify JWT on connection
  nsp.use((socket, next) => {
    const token = socket.handshake.query.token || socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const payload = verifyToken(token);
      socket.user = payload; // attach decoded token payload
      return next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  const onlineUsers = new Set();

  nsp.on('connection', (socket) => {
    const userId = socket.user.id;
    onlineUsers.add(userId);
    // Emit presence update to all connected clients
    nsp.emit('presence', Array.from(onlineUsers));

    // Listener for task assignment
    socket.on('assignTask', ({ task }) => {
      const targetId = task.assigneeId;
      nsp.to(targetId.toString()).emit('notification', {
        type: 'task',
        title: 'New Task Assigned',
        message: `You have been assigned task: ${task.title}`,
        timestamp: new Date().toISOString(),
        data: task,
      });
    });

    // Listener for meeting reminder
    socket.on('meetingReminder', ({ meeting }) => {
      const participants = meeting.participantIds || [];
      participants.forEach((pid) => {
        nsp.to(pid.toString()).emit('notification', {
          type: 'meeting',
          title: 'Meeting Reminder',
          message: `Upcoming meeting: ${meeting.title} at ${meeting.time}`,
          timestamp: new Date().toISOString(),
          data: meeting,
        });
      });
    });

    // Listener for chat messages (broadcast to room based on chatId)
    socket.on('chatMessage', ({ chatId, message }) => {
      nsp.to(`chat_${chatId}`).emit('notification', {
        type: 'chat',
        title: 'New Message',
        message: message.content,
        timestamp: new Date().toISOString(),
        data: { chatId, ...message },
      });
    });

    // Join user‑specific room for direct notifications
    socket.join(userId.toString());

    // Optional: let client join chat rooms separately via an event
    socket.on('joinChat', ({ chatId }) => {
      socket.join(`chat_${chatId}`);
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      nsp.emit('presence', Array.from(onlineUsers));
    });
  });
};
