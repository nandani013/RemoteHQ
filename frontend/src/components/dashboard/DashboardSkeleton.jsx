import React from 'react';
import { Skeleton } from '../../ui/Skeleton';
import { motion } from 'framer-motion';

export function DashboardSkeleton() {
  return (
    <motion.div className="space-y-6 pb-12" initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Skeleton className="lg:col-span-4 h-80" />
        <Skeleton className="lg:col-span-3 h-80" />
      </div>

      {/* Widgets Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </motion.div>
  );
}
