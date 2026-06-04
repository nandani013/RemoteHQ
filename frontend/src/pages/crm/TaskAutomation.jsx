import React, { useState } from "react";
import { createTasks, crmApi } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, AlertCircle, ListTodo, User, Calendar, PlusCircle } from "lucide-react";

export default function TaskAutomation() {
  const [leadId, setLeadId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leadId.trim() || !transcript.trim()) {
      showToast("Please enter both Lead ID and Transcript", "error");
      return;
    }
    setLoading(true);
    setTasks(null);
    try {
      const data = await createTasks(leadId, transcript);
      setTasks(data);
      showToast("Tasks generated successfully!");
    } catch (err) {
      showToast(err.message || "Failed to generate tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCrm = async (task, idx) => {
    try {
      await crmApi.createTask({
        title: task.title,
        owner: task.owner,
        dueDate: task.dueDate,
        leadId: leadId
      });
      showToast(`Added '${task.title}' to CRM`);
      
      // Optionally remove it from the UI so it doesn't get added twice
      const newTasks = { ...tasks, tasks: tasks.tasks.filter((_, i) => i !== idx) };
      setTasks(newTasks);
    } catch (err) {
      showToast(err.message || "Failed to add task to CRM", "error");
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
              <ListTodo size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Task Automation</h1>
              <p className="text-muted-foreground text-sm mt-1">Automatically extract and create CRM tasks from meeting conversations.</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Lead ID</label>
              <input
                type="text"
                placeholder="e.g. lead_12345"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Call Transcript</label>
              <textarea
                placeholder="Paste the raw meeting transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={5}
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
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Tasks
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
            className="space-y-4"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border shadow-sm animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-1/3 bg-muted rounded"></div>
                  <div className="h-4 w-1/4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tasks && !loading && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground">Generated CRM Tasks</h3>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {tasks.tasks?.length || 0} tasks found
              </span>
            </div>

            {tasks.tasks?.map((task, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="bg-card rounded-2xl p-5 border shadow-sm flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{task.title || task.action}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><User size={14} /> {task.owner}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {task.dueDate || task.deadline || "ASAP"}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleAddToCrm(task, idx)}
                  className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-lg transition-colors w-full sm:w-auto justify-center"
                >
                  <PlusCircle size={16} />
                  Add to CRM
                </button>
              </motion.div>
            ))}
            
            {(!tasks.tasks || tasks.tasks.length === 0) && (
              <div className="bg-card rounded-2xl p-8 border shadow-sm text-center text-muted-foreground">
                <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No actionable tasks found in this transcript.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
