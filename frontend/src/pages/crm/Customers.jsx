import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { crmApi } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Building, Mail, Phone, Calendar, Sparkles, X, CheckSquare, AlertTriangle, Lightbulb, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';

function PreCallSummaryModal({ customerId, onClose }) {
  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ['pre-call-summary', customerId],
    queryFn: () => crmApi.getPreCallSummary(customerId),
    enabled: !!customerId
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden relative"
      >
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">AI Pre-Call Summary</h2>
              <p className="text-xs text-muted-foreground">{summary?.customerName || 'Generating...'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-4">
              <Sparkles className="animate-pulse w-8 h-8 text-primary/50" />
              <p>Analyzing CRM data & generating insights...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">Failed to generate summary.</div>
          ) : summary ? (
            <>
              {/* Last Interaction */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Calendar size={16} /> Last Interaction
                </h3>
                <div className="p-4 rounded-xl bg-muted/30 border">
                  <p className="font-medium text-sm">{summary.lastInteraction}</p>
                </div>
              </div>

              {/* Open Tasks */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <CheckSquare size={16} /> Open Tasks
                </h3>
                <ul className="space-y-2">
                  {summary.openTasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 w-2.5 h-2.5 rounded-full border-2 border-primary/50 flex-shrink-0" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks & Opportunities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} /> Risks
                  </h3>
                  <ul className="space-y-2">
                    {summary.risks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="opacity-70">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Lightbulb size={16} /> Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {summary.opportunities.map((opp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="opacity-70">•</span>
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Talking Points */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <MessageSquare size={16} /> Recommended Talking Points
                </h3>
                <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
                  <ul className="space-y-3">
                    {summary.talkingPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-medium">
                        <span className="text-primary font-bold">{i + 1}.</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

export function Customers() {
  const { data: customers, isLoading, isError } = useQuery({ queryKey: ['customers'], queryFn: crmApi.getCustomers });
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">People who have successfully closed deals.</p>
        </div>
      </div>

      <AnimatePresence>
        {selectedCustomerId && (
          <PreCallSummaryModal 
            customerId={selectedCustomerId} 
            onClose={() => setSelectedCustomerId(null)} 
          />
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading customers...</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500">Error loading customers. Check DB connection.</div>
      ) : customers?.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No customers yet</h3>
          <p className="text-muted-foreground">Move a lead to WON to automatically create a customer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border shadow-sm p-6 hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>{customer.company}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 flex-1 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${customer.email}`} className="hover:text-primary transition-colors">{customer.email}</a>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${customer.phone}`} className="hover:text-primary transition-colors">{customer.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Button 
                onClick={() => setSelectedCustomerId(customer.id)}
                className="w-full gap-2 rounded-xl bg-gradient-to-r from-violet-600/10 to-indigo-600/10 hover:from-violet-600/20 hover:to-indigo-600/20 text-primary border border-primary/20 shadow-none mt-auto transition-all"
                variant="outline"
              >
                <Sparkles size={16} />
                Generate Pre-Call Summary
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
