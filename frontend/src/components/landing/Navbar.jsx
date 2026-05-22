import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useThemeStore } from '../../store/useThemeStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500',
        scrolled 
          ? 'py-4 bg-background/60 backdrop-blur-xl border-b border-border/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)]' 
          : 'py-6 bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <LayoutDashboard size={20} className="animate-pulse" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Remote<span className="text-primary">HQ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/40 border border-border/30 backdrop-blur-md">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all duration-300 relative group"
            >
              {link.name}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/30 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -10, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 10, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          
          <Link to="/login">
            <Button variant="ghost" className="font-semibold text-sm hover:bg-muted/50 rounded-xl px-5">
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button className="font-semibold text-sm rounded-xl px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 border-none">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-muted/50 text-muted-foreground border border-border/30"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-500" />}
          </button>
          <button 
            className="p-2 text-foreground bg-muted/50 rounded-xl border border-border/30"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden absolute top-20 inset-x-4 bg-background/95 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-2xl z-40"
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-base font-semibold text-muted-foreground hover:text-foreground py-2.5 px-4 rounded-xl hover:bg-muted/40 transition-all border-b border-border/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border/40">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl py-3 font-semibold text-sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl py-3 font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 border-none text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

