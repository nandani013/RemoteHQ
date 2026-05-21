import React from 'react';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { motion } from 'framer-motion';

export function Projects() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col"
    >
      <KanbanBoard />
    </motion.div>
  );
}
