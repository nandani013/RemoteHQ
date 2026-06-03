import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Mail, Lock, Sparkles, CheckSquare, MessageSquare, ArrowLeft, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import useAuthStore from '../store/useAuthStore';

export function Login() {
  const location = useLocation();
  const isRegister = location.pathname === '/register';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister ? { name, email, password } : { email, password };
      
      const response = await fetch(`http://localhost:5003${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      setAuth(data.user, data.token);
      
      navigate('/crm');
    } catch (error) {
      console.error('Auth error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden font-sans">
      
      {/* LEFT COLUMN: Visual Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between p-12 bg-zinc-950 overflow-hidden border-r border-border/10 text-white select-none">
        {/* CSS decorative grid & glows */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.08] pointer-events-none z-0"></div>
        <div className="absolute -left-12 -top-12 w-[350px] h-[350px] bg-violet-600/20 rounded-full blur-3xl pointer-events-none z-0 animate-glow-slow"></div>
        <div className="absolute right-12 bottom-12 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none z-0 animate-glow-slow" style={{ animationDelay: '3s' }}></div>

        {/* Back Link to Landing */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors z-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        {/* Floating live mockup elements to showcase actual features */}
        <div className="flex-1 flex flex-col justify-center items-start max-w-lg mx-auto w-full z-10 space-y-12 my-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-violet-400 text-xs font-bold backdrop-blur-md">
              <Sparkles size={12} className="animate-pulse" />
              <span>THE ALL-IN-ONE WORKSPACE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400">
              The unified power to move faster.
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Experience a beautiful, high-velocity collaboration center designed for modern, high-performance remote product teams.
            </p>
          </div>

          {/* Layered Animated CSS Cards Mocking Kanban and Chat */}
          <div className="relative w-full h-[220px] pr-8">
            {/* Project Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute top-0 left-0 w-[280px] p-4 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-extrabold text-zinc-500 tracking-wider">Active Kanban Task</span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              </div>
              <p className="text-xs font-bold text-zinc-100 leading-normal mb-3">Optimize database search indexes & caching layer</p>
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">High priority</span>
                <div className="flex -space-x-1">
                  <img src="https://i.pravatar.cc/80?u=sarah" className="w-5 h-5 rounded-full ring-1 ring-zinc-900" alt="" />
                  <img src="https://i.pravatar.cc/80?u=marcus" className="w-5 h-5 rounded-full ring-1 ring-zinc-900" alt="" />
                </div>
              </div>
            </motion.div>

            {/* Chat Bubble Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute right-0 bottom-4 w-[260px] p-3.5 rounded-xl bg-zinc-900/70 border border-white/5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <img src="https://i.pravatar.cc/80?u=elena" className="w-5.5 h-5.5 rounded-md object-cover" alt="" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-zinc-100">Elena Rodriguez</p>
                  <p className="text-[8px] text-zinc-500">Engineering Lead</p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">"Just pushed the new dashboard UI layout to staging. Ready for build check!"</p>
            </motion.div>
          </div>
        </div>


        </div>

      {/* RIGHT COLUMN: Authentication Form (Full Width on Mobile) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative">
        {/* CSS background grids & mobile mesh glows */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10 md:hidden animate-glow-slow"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Glass Form Panel */}
          <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-2xl flex flex-col">
            {/* Logo */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/25">
              <LayoutDashboard size={24} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1.5">
              {isRegister ? 'Create an account' : 'Welcome to RemoteHQ'}
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              {isRegister ? 'Enter your details to create your collaborative hub.' : 'Enter your email to sign in to your collaborative hub.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input (Only on Register) */}
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80" htmlFor="name">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"><User size={16} /></span>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="Jane Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-10 rounded-xl border-border/60 focus-visible:ring-primary/20 bg-background/50 h-10.5 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80" htmlFor="email">Email address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"><Mail size={16} /></span>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 rounded-xl border-border/60 focus-visible:ring-primary/20 bg-background/50 h-10.5 text-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80" htmlFor="password">Password</label>
                  <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"><Lock size={16} /></span>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 rounded-xl border-border/60 focus-visible:ring-primary/20 bg-background/50 h-10.5 text-sm"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6 rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 border-none h-11 transition-all" 
                isLoading={isLoading}
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {isRegister ? (
                <>Already have an account? <Link to="/login" className="text-primary hover:underline font-bold transition-all">Sign in</Link></>
              ) : (
                <>Don't have an account? <Link to="/register" className="text-primary hover:underline font-bold transition-all">Create free account</Link></>
              )}
            </p>
          </div>
        </motion.div>
      </div>

    </div>
  );
}

