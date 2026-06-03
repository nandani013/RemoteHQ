import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, MessageSquare, ListTodo, Lightbulb, PenLine, Sparkles, Bell, X, LayoutDashboard } from 'lucide-react';
import io from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const tabs = [
  { to: '', label: 'Dashboard', icon: LayoutDashboard, color: "text-purple-500", exact: true },
  { to: 'pre-call-summary', label: 'Pre‑Call', icon: PhoneCall, color: "text-primary" },
  { to: 'conversation-insights', label: 'Insights', icon: MessageSquare, color: "text-indigo-500" },
  { to: 'task-automation', label: 'Tasks', icon: ListTodo, color: "text-green-500" },
  { to: 'recommendations', label: 'Next Best Action', icon: Lightbulb, color: "text-yellow-500" },
  { to: 'email-generator', label: 'Email', icon: PenLine, color: "text-blue-500" },
];

export default function SalesAutomation() {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(API_BASE);

    socket.on('connect', () => {
      console.log('Connected to real-time sales automation notifications');
    });

    socket.on('sales_automation_notification', (data) => {
      console.log('Received notification:', data);
      
      const newNotification = {
        id: Date.now().toString(),
        ...data
      };
      
      setNotifications(prev => [newNotification, ...prev].slice(0, 5)); // Keep only last 5

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 6000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* Global Real-time Notifications */}
      <div className="fixed top-20 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="bg-card/90 backdrop-blur-xl border border-primary/20 shadow-2xl p-4 rounded-xl w-80 pointer-events-auto flex gap-4 items-start relative group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                <Bell size={20} className="animate-pulse" />
              </div>
              <div className="flex-1 pr-6">
                <h4 className="font-semibold text-sm text-foreground mb-1">
                  {notif.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {notif.message}
                </p>
              </div>
              <button 
                onClick={() => dismissNotification(notif.id)}
                className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-lg border p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Sales Automation Suite</h1>
              <p className="text-muted-foreground mt-1">Accelerate your sales process with AI-powered workflows.</p>
            </div>
          </div>
          
          {/* Navigation Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-muted/30 p-1.5 rounded-xl border w-full md:w-auto">
            {tabs.map((tab) => {
              const isActive = tab.exact 
                ? location.pathname.endsWith('/sales-automation') || location.pathname.endsWith('/sales-automation/')
                : location.pathname.includes(tab.to);
              
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.label}
                  to={tab.to}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive ? "text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sales-automation-active-tab"
                      className="absolute inset-0 bg-background border rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={16} className={isActive ? tab.color : ""} />
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Content Outlet with Animation Wrapper */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <Outlet />
        </motion.div>
        
      </div>
    </div>
  );
}
