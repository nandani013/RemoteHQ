import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * A reusable glassmorphism styled card component.
 * It wraps any children and provides a semi‑transparent background with a backdrop blur.
 */
export function GlassCard({ children, className, ...props }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      className={cn(
        'relative bg-card/30 backdrop-blur-xl border border-border/30 rounded-xl shadow-sm overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
