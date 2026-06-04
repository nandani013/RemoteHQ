import React, { useState } from "react";
import { generateEmail } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, AlertCircle, Mail, Send, Copy, PenLine } from "lucide-react";

export default function EmailGenerator() {
  const [leadId, setLeadId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [transcript, setTranscript] = useState("");
  const [emailDraft, setEmailDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leadId.trim() || !transcript.trim()) {
      showToast("Lead ID and Transcript are required", "error");
      return;
    }
    setLoading(true);
    setEmailDraft(null);
    try {
      const data = await generateEmail(leadId, transcript, recipientName);
      setEmailDraft(data);
      showToast("Email draft generated successfully!");
    } catch (err) {
      showToast(err.message || "Failed to generate email", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (emailDraft) {
      const text = `Subject: ${emailDraft.subject || emailDraft.draft?.subject}\n\n${emailDraft.body || emailDraft.draft?.body}`;
      navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    }
  };

  const handleDiscard = () => {
    setEmailDraft(null);
    setTranscript("");
    showToast("Draft discarded", "success");
  };

  const handleSend = () => {
    // Simulate sending email
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailDraft(null);
      setTranscript("");
      showToast("Email sent successfully!", "success");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 flex flex-col lg:flex-row gap-8 items-start">
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
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card rounded-2xl shadow-xl border overflow-hidden w-full lg:w-1/2 flex-shrink-0 sticky top-8"
      >
        <div className="p-6 sm:p-8 border-b bg-gradient-to-r from-blue-500/10 via-background to-background">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <PenLine size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Email Generator</h1>
              <p className="text-muted-foreground text-sm mt-1">Draft perfect follow-ups directly from call transcripts.</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Lead ID</label>
                <input
                  type="text"
                  placeholder="e.g. lead_12345"
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  className="w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Recipient Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Call Transcript</label>
              <textarea
                placeholder="Paste the raw meeting transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 mt-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Sparkles className="animate-spin w-5 h-5" />
                  Generating Draft...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Email
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      <div className="w-full lg:w-1/2">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card rounded-2xl p-6 border shadow-sm h-[500px] flex flex-col gap-6"
            >
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-1/4 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-4/6 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-full bg-muted animate-pulse rounded mt-6"></div>
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-10 w-32 bg-muted animate-pulse rounded ml-auto"></div>
            </motion.div>
          )}

          {emailDraft && !loading && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl border shadow-xl flex flex-col h-full min-h-[500px]"
            >
              <div className="p-4 sm:p-6 border-b flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">New Message</h3>
                    <p className="text-xs text-muted-foreground">Draft saved to CRM</p>
                  </div>
                </div>
                <button 
                  onClick={handleCopy}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={18} />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm border-b pb-4">
                  <span className="text-muted-foreground w-16">To:</span>
                  <span className="font-medium bg-muted/50 px-2 py-1 rounded">{recipientName || "Client"}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm border-b pb-4">
                  <span className="text-muted-foreground w-16">Subject:</span>
                  <span className="font-bold text-foreground">{emailDraft.subject || emailDraft.draft?.subject}</span>
                </div>
                
                <div className="flex-1 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed mt-2 font-mono bg-background/50 p-4 rounded-xl border">
                  {emailDraft.body || emailDraft.draft?.body}
                </div>
              </div>
              
              <div className="p-4 sm:p-6 border-t bg-muted/30 flex justify-end gap-3">
                <button 
                  onClick={handleDiscard}
                  className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-background border rounded-lg transition-colors"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSend}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                >
                  <Send size={16} />
                  Send Email
                </button>
              </div>
            </motion.div>
          )}
          
          {!emailDraft && !loading && (
            <div className="h-[500px] bg-card/50 rounded-2xl border border-dashed flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <Mail className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Draft Generated Yet</h3>
              <p className="text-sm max-w-sm">Provide a lead ID, recipient name, and transcript to generate a contextual follow-up email draft automatically.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
