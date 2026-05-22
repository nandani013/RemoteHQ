import React from 'react';
import { Skeleton } from '../../ui/Skeleton';

/**
 * Skeleton UI for a kanban board while loading columns and tasks.
 * Shows 3 placeholder columns, each with 4 placeholder task cards.
 */
export function KanbanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {[...Array(3)].map((_, colIdx) => (
        <div key={colIdx} className="flex flex-col space-y-2">
          {/* Column header */}
          <Skeleton className="h-6 w-3/4 mb-4" />
          {/* Placeholder cards */}
          {[...Array(4)].map((_, cardIdx) => (
            <Skeleton key={cardIdx} className="h-12 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}
