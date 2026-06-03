import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, Target, ArrowUpRight, Zap, Users } from 'lucide-react';

export default function SalesAutomationDashboard() {
  const metrics = [
    {
      title: "Manual Updates Reduced",
      value: "84%",
      trend: "+12%",
      description: "Less time spent on CRM data entry",
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Sales Productivity",
      value: "2.4x",
      trend: "+0.8x",
      description: "Increase in meetings held per rep",
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    },
    {
      title: "Follow-up Consistency",
      value: "99.2%",
      trend: "+15%",
      description: "Emails sent within 1hr of meeting",
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      title: "Conversion Rate",
      value: "32%",
      trend: "+8.4%",
      description: "Lead to closed-won win rate",
      icon: Target,
      color: "text-primary",
      bg: "bg-primary/10"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Outcomes</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Track the real-time ROI of your AI Sales Automation suite. Monitor how automated insights are driving productivity and revenue.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-green-500 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
          <TrendingUp size={16} />
          System Performing Optimally
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none ${metric.color}`}>
                <Icon size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg} ${metric.color}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full">
                    {metric.trend}
                    <ArrowUpRight size={12} />
                  </div>
                </div>
                <h3 className="text-4xl font-black text-foreground mb-1 tracking-tight">{metric.value}</h3>
                <h4 className="text-sm font-semibold text-foreground/80 mb-2 uppercase tracking-wider">{metric.title}</h4>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
      >
        <div className="bg-card rounded-2xl p-6 border shadow-lg">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <Users className="text-primary w-5 h-5" />
            <h3 className="font-semibold text-foreground">Top Performing Reps (AI Assisted)</h3>
          </div>
          <div className="space-y-4">
            {[
              { name: "Sarah Jenkins", value: "45 Tasks Auto-created", score: 98 },
              { name: "Michael Chen", value: "32 Drafts Sent", score: 94 },
              { name: "Emma Watson", value: "28 Insights Used", score: 89 },
            ].map((rep, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div>
                  <h4 className="font-medium text-foreground">{rep.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{rep.value}</p>
                </div>
                <div className="text-sm font-bold text-primary">{rep.score}% utilization</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-pulse">
              <TrendingUp size={40} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Ready to Scale</h3>
            <p className="text-muted-foreground max-w-sm">
              Your AI Sales Automation is currently running optimally. Continue uploading transcripts and generating emails to track long-term ROI.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
