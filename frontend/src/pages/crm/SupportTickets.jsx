import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Ticket, Search, X } from 'lucide-react';

export function SupportTickets() {
  const queryClient = useQueryClient();
  const { data: tickets, isLoading, isError } = useQuery({ queryKey: ['tickets'], queryFn: crmApi.getTickets });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const createMutation = useMutation({
    mutationFn: crmApi.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: crmApi.updateTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      closeModal();
    }
  });

  const filteredTickets = tickets?.filter(ticket => 
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (editingTicket) {
      updateMutation.mutate({ id: editingTicket.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditModal = (ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTicket(null);
  };

  const statusColors = {
    'OPEN': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'IN_PROGRESS': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'CLOSED': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">Manage and track customer support requests.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      <div className="flex items-center gap-2 bg-card rounded-xl px-4 py-2 w-full max-w-md border focus-within:border-primary/50 transition-colors shadow-sm mb-6">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search tickets..." 
          className="bg-transparent border-none focus:outline-none w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading tickets...</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500">Error loading tickets. Check DB connection.</div>
      ) : filteredTickets?.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No tickets found</h3>
          <p className="text-muted-foreground">You're all caught up!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets?.map((ticket, i) => (
            <motion.div 
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => openEditModal(ticket)}
              className="bg-card rounded-2xl border shadow-sm p-5 hover:border-primary/50 cursor-pointer transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{ticket.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{ticket.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>ID: {ticket.id.substring(0, 8)}</span>
                  <span>•</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  {ticket.assignedTo && (
                    <>
                      <span>•</span>
                      <span>Assigned to: {ticket.assignedTo}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[ticket.status]}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold">{editingTicket ? 'Edit Ticket' : 'Create Support Ticket'}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <input name="title" defaultValue={editingTicket?.title} required disabled={!!editingTicket} className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none disabled:opacity-50" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea name="description" defaultValue={editingTicket?.description} required disabled={!!editingTicket} rows={4} className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none disabled:opacity-50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assign To</label>
                    <input name="assignedTo" defaultValue={editingTicket?.assignedTo} placeholder="e.g. Sarah" className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none" />
                  </div>
                  {editingTicket && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select name="status" defaultValue={editingTicket.status} className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none">
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl font-medium hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                    {editingTicket ? 'Save Changes' : 'Create Ticket'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
