import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles, LayoutDashboard, Briefcase, MessageSquare, LineChart, CheckCircle2, Circle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden bg-background">
      {/* Immersive radial glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-glow-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-glow-slow" style={{ animationDelay: '2s' }}></div>
      
      {/* Fine-grid line styling */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.25] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20 backdrop-blur-md"
        >
          <Sparkles size={14} className="text-violet-500 animate-spin" style={{ animationDuration: '3s' }} />
          <span>RemoteHQ 2.0 is now live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-foreground"
        >
          Work seamlessly <br className="hidden md:block"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-primary to-cyan-500 drop-shadow-sm">
            from anywhere.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          The ultimate workspace for modern teams. Combine live chat, Kanban boards, and metrics in one beautiful, blazingly fast platform.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto text-base gap-2 group rounded-xl px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-none shadow-lg shadow-indigo-500/25">
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base rounded-xl px-8 border-border/60 hover:bg-muted/40">
              Explore Features
            </Button>
          </a>
        </motion.div>

        {/* Dynamic, High-Fidelity Dashboard Preview (No Placeholders!) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 relative mx-auto max-w-5xl rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl p-2 md:p-3 overflow-hidden glass-panel-glow"
        >
          <div className="rounded-xl border border-border/40 bg-background/95 overflow-hidden flex flex-col h-[520px]">
            {/* Header window control */}
            <div className="h-11 bg-muted/40 border-b border-border/40 flex items-center justify-between px-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-xs text-muted-foreground font-mono bg-background/50 px-6 py-0.5 rounded-full border border-border/20">
                app.remotehq.com/dashboard
              </div>
              <div className="w-12"></div>
            </div>

            {/* Simulated Workspace Structure */}
            <div className="flex-1 flex overflow-hidden">
              {/* Mini Sidebar */}
              <div className="w-44 border-r border-border/40 bg-muted/20 hidden md:flex flex-col p-3 gap-1">
                <div className="flex items-center gap-2 px-2 py-3 mb-4 border-b border-border/20">
                  <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-[10px] text-white font-bold">R</div>
                  <span className="text-xs font-bold text-foreground">RemoteHQ</span>
                </div>
                {[
                  { icon: LayoutDashboard, label: 'Overview', active: true },
                  { icon: Briefcase, label: 'Board' },
                  { icon: MessageSquare, label: 'Live Chat' },
                  { icon: LineChart, label: 'Analytics' }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'}`}>
                    <item.icon size={14} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Mini Main Panel */}
              <div className="flex-1 flex flex-col bg-background/40">
                {/* Mini SubHeader */}
                <div className="h-12 border-b border-border/30 flex items-center justify-between px-6 bg-card/10">
                  <span className="text-xs font-bold text-foreground">Overview Dashboard</span>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {['sarah', 'marcus', 'elena'].map((name, i) => (
                        <img key={i} src={`https://i.pravatar.cc/80?u=${name}`} className="w-5 h-5 rounded-full ring-1 ring-background" alt="" />
                      ))}
                    </div>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  </div>
                </div>

                {/* Dashboard Grid Mockup */}
                <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto">
                  {/* Left Column: Metrics & Kanban */}
                  <div className="lg:col-span-2 space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-border/40 bg-card/50 shadow-sm flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Team Velocity</span>
                        <span className="text-lg font-bold text-foreground mt-1">+94.2%</span>
                        <div className="w-full bg-muted/40 h-1.5 rounded-full mt-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full w-[80%]"></div>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border border-border/40 bg-card/50 shadow-sm flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Revenue</span>
                        <span className="text-lg font-bold text-foreground mt-1">$45,231</span>
                        <span className="text-[10px] text-green-500 font-bold mt-2">↑ 20.1% this month</span>
                      </div>
                    </div>

                    {/* Mini Kanban tasks */}
                    <div className="p-4 rounded-xl border border-border/40 bg-card/40 flex-1">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-bold text-foreground">Featured Board Tasks</span>
                        <span className="text-[10px] text-primary hover:underline cursor-pointer">View Board</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { title: 'Redesign Landing Page UI', priority: 'High', status: 'pending' },
                          { title: 'Integrate Recharts Analytics', priority: 'Medium', status: 'completed' },
                          { title: 'Deploy to AWS Staging', priority: 'High', status: 'pending' }
                        ].map((task, i) => (
                          <div key={i} className="p-2.5 rounded-lg border border-border/30 bg-background/70 flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              {task.status === 'completed' ? (
                                <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                              ) : (
                                <Circle size={14} className="text-muted-foreground shrink-0" />
                              )}
                              <span className={`text-xs font-medium truncate ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</span>
                            </div>
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${task.priority === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/10' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/10'}`}>{task.priority}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mini live chat mock */}
                  <div className="rounded-xl border border-border/40 bg-card/40 p-4 flex flex-col text-left h-full">
                    <span className="text-[11px] font-bold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      #engineering-chat
                    </span>
                    <div className="flex-1 space-y-3 overflow-y-auto mb-3">
                      {[
                        { sender: 'Sarah', content: 'Hey team! The AWS build just completed.' },
                        { sender: 'Marcus', content: 'Awesome! Let me review the dashboard preview.' },
                        { sender: 'Elena', content: 'Working on polishing the landing page styles now.' }
                      ].map((msg, i) => (
                        <div key={i} className="flex gap-2">
                          <img src={`https://i.pravatar.cc/80?u=${msg.sender.toLowerCase()}`} className="w-5.5 h-5.5 rounded-md object-cover mt-0.5" alt="" />
                          <div className="flex-1 min-w-0 bg-background/50 p-2 rounded-lg border border-border/10">
                            <div className="flex items-baseline justify-between mb-0.5">
                              <span className="text-[10px] font-bold text-foreground">{msg.sender}</span>
                              <span className="text-[8px] text-muted-foreground">10m ago</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-normal">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 bg-background/60 border border-border/30 rounded-lg p-1.5">
                      <input type="text" placeholder="Type message..." disabled className="w-full bg-transparent border-none text-[10px] px-1 focus:outline-none" />
                      <div className="w-5 h-5 rounded bg-primary text-white flex items-center justify-center text-[9px] font-bold">↵</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

