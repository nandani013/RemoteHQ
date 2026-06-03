import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Sparkles, UserCheck, MessageSquare, CheckSquare, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

function AnalyzeTranscriptModal({ lead, onClose }) {
  const [transcript, setTranscript] = useState('');
  
  const analyzeMutation = useMutation({
    mutationFn: () => crmApi.analyzeTranscript(lead.id, transcript)
  });

  const result = analyzeMutation.data;
  const isLoading = analyzeMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-card w-full max-w-3xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden relative"
      >
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Conversation Intelligence</h2>
              <p className="text-xs text-muted-foreground">Analyzing {lead.name} from {lead.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col">
          {!result ? (
            <div className="flex-1 flex flex-col space-y-4">
              <label className="text-sm font-medium text-muted-foreground">Paste Meeting Transcript</label>
              <textarea 
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Customer wants API integration. Concerned about implementation cost..."
                className="flex-1 min-h-[200px] w-full bg-muted/30 rounded-xl p-4 border focus:border-primary outline-none resize-none font-mono text-sm"
              />
              <Button 
                onClick={() => analyzeMutation.mutate()} 
                disabled={!transcript.trim() || isLoading}
                className="w-full gap-2 rounded-xl py-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-none"
              >
                {isLoading ? (
                  <><Sparkles className="animate-pulse" size={18} /> Analyzing...</>
                ) : (
                  <><Sparkles size={18} /> Analyze Conversation</>
                )}
              </Button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-4">
              {/* Requirements & Decision Maker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <CheckSquare size={16} /> Requirements
                  </h3>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <ul className="space-y-2">
                      {result.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-medium text-primary">
                          <span className="opacity-50">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <UserCheck size={16} /> Decision Maker
                  </h3>
                  <div className="p-4 rounded-xl bg-muted/30 border flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {result.decisionMaker.charAt(0)}
                    </div>
                    <span className="font-semibold">{result.decisionMaker}</span>
                  </div>
                </div>
              </div>

              {/* Objections & Commitments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} /> Objections
                  </h3>
                  <ul className="space-y-2">
                    {result.objections.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="opacity-70">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MessageSquare size={16} /> Commitments
                  </h3>
                  <ul className="space-y-2">
                    {result.commitments.map((com, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="opacity-70">•</span>
                        <span>{com}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <ArrowRight size={16} /> Next Steps
                </h3>
                <div className="p-5 rounded-xl bg-muted border">
                  <ul className="space-y-3">
                    {result.nextSteps.map((step, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium">
                        <div className="w-5 h-5 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{i + 1}</div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={onClose} variant="outline" className="rounded-xl">Close Report</Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function Leads() {
  const queryClient = useQueryClient();
  const { data: leads, isLoading, isError } = useQuery({ queryKey: ['leads'], queryFn: crmApi.getLeads });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [analyzingLead, setAnalyzingLead] = useState(null);

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
                    <td className="py-4 flex justify-end gap-2 items-center">
                      <button 
                        onClick={() => setAnalyzingLead(lead)} 
                        className="p-2 hover:bg-violet-500/10 rounded-lg transition-colors text-violet-500 flex items-center gap-1 group"
                        title="AI Conversation Intelligence"
                      >
                        <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                      </button>
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
        {analyzingLead && (
          <AnalyzeTranscriptModal lead={analyzingLead} onClose={() => setAnalyzingLead(null)} />
        )}
        
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
