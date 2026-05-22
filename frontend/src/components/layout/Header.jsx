import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Sun, Moon, LogOut, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dummyNotifications = [
    { id: 1, type: 'message', text: 'Sarah left a comment on your task', time: '5m ago', icon: MessageSquare, color: 'text-blue-500' },
    { id: 2, type: 'task', text: 'Project Alpha deployed successfully', time: '1h ago', icon: CheckCircle, color: 'text-emerald-500' },
    { id: 3, type: 'alert', text: 'Server CPU usage is high', time: '2h ago', icon: AlertTriangle, color: 'text-amber-500' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border/30 bg-glass/60 backdrop-blur-xl sticky top-0 z-20 shadow-lg">
      <div className="flex items-center flex-1">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-full rounded-md border border-input bg-background/70 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 animate-spin" /> : <Moon className="h-5 w-5" />}
        </button>
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background animate-pulse" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-background border border-border shadow-2xl rounded-xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <span className="text-xs text-primary cursor-pointer hover:underline">Mark all as read</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {dummyNotifications.map(notif => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className="p-4 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3">
                        <div className={`mt-0.5 ${notif.color}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm text-foreground/90">{notif.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 text-center border-t border-border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
                  <span className="text-sm font-medium text-primary">View all notifications</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-medium">{user?.name || 'Jane Doe'}</span>
            <span className="text-xs text-muted-foreground">{user?.email || 'jane@example.com'}</span>
          </div>
          <div className="relative h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary ring-2 ring-primary/50">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'J'}
          </div>
          <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-destructive transition-colors ml-2">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
