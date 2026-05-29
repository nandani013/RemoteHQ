import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { erpApi } from '../lib/erpApi';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const COLUMNS = [
  { id: 'PLANNING', title: 'Planning' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'COMPLETED', title: 'Completed' },
];

export function Projects() {
  const queryClient = useQueryClient();
  const { data: projects, isLoading, isError } = useQuery({ queryKey: ['erp-projects'], queryFn: erpApi.getProjects });

  const updateMutation = useMutation({
    mutationFn: erpApi.updateProjectStatus,
    onMutate: async (updatedProject) => {
      await queryClient.cancelQueries({ queryKey: ['erp-projects'] });
      const previous = queryClient.getQueryData(['erp-projects']);
      queryClient.setQueryData(['erp-projects'], old => 
        old.map(p => p.id === updatedProject.id ? { ...p, status: updatedProject.status } : p)
      );
      return { previous };
    },
    onError: (err, newProj, context) => {
      queryClient.setQueryData(['erp-projects'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['erp-projects'] });
    }
  });

  const getProjectsByStatus = (status) => {
    return projects?.filter(p => p.status === status) || [];
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    updateMutation.mutate({ id: draggableId, status: destination.droppableId });
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading projects...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error loading projects.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1">Manage project delivery across your organization.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {COLUMNS.map((col) => {
              const colProjects = getProjectsByStatus(col.id);

              return (
                <div key={col.id} className="w-80 shrink-0 h-full flex flex-col bg-card/50 backdrop-blur-sm rounded-2xl border shadow-sm overflow-hidden">
                  <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                    <h3 className="font-semibold">{col.title}</h3>
                    <span className="text-xs font-medium bg-background px-2 py-0.5 rounded-full border">
                      {colProjects.length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto p-4 flex flex-col gap-3 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                      >
                        {colProjects.map((proj, index) => (
                          <Draggable key={proj.id} draggableId={proj.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-card p-4 rounded-xl shadow-sm border transition-all ${
                                  snapshot.isDragging ? 'shadow-lg ring-2 ring-primary rotate-2 scale-105' : 'hover:border-primary/30'
                                }`}
                                style={{ ...provided.draggableProps.style }}
                              >
                                <h4 className="font-medium text-sm mb-2">{proj.name}</h4>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-muted-foreground">Manager: {proj.manager?.name || 'Unassigned'}</span>
                                  <span className="text-xs font-semibold text-emerald-500">${proj.budget?.toLocaleString()}</span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
