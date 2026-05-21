import { create } from 'zustand';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

let socket = null;

const useChatStore = create((set, get) => ({
  socket: null,
  activeChannel: 'general',
  messages: [],
  onlineUsers: [],
  typingUsers: [],

  connect: (user) => {
    if (!socket) {
      socket = io(SOCKET_URL);
      
      socket.on('connect', () => {
        socket.emit('user_connected', user);
        socket.emit('join_channel', get().activeChannel);
      });

      socket.on('channel_history', (history) => {
        set({ messages: history });
      });

      socket.on('receive_message', (message) => {
        set((state) => ({ messages: [...state.messages, message] }));
      });

      socket.on('online_users', (users) => {
        set({ onlineUsers: users });
      });

      socket.on('user_typing', ({ user: typingUser, isTyping }) => {
        set((state) => {
          const newTyping = new Set(state.typingUsers);
          if (isTyping) {
            newTyping.add(typingUser);
          } else {
            newTyping.delete(typingUser);
          }
          return { typingUsers: Array.from(newTyping) };
        });
      });

      set({ socket });
    }
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      set({ socket: null });
    }
  },

  setActiveChannel: (channelId) => {
    set({ activeChannel: channelId, messages: [] }); // clear messages until history loads
    if (socket) {
      socket.emit('join_channel', channelId);
    }
  },

  sendMessage: (content, user) => {
    if (socket) {
      const messageData = {
        channelId: get().activeChannel,
        message: {
          content,
          sender: user.name,
          avatar: `https://i.pravatar.cc/150?u=${user.id || 'demo'}`,
        }
      };
      socket.emit('send_message', messageData);
    }
  },

  setTyping: (isTyping, user) => {
    if (socket) {
      socket.emit('typing', {
        channelId: get().activeChannel,
        user: user.name,
        isTyping,
      });
    }
  }
}));

export default useChatStore;
