import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import useKanbanStore from '../../store/useKanbanStore';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export function KanbanBoard() {
  const { tasks, columns, columnOrder, onDragEnd } = useKanbanStore();

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Board</h2>
          <p className="text-muted-foreground mt-1">Manage your team's tasks and workflow.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['sarah', 'marcus', 'elena'].map((name, i) => (
              <img key={i} src={`https://i.pravatar.cc/150?u=${name}`} className="w-8 h-8 rounded-full ring-2 ring-background border border-border" alt={name} />
            ))}
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium ring-2 ring-background border border-border">+3</div>
          </div>
          <Button variant="outline" className="hidden sm:flex">Filter</Button>
          <Button className="gap-2">
            <Plus size={16} /> New Task
          </Button>
        </div>
      </div>

      {/* Board Scroll Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex gap-6 h-full items-start"
              >
                {columnOrder.map((columnId, index) => {
                  const column = columns[columnId];
                  const columnTasks = column.taskIds.map(taskId => tasks[taskId]);

                  return (
                    <KanbanColumn 
                      key={column.id} 
                      column={column} 
                      tasks={columnTasks} 
                      index={index} 
                    />
                  );
                })}
                {provided.placeholder}
                
                {/* Add Column Button (Mock) */}
                <button className="flex items-center gap-2 w-80 shrink-0 p-4 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:border-primary/50 transition-colors">
                  <Plus size={20} />
                  <span className="font-medium">Add Column</span>
                </button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
