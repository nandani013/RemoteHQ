import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { erpApi } from '../../lib/erpApi';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ArrowUpRight, ArrowDownRight, Plus, X, Wallet, TrendingUp } from 'lucide-react';

export function Finance() {
  const queryClient = useQueryClient();
  const { data: records, isLoading, isError } = useQuery({ queryKey: ['finance'], queryFn: erpApi.getFinanceRecords });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordType, setRecordType] = useState('REVENUE');

  const createMutation = useMutation({
    mutationFn: erpApi.createFinanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      setIsModalOpen(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.type = recordType;
    createMutation.mutate(data);
  };

  const revenue = records?.filter(r => r.type === 'REVENUE').reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const expenses = records?.filter(r => r.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const balance = revenue - expenses;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance & Accounting</h1>
          <p className="text-muted-foreground mt-1">Manage revenue, expenses, and project budgets.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-2xl border shadow-sm p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
             <p className="font-medium text-muted-foreground">Net Balance</p>
             <div className="p-2 bg-primary/10 text-primary rounded-xl"><Wallet className="w-5 h-5" /></div>
          </div>
          <h3 className="text-3xl font-bold">${balance.toLocaleString()}</h3>
          <div className="flex items-center gap-2 mt-2 text-sm text-primary">
            <TrendingUp className="w-4 h-4" />
            <span>Healthy runway</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
             <p className="font-medium text-muted-foreground">Total Revenue</p>
             <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><ArrowUpRight className="w-5 h-5" /></div>
          </div>
          <h3 className="text-3xl font-bold">${revenue.toLocaleString()}</h3>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm p-6 relative overflow-hidden group hover:border-red-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
             <p className="font-medium text-muted-foreground">Total Expenses</p>
             <div className="p-2 bg-red-500/10 text-red-500 rounded-xl"><ArrowDownRight className="w-5 h-5" /></div>
          </div>
          <h3 className="text-3xl font-bold">${expenses.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6">Financial Transactions</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="py-4 text-center text-muted-foreground">Loading records...</td></tr>
              ) : isError ? (
                 <tr><td colSpan="4" className="py-4 text-center text-red-500">Error loading records.</td></tr>
              ) : records?.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-muted-foreground">No financial records found.</td></tr>
              ) : (
                records?.map((record) => (
                  <tr key={record.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-4 text-sm">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-4 font-medium">{record.description}</td>
                    <td className="py-4 text-muted-foreground text-sm">{record.category}</td>
                    <td className={`py-4 text-right font-bold ${record.type === 'REVENUE' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {record.type === 'REVENUE' ? '+' : '-'}${record.amount.toLocaleString()}
                    </td>
                  </tr>
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
                <h2 className="text-xl font-semibold">New Transaction</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex p-6 pb-0">
                <button 
                  onClick={() => setRecordType('REVENUE')}
                  className={`flex-1 py-2 text-center rounded-l-xl font-medium transition-colors ${recordType === 'REVENUE' ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                >
                  Income
                </button>
                <button 
                  onClick={() => setRecordType('EXPENSE')}
                  className={`flex-1 py-2 text-center rounded-r-xl font-medium transition-colors ${recordType === 'EXPENSE' ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                >
                  Expense
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <input name="description" required placeholder="e.g. Website Redesign Milestone 1" className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount ($)</label>
                    <input name="amount" type="number" required placeholder="0.00" className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <input name="category" required placeholder="e.g. Services, Software" className="w-full bg-muted/50 rounded-xl px-4 py-2 border focus:border-primary outline-none" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl font-medium hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                    Save Record
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
