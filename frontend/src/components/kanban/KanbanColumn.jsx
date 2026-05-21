import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { KanbanTask } from './KanbanTask';
import { MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import useKanbanStore from '../../store/useKanbanStore';

export function KanbanColumn({ column, tasks, index }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const setColumnTitle = useKanbanStore(state => state.setColumnTitle);

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      setColumnTitle(column.id, title.trim());
    } else {
      setTitle(column.title); // revert if empty
    }
    setIsEditingTitle(false);
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "flex flex-col bg-muted/30 border border-border rounded-xl w-80 shrink-0 max-h-full",
            snapshot.isDragging && "opacity-80 ring-2 ring-primary"
          )}
        >
          {/* Column Header */}
          <div 
            {...provided.dragHandleProps}
            className="flex items-center justify-between p-4 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2 flex-1">
              {isEditingTitle ? (
                <form onSubmit={handleTitleSubmit} className="flex-1">
                  <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleSubmit}
                    className="w-full bg-background border border-primary/50 rounded px-2 py-1 text-sm font-semibold outline-none ring-2 ring-primary/20"
                  />
                </form>
              ) : (
                <h3 
                  onClick={() => setIsEditingTitle(true)}
                  className="font-semibold text-sm hover:text-primary transition-colors cursor-pointer"
                >
                  {column.title}
                </h3>
              )}
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {tasks.length}
              </span>
            </div>
            <button className="p-1 hover:bg-accent rounded-md text-muted-foreground transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Droppable Area for Tasks */}
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "flex-1 overflow-y-auto px-3 pb-3 min-h-[150px] transition-colors",
                  snapshot.isDraggingOver && "bg-primary/5"
                )}
              >
                {tasks.map((task, index) => (
                  <KanbanTask key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
                
                {/* Add Task Button (mock) */}
                <button className="w-full flex items-center gap-2 p-2 mt-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                  <Plus size={16} />
                  Add Task
                </button>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
