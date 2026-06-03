import React, { useState } from "react";
import { preCallSummary } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, CheckCircle2, AlertCircle, PhoneCall, CheckSquare, Lightbulb, AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/Button"; // assuming Button exists, let's just use standard html button if it doesn't, but wait, Customers.jsx imported it from '../../components/ui/Button'

export default function PreCallSummary() {
  const [leadId, setLeadId] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leadId.trim()) {
      showToast("Please enter a valid Lead ID", "error");
      return;
    }
    setLoading(true);
    setSummary(null);
    try {
      const data = await preCallSummary(leadId);
      setSummary(data);
      showToast("Summary generated successfully!");
    } catch (err) {
      showToast(err.message || "Failed to generate summary", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg border flex items-center gap-3 backdrop-blur-md ${
              toast.type === "error" 
                ? "bg-red-500/10 border-red-500/20 text-red-500" 
                : "bg-green-500/10 border-green-500/20 text-green-500"
            }`}
          >
            {toast.type === "error" ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-xl border overflow-hidden"
      >
        <div className="p-6 sm:p-8 border-b bg-gradient-to-r from-primary/10 via-background to-background">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <PhoneCall size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Pre‑Call Summary</h1>
              <p className="text-muted-foreground text-sm mt-1">Get AI-generated insights before joining customer meetings.</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Lead ID or Customer Reference</label>
              <input
                type="text"
                placeholder="e.g. lead_12345"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-[52px]"
            >
              {loading ? (
                <>
                  <Sparkles className="animate-spin w-5 h-5" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Insight
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border shadow-sm animate-pulse space-y-4">
                <div className="h-6 w-1/3 bg-muted rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-5/6 bg-muted rounded"></div>
                  <div className="h-4 w-4/6 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {summary && !loading && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Last Interaction */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3 text-muted-foreground border-b pb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground uppercase tracking-wider text-sm">Last Interaction</h3>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary.lastInteraction || summary.raw || "No recent interactions found."}</p>
            </div>

            {/* Open Tasks */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3 text-muted-foreground border-b pb-4">
                <CheckSquare className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-foreground uppercase tracking-wider text-sm">Open Tasks</h3>
              </div>
              <ul className="space-y-2">
                {summary.openTasks?.length > 0 ? (
                  summary.openTasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      <span>{task}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No open tasks.</p>
                )}
              </ul>
            </div>

            {/* Risks / Objections */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3 text-muted-foreground border-b pb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-foreground uppercase tracking-wider text-sm">Risks & Objections</h3>
              </div>
              <ul className="space-y-2">
                {summary.risks?.length > 0 ? (
                  summary.risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No identified risks.</p>
                )}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3 text-muted-foreground border-b pb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-foreground uppercase tracking-wider text-sm">Recommended Talking Points</h3>
              </div>
              <ul className="space-y-2">
                {summary.talkingPoints?.length > 0 ? (
                  summary.talkingPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recommendations generated.</p>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
