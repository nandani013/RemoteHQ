import React, { useState } from "react";
import { analyzeTranscript } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, CheckCircle2, AlertCircle, ListChecks, Target, Users } from "lucide-react";

export default function ConversationInsights() {
  const [transcript, setTranscript] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transcript.trim()) {
      showToast("Please enter a call transcript", "error");
      return;
    }
    setLoading(true);
    setInsights(null);
    try {
      const data = await analyzeTranscript(transcript);
      setInsights(data);
      showToast("Transcript analyzed successfully!");
    } catch (err) {
      showToast(err.message || "Failed to analyze transcript", "error");
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
              <MessageSquare size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Conversation Insights</h1>
              <p className="text-muted-foreground text-sm mt-1">Extract requirements, objections, and next steps directly from meeting transcripts.</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Call Transcript</label>
              <textarea
                placeholder="Paste the raw meeting transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Sparkles className="animate-spin w-5 h-5" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Transcript
                  </>
                )}
              </button>
            </div>
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

        {insights && !loading && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Requirements */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col gap-4 md:col-span-1">
              <div className="flex items-center gap-3 text-muted-foreground border-b pb-4">
                <Target className="w-5 h-5 text-indigo-500" />
                <h3 className="font-semibold text-foreground uppercase tracking-wider text-sm">Requirements</h3>
              </div>
              <ul className="space-y-2">
                {insights.requirements?.length > 0 ? (
                  insights.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No specific requirements captured.</p>
                )}
              </ul>
            </div>

            {/* Objections */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col gap-4 md:col-span-1">
              <div className="flex items-center gap-3 text-muted-foreground border-b pb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-foreground uppercase tracking-wider text-sm">Objections</h3>
              </div>
              <ul className="space-y-2">
                {insights.objections?.length > 0 ? (
                  insights.objections.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No objections recorded.</p>
                )}
              </ul>
            </div>

            {/* Commitments */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col gap-4 md:col-span-1">
              <div className="flex items-center gap-3 text-muted-foreground border-b pb-4">
                <ListChecks className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-foreground uppercase tracking-wider text-sm">Commitments</h3>
              </div>
              <ul className="space-y-2">
                {insights.commitments?.length > 0 ? (
                  insights.commitments.map((com, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      <span>{com}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No commitments made.</p>
                )}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col gap-4 md:col-span-1">
              <div className="flex items-center gap-3 text-muted-foreground border-b pb-4">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-foreground uppercase tracking-wider text-sm">Next Steps & Decision Makers</h3>
              </div>
              <div className="space-y-4">
                {insights.decisionMaker && (
                  <div>
                    <span className="text-xs uppercase text-muted-foreground font-semibold">Decision Maker</span>
                    <p className="text-sm mt-1">{insights.decisionMaker}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs uppercase text-muted-foreground font-semibold block mb-2">Next Steps</span>
                  <ul className="space-y-2">
                    {insights.nextSteps?.length > 0 ? (
                      insights.nextSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No next steps defined.</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
