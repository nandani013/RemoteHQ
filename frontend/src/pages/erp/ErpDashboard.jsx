import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { erpApi } from '../../lib/erpApi';
import { motion } from 'framer-motion';
import { Users, Briefcase, Clock, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function ErpDashboard() {
  const { data: employees, isLoading: empLoading, isError } = useQuery({ queryKey: ['employees'], queryFn: erpApi.getEmployees });
  const { data: projects, isLoading: projLoading } = useQuery({ queryKey: ['erp-projects'], queryFn: erpApi.getProjects });
  const { data: finance, isLoading: finLoading } = useQuery({ queryKey: ['finance'], queryFn: erpApi.getFinanceRecords });

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-500/10 text-red-500 p-6 rounded-xl border border-red-500/20 shadow-lg">
          <h2 className="text-xl font-bold mb-2">Database Connection Error</h2>
          <p>Please ensure PostgreSQL is running and the backend is connected to it.</p>
        </div>
      </div>
    );
  }

  const revenue = finance?.filter(r => r.type === 'REVENUE').reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const expenses = finance?.filter(r => r.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const activeProjects = projects?.filter(p => p.status !== 'COMPLETED').length || 0;

  const statCards = [
    { title: 'Total Employees', value: employees?.length || 0, icon: Users, color: 'from-blue-500/20 to-blue-600/10', textColor: 'text-blue-500' },
    { title: 'Active Projects', value: activeProjects, icon: Briefcase, color: 'from-emerald-500/20 to-emerald-600/10', textColor: 'text-emerald-500' },
    { title: 'Total Revenue', value: `$${revenue.toLocaleString()}`, icon: ArrowUpRight, color: 'from-amber-500/20 to-amber-600/10', textColor: 'text-amber-500' },
    { title: 'Total Expenses', value: `$${expenses.toLocaleString()}`, icon: ArrowDownRight, color: 'from-red-500/20 to-red-600/10', textColor: 'text-red-500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">ERP Dashboard</h1>
          <p className="text-muted-foreground mt-1">Global overview of resources, finances, and operations.</p>
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
                <h3 className="text-3xl font-bold">{empLoading || projLoading || finLoading ? '-' : stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-background/50 ${stat.textColor}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Projects */}
        <div className="bg-card rounded-2xl border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Active Projects</h2>
          </div>
          <div className="space-y-4">
            {projLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : projects?.filter(p => p.status !== 'COMPLETED').slice(0, 5).map((proj, i) => (
              <div key={proj.id} className="flex justify-between items-center p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                <div>
                  <h4 className="font-medium">{proj.name}</h4>
                  <p className="text-sm text-muted-foreground">Manager: {proj.manager?.name || 'Unassigned'}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {proj.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-card rounded-2xl border shadow-sm p-6">
           <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
           <div className="grid grid-cols-2 gap-4">
              <a href="/erp/attendance" className="p-6 flex flex-col items-center justify-center gap-3 rounded-xl border bg-gradient-to-b from-transparent to-muted/20 hover:border-primary/50 transition-colors group">
                <Clock className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium">Clock In/Out</span>
              </a>
              <a href="/erp/finance" className="p-6 flex flex-col items-center justify-center gap-3 rounded-xl border bg-gradient-to-b from-transparent to-muted/20 hover:border-primary/50 transition-colors group">
                <DollarSign className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium">Log Expense</span>
              </a>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
