import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function KPICards({ itemVariants }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Total Revenue</h3>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">$45,231.89</div>
          <p className="mt-1 text-xs text-green-500 font-medium">+20.1% from last month</p>
        </GlassCard>
      </motion.div>

      {/* Active Users */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Active Users</h3>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">+2,350</div>
          <p className="mt-1 text-xs text-green-500 font-medium">+180.1% from last month</p>
        </GlassCard>
      </motion.div>

      {/* Sales */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Sales</h3>
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">+12,234</div>
          <p className="mt-1 text-xs text-red-500 font-medium">-2% from last month</p>
        </GlassCard>
      </motion.div>

      {/* Active Now */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Active Now</h3>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">+573</div>
          <p className="mt-1 text-xs text-green-500 font-medium">+201 since last hour</p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
