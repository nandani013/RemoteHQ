import React, { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '../../lib/api';
import { motion } from 'framer-motion';

const COLUMNS = [
  { id: 'NEW', title: 'New' },
  { id: 'CONTACTED', title: 'Contacted' },
  { id: 'PROPOSAL_SENT', title: 'Proposal Sent' },
  { id: 'NEGOTIATION', title: 'Negotiation' },
  { id: 'WON', title: 'Won' },
  { id: 'LOST', title: 'Lost' },
];

export function DealsPipeline() {
  const queryClient = useQueryClient();
  const { data: leads, isLoading, isError } = useQuery({ queryKey: ['leads'], queryFn: crmApi.getLeads });
  
  const updateMutation = useMutation({
    mutationFn: crmApi.updateLead,
    // Optimistic update
    onMutate: async (updatedLead) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });
      const previousLeads = queryClient.getQueryData(['leads']);
      queryClient.setQueryData(['leads'], old => {
        if (!Array.isArray(old)) return [];
        return old.map(lead => lead.id === updatedLead.id ? { ...lead, status: updatedLead.status } : lead);
      });
      return { previousLeads };
    },
    onError: (err, newLead, context) => {
      queryClient.setQueryData(['leads'], context.previousLeads);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] }); // Incase converted
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  });

  const getLeadsByStatus = (status) => {
    return leads?.filter(lead => lead.status === status) || [];
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    updateMutation.mutate({ id: draggableId, status: newStatus });
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading pipeline...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error loading pipeline.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Deals Pipeline</h2>
          <p className="text-muted-foreground mt-1">Drag and drop leads to update their status and win deals.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {COLUMNS.map((col) => {
              const colLeads = getLeadsByStatus(col.id);
              const totalValue = colLeads.reduce((acc, lead) => acc + (lead.dealValue || 0), 0);

              return (
                <div key={col.id} className="w-80 shrink-0 h-full flex flex-col bg-card/50 backdrop-blur-sm rounded-2xl border shadow-sm overflow-hidden">
                  <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                    <h3 className="font-semibold">{col.title}</h3>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium bg-background px-2 py-0.5 rounded-full border">
                        {colLeads.length}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">${totalValue.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto p-4 flex flex-col gap-3 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                      >
                        {colLeads.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
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
                                <h4 className="font-medium text-sm mb-1">{lead.name}</h4>
                                <p className="text-xs text-muted-foreground mb-3">{lead.company}</p>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-semibold text-primary">${lead.dealValue?.toLocaleString()}</span>
                                  {col.id === 'WON' && <span className="text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-sm">Customer</span>}
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
