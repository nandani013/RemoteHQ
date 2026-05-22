import React from 'react';
import { motion } from 'framer-motion';
import { ChartLine, TrendingUp, Users, CheckCircle } from 'lucide-react';

const kpis = [
  { icon: ChartLine, label: 'Revenue', value: '$1.2M', description: 'Increase YoY' },
  { icon: TrendingUp, label: 'Growth', value: '94%', description: 'Team velocity' },
  { icon: Users, label: 'Active Users', value: '8.3K', description: 'Daily active' },
  { icon: CheckCircle, label: 'Tasks Completed', value: '2.7K', description: 'This week' },
];

export function KPICards() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={i}
              className="glass-panel p-6 rounded-2xl border border-border/40 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <kpi.icon className="w-8 h-8 mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">{kpi.value}</h3>
              <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-xs text-muted-foreground/70">{kpi.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
