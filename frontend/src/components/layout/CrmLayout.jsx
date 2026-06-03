import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useThemeStore } from '../../store/useThemeStore';
import { LayoutDashboard, Briefcase, MessageSquare, Settings, Users, UserCheck, KanbanSquare, Ticket } from 'lucide-react';

const crmNavItems = [
  { name: 'CRM Dashboard', href: '/crm', icon: LayoutDashboard },
  { name: 'Leads', href: '/crm/leads', icon: Users },
  { name: 'Customers', href: '/crm/customers', icon: UserCheck },
  { name: 'Deals Pipeline', href: '/crm/deals', icon: KanbanSquare },
  { name: 'Support Tickets', href: '/crm/tickets', icon: Ticket },
  { name: 'Messages', href: '/crm/messages', icon: MessageSquare },
  { name: 'Settings', href: '/crm/settings', icon: Settings },
  { name: 'Sales Automation', href: '/crm/sales-automation', icon: Briefcase },
  { name: 'Pre‑Call Summary', href: '/crm/pre-call-summary', icon: LayoutDashboard },
  { name: 'Conversation Insights', href: '/crm/conversation-insights', icon: MessageSquare },
  { name: 'Task Automation', href: '/crm/task-automation', icon: Ticket },
  { name: 'Recommendations', href: '/crm/recommendations', icon: Users },
  { name: 'Email Generator', href: '/crm/email-generator', icon: Users }
];;

export function CrmLayout() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30">
      <Sidebar navItems={crmNavItems} basePath="/crm" />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none -z-10"></div>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
