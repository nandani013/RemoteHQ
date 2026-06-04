import React, { useEffect, useState, useRef } from 'react';
import { Hash, Search, Send, UserPlus, MoreVertical, Hash as HashIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import { format } from 'date-fns';

const channels = [
  { id: 'general', name: 'general' },
  { id: 'engineering', name: 'engineering' },
  { id: 'design', name: 'design' },
];

export function Messages() {
  const { user } = useAuthStore();
  const { 
    connect, disconnect, activeChannel, setActiveChannel, 
    messages, sendMessage, setTyping, typingUsers, onlineUsers 
  } = useChatStore();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Connect on mount
  useEffect(() => {
    if (user) {
      connect(user);
    }
    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const sender = user || { name: 'Demo User', id: 'demo' };
      sendMessage(inputValue.trim(), sender);
      setInputValue('');
      setTyping(false, sender);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    
    const sender = user || { name: 'Demo User', id: 'demo' };
    setTyping(true, sender);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false, sender);
    }, 2000);
  };

  const otherTypingUsers = typingUsers.filter(u => u !== user?.name);

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-xl border border-border bg-background overflow-hidden shadow-sm">
      
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-muted/20 flex flex-col shrink-0">
        <div className="h-14 border-b border-border flex items-center px-4 font-semibold shadow-sm z-10">
          RemoteHQ Team
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Channels */}
          <div>
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Channels</h3>
            <div className="space-y-0.5">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                    activeChannel === channel.id 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <HashIcon size={16} />
                  {channel.name}
                </button>
              ))}
            </div>
          </div>

          {/* Online Users */}
          <div>
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Online</h3>
            <div className="space-y-0.5">
              {onlineUsers.map((onlineUser, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
                  <div className="relative">
                    <img src={`https://i.pravatar.cc/150?u=${onlineUser}`} className="w-5 h-5 rounded-full" alt="avatar" />
                    <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-green-500 border border-background"></span>
                  </div>
                  <span className="truncate">{onlineUser} {onlineUser === user?.name && "(you)"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        
        {/* Chat Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0 bg-card/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 font-semibold">
            <Hash size={20} className="text-muted-foreground" />
            {activeChannel}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <button className="hover:text-foreground transition-colors p-1"><UserPlus size={18} /></button>
            <button className="hover:text-foreground transition-colors p-1"><Search size={18} /></button>
            <button className="hover:text-foreground transition-colors p-1"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Hash size={48} className="mb-4 opacity-20" />
              <p>Welcome to #{activeChannel}!</p>
              <p className="text-sm">This is the start of the channel history.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.sender === user?.name;
              const showHeader = index === 0 || messages[index - 1].sender !== msg.sender || 
                (new Date(msg.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 5 * 60000);

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={cn("flex gap-4 group", !showHeader && "mt-1")}
                >
                  {showHeader ? (
                    <img src={msg.avatar} alt={msg.sender} className="w-10 h-10 rounded-lg shrink-0 mt-0.5 object-cover" />
                  ) : (
                    <div className="w-10 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-muted-foreground">{format(new Date(msg.timestamp), 'HH:mm')}</span>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0 flex flex-col">
                    {showHeader && (
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-sm">{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(msg.timestamp), 'h:mm a')}</span>
                      </div>
                    )}
                    <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 shrink-0 bg-background">
          {otherTypingUsers.length > 0 && (
            <div className="text-xs text-muted-foreground mb-2 px-2 flex items-center gap-2 h-4">
              <span className="flex space-x-1">
                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }} className="w-1.5 h-1.5 bg-primary rounded-full"></motion.span>
                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full"></motion.span>
                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full"></motion.span>
              </span>
              <span>{otherTypingUsers.join(', ')} {otherTypingUsers.length === 1 ? 'is' : 'are'} typing...</span>
            </div>
          )}
          <form 
            onSubmit={handleSendMessage}
            className="flex items-end gap-2 bg-muted/40 border border-border rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all"
          >
            <div className="flex-1 max-h-32 overflow-y-auto">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={`Message #${activeChannel}`}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm px-2 py-2"
                autoComplete="off"
              />
            </div>
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shrink-0"
            >
              <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
            </button>
          </form>
          <div className="text-[10px] text-muted-foreground mt-2 text-center">
            <strong>Pro tip:</strong> Press <kbd className="font-mono bg-muted px-1 rounded">Enter</kbd> to send.
          </div>
        </div>

      </div>
    </div>
  );
}
