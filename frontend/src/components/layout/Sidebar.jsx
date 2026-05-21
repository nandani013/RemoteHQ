import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, MessageSquare, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import useSidebarStore from '../../store/useSidebarStore';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Projects', href: '/dashboard/projects', icon: Briefcase },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="border-r border-border bg-card text-card-foreground flex-shrink-0 hidden md:flex flex-col glass-panel z-10 relative"
    >
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-border border border-muted text-muted-foreground hover:text-foreground rounded-full p-1 z-20 shadow-sm"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="h-16 flex items-center px-6 border-b border-border overflow-hidden">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary min-w-[200px]">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <LayoutDashboard size={20} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                RemoteHQ
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <nav className="flex-1 py-4 flex flex-col gap-1 overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 mx-3 py-2 rounded-md text-sm font-medium transition-colors relative group',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
              <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md border border-border">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border overflow-hidden">
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, display: 'none' }}
              className="p-4 rounded-xl bg-accent/50 border border-border whitespace-nowrap"
            >
              <p className="text-sm font-medium mb-1">Upgrade to Pro</p>
              <p className="text-xs text-muted-foreground mb-3">Get access to all features.</p>
              <button className="w-full text-xs bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors">
                Upgrade
              </button>
            </motion.div>
          ) : (
            <div className="flex justify-center mt-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold cursor-pointer hover:bg-primary/30 transition-colors" title="Upgrade to Pro">
                🚀
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
