import React from 'react';

/**
 * Generic skeleton block used for loading placeholders.
 * Uses Tailwind's `animate-pulse` with a subtle gradient for a modern shimmer effect.
 * Accepts optional `className` to control width, height, border radius, etc.
 */
export function Skeleton({ className = 'h-4 w-full' }) {
  return (
    <div
      className={`bg-gray-300 dark:bg-gray-700 rounded ${className} animate-pulse`}
    />
  );
}
