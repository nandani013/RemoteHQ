import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export function Leads() {
  const queryClient = useQueryClient();
  const { data: leads, isLoading, isError } = useQuery({ queryKey: ['leads'], queryFn: crmApi.getLeads });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const createMutation = useMutation({
    mutationFn: crmApi.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: crmApi.updateLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsModalOpen(false);
      setEditingLead(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: crmApi.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });

  const filteredLeads = leads?.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (editingLead) {
      updateMutation.mutate({ id: editingLead.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm p-4">
        <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2 w-full max-w-md border border-transparent focus-within:border-primary/50 transition-colors">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search leads by name or company..." 
            className="bg-transparent border-none focus:outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Company</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Value</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className="py-4 text-center text-muted-foreground">Loading leads...</td></tr>
              ) : isError ? (
                <tr><td colSpan="6" className="py-4 text-center text-red-500">Error loading leads</td></tr>
              ) : filteredLeads?.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-muted-foreground">No leads found.</td></tr>
              ) : (
                filteredLeads?.map(lead => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    key={lead.id} 
                    className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-4 font-medium">{lead.name}</td>
                    <td className="py-4">{lead.company}</td>
                    <td className="py-4 text-muted-foreground">{lead.email}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4">${lead.dealValue.toLocaleString()}</td>
                    <td className="py-4 flex justify-end gap-2">
                      <button onClick={() => openEditModal(lead)} className="p-2 hover:bg-muted rounded-lg transition-colors text-blue-500">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteMutation.mutate(lead.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                <h2 className="text-xl font-semibold">{editingLead ? 'Edit Lead' : 'Create New Lead'}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input name="name" defaultValue={editingLead?.name} required className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <input name="company" defaultValue={editingLead?.company} required className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input name="email" type="email" defaultValue={editingLead?.email} required className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input name="phone" defaultValue={editingLead?.phone} className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deal Value ($)</label>
                    <input name="dealValue" type="number" defaultValue={editingLead?.dealValue} className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none" />
                  </div>
                  {editingLead && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select name="status" defaultValue={editingLead.status} className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none">
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="PROPOSAL_SENT">Proposal Sent</option>
                        <option value="NEGOTIATION">Negotiation</option>
                        <option value="WON">Won</option>
                        <option value="LOST">Lost</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl font-medium hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                    {editingLead ? 'Save Changes' : 'Create Lead'}
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
