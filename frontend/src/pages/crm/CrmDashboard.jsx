import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { crmApi } from '../../lib/api';
import { motion } from 'framer-motion';
import { Users, UserCheck, Ticket, Activity, TrendingUp } from 'lucide-react';

export function CrmDashboard() {
  const { data: leads, isLoading: leadsLoading, isError: leadsError } = useQuery({ queryKey: ['leads'], queryFn: crmApi.getLeads });
  const { data: customers, isLoading: custLoading } = useQuery({ queryKey: ['customers'], queryFn: crmApi.getCustomers });
  const { data: tickets, isLoading: ticketsLoading } = useQuery({ queryKey: ['tickets'], queryFn: crmApi.getTickets });
  const { data: activities, isLoading: actLoading } = useQuery({ queryKey: ['activities'], queryFn: crmApi.getActivities });

  if (leadsError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-500/10 text-red-500 p-6 rounded-xl border border-red-500/20 shadow-lg">
          <h2 className="text-xl font-bold mb-2">Database Connection Error</h2>
          <p>Please ensure PostgreSQL is running and the backend is connected to it.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Leads', value: leads?.length || 0, icon: Users, color: 'from-blue-500/20 to-blue-600/10', textColor: 'text-blue-500' },
    { title: 'Customers', value: customers?.length || 0, icon: UserCheck, color: 'from-emerald-500/20 to-emerald-600/10', textColor: 'text-emerald-500' },
    { title: 'Open Tickets', value: tickets?.filter(t => t.status !== 'CLOSED').length || 0, icon: Ticket, color: 'from-amber-500/20 to-amber-600/10', textColor: 'text-amber-500' },
    { title: 'Conversion Rate', value: leads?.length ? Math.round((customers?.length || 0) / (leads?.length || 1) * 100) + '%' : '0%', icon: TrendingUp, color: 'from-purple-500/20 to-purple-600/10', textColor: 'text-purple-500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">CRM Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your sales pipeline and customer relationships.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/5 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold">{leadsLoading || custLoading || ticketsLoading ? '-' : stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-background/50 ${stat.textColor}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-card rounded-2xl border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Recent Activities</h2>
          </div>
          <div className="space-y-4">
            {actLoading ? (
              <p className="text-muted-foreground">Loading activities...</p>
            ) : activities?.length === 0 ? (
              <p className="text-muted-foreground italic">No activities yet.</p>
            ) : (
              activities?.map((act, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={act.id} 
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">{act.description}</p>
                    <p className="text-sm text-muted-foreground">{new Date(act.createdAt).toLocaleString()}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-card rounded-2xl border shadow-sm p-6 flex flex-col justify-center items-center text-center space-y-4">
           <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
             <Users className="w-12 h-12 text-primary" />
           </div>
           <h3 className="text-lg font-semibold">Ready to grow?</h3>
           <p className="text-sm text-muted-foreground">Manage your leads and convert them to loyal customers using the deals pipeline.</p>
        </div>
      </div>
    </motion.div>
  );
}
