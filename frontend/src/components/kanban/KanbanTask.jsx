import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns';
import { Clock, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

export function KanbanTask({ task, index }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "group relative flex flex-col gap-3 p-4 mb-3 rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md",
            snapshot.isDragging ? "shadow-lg ring-2 ring-primary border-transparent opacity-90" : "border-border"
          )}
        >
          {/* Drag Handle Icon (visible on hover) */}
          <div className="absolute top-3 right-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical size={16} />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 pr-6">
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border", getPriorityColor(task.priority))}>
              {task.priority}
            </span>
          </div>

          {/* Content */}
          <p className="text-sm font-medium leading-relaxed text-foreground">
            {task.content}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-1 pt-3 border-t border-border/50">
            {/* Due Date */}
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              isOverdue ? "text-red-500" : "text-muted-foreground"
            )}>
              <Clock size={14} />
              <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No date'}</span>
            </div>

            {/* Assignees */}
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex -space-x-2 overflow-hidden">
                {task.assignees.map((avatar, i) => (
                  <img
                    key={i}
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-background"
                    src={avatar}
                    alt="Assignee"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
