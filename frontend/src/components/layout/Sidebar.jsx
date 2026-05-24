import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, MessageSquare, Briefcase, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import useSidebarStore from '../../store/useSidebarStore';

export function Sidebar({ navItems = [], basePath = '/dashboard' }) {
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 82 : 260 }}
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
      className="border-r border-border/30 bg-card/30 text-card-foreground flex-shrink-0 hidden md:flex flex-col backdrop-blur-xl z-20 relative select-none"
    >
      {/* Collapse button with smooth hover */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="absolute -right-3.5 top-6 bg-background border border-border/50 text-muted-foreground hover:text-foreground rounded-xl p-1.5 z-30 shadow-md cursor-pointer transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </motion.button>

      {/* Header Logo */}
      <div className="h-16 flex items-center px-5.5 border-b border-border/20 overflow-hidden">
        <div className="flex items-center gap-3.5 font-extrabold text-xl tracking-tight text-primary min-w-[200px]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
            <LayoutDashboard size={18} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
              >
                Remote<span className="text-primary font-black">HQ</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Main Navigation Links */}
      <nav className="flex-1 py-6 flex flex-col gap-1.5 overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === basePath}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3.5 px-3.5 mx-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative group',
                isActive
                  ? 'bg-primary/10 text-primary border-l-2 border-primary shadow-[0_4px_16px_rgba(99,102,241,0.08)]'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50 shadow-xl border border-border/30 backdrop-blur-md">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Upgrade Callout Section */}
      <div className="p-4 border-t border-border/20 overflow-hidden">
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, display: 'none' }}
              className="p-5.5 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-indigo-500 text-white relative shadow-xl overflow-hidden group select-none"
            >
              {/* Decorative radial lighting sphere inside card */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles size={14} className="text-cyan-300 animate-pulse" />
                <p className="text-xs font-black uppercase tracking-wider text-cyan-200">PRO MEMBERSHIP</p>
              </div>
              <p className="text-sm font-bold leading-snug mb-1">Unlock Collaboration</p>
              <p className="text-[11px] text-indigo-100 mb-4 font-medium leading-normal">Get instant unlimited metrics boards, team roles & priority integrations.</p>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full text-xs bg-white text-indigo-600 py-2.5 rounded-xl font-extrabold hover:bg-zinc-50 transition-colors shadow-lg shadow-indigo-950/20 cursor-pointer"
              >
                Upgrade Now
              </motion.button>
            </motion.div>
          ) : (
            <div className="flex justify-center py-2 relative group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold cursor-pointer shadow-lg shadow-indigo-500/20" 
                title="Upgrade to Pro"
              >
                <Sparkles size={16} className="text-white" />
              </motion.div>
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50 shadow-xl border border-border/30">
                Upgrade to Pro 🚀
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

