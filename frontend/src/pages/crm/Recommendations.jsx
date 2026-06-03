import React, { useState } from "react";
import { getRecommendations } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, AlertCircle, Lightbulb, ArrowRight, Zap, Target } from "lucide-react";

export default function Recommendations() {
  const [leadId, setLeadId] = useState("");
  const [recommendations, setRecommendations] = useState(null);
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
    setRecommendations(null);
    try {
      const data = await getRecommendations(leadId);
      setRecommendations(data);
      showToast("Recommendations generated successfully!");
    } catch (err) {
      showToast(err.message || "Failed to get recommendations", "error");
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
        <div className="p-6 sm:p-8 border-b bg-gradient-to-r from-yellow-500/10 via-background to-background">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
              <Lightbulb size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Next Best Action</h1>
              <p className="text-muted-foreground text-sm mt-1">Get AI-driven recommendations on how to move deals forward.</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Lead ID or Deal Stage</label>
              <input
                type="text"
                placeholder="e.g. lead_12345"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-yellow-500 text-yellow-950 font-medium rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-[52px]"
            >
              {loading ? (
                <>
                  <Sparkles className="animate-spin w-5 h-5" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Get Action
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
            className="flex justify-center py-12"
          >
            <div className="bg-card rounded-2xl p-8 border shadow-sm animate-pulse w-full max-w-2xl flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-muted rounded-full"></div>
              <div className="h-8 w-1/2 bg-muted rounded"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
            </div>
          </motion.div>
        )}

        {recommendations && !loading && (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <div className="bg-card rounded-3xl p-8 border-2 border-yellow-500/20 shadow-2xl shadow-yellow-500/10 w-full max-w-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Target size={120} />
              </div>
              
              <div className="relative z-10 text-center flex flex-col items-center">
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                  {recommendations.dealStage || "AI Recommendation"}
                </span>
                
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {recommendations.recommendedAction || recommendations.action || "No action recommended"}
                </h2>
                
                <p className="text-muted-foreground text-lg mb-8 max-w-md">
                  {recommendations.reasoning || recommendations.context || "Follow this action to improve conversion rate and move the deal to the next stage."}
                </p>
                
                <button className="flex items-center gap-2 px-8 py-4 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity hover:scale-105 active:scale-95 transform">
                  Execute Action
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
