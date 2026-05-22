import React, { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { PricingSection } from '../components/landing/PricingSection';
import { TestimonialSection } from '../components/landing/TestimonialSection';
import { FAQSection } from '../components/landing/FAQSection';
import { Footer } from '../components/landing/Footer';
import { useThemeStore } from '../store/useThemeStore';

export function Landing() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Navbar />
      <main>
        <HeroSection />
        
        {/* Features section mockup */}
        <section id="features" className="py-24 bg-card/50 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">Everything you need to run your remote team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Real-time sync', desc: 'Changes reflect instantly across all devices. Never refresh again.' },
                { title: 'Deep Integrations', desc: 'Connects with GitHub, Jira, and Figma out of the box.' },
                { title: 'Advanced Security', desc: 'Enterprise-grade security with SOC2 compliance and SSO.' }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-background border border-border shadow-sm text-left">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 mb-6 flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary rounded-md"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PricingSection />
        <TestimonialSection />
        
        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to supercharge your team?</h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10">Join thousands of remote teams already using RemoteHQ to move faster.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-background text-primary px-8 py-4 rounded-md font-semibold text-lg hover:bg-background/90 transition-colors shadow-lg">
                Start your free trial
              </button>
              <button className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 px-8 py-4 rounded-md font-semibold text-lg hover:bg-primary-foreground/20 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
