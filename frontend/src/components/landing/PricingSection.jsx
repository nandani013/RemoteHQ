import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for small teams getting started.',
    features: ['Up to 5 users', 'Basic analytics', '24/7 Support', 'Community access'],
    cta: 'Get Started',
    popular: false,
    color: 'from-gray-500/10 to-slate-500/10'
  },
  {
    name: 'Pro',
    price: '$12',
    description: 'For growing teams that need more power.',
    features: ['Up to 50 users', 'Advanced analytics', 'Priority Support', 'Custom integrations', 'Team roles'],
    cta: 'Start Free Trial',
    popular: true,
    color: 'from-violet-600/20 via-indigo-600/10 to-transparent'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large scale organizations.',
    features: ['Unlimited users', 'Custom reporting', 'Dedicated SLA', 'On-premise deployment', 'SSO'],
    cta: 'Contact Sales',
    popular: false,
    color: 'from-cyan-500/10 to-indigo-500/10'
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden border-y border-border/30">
      {/* Decorative dots grid pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight mb-4 text-foreground"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Choose the plan that best fits your team's needs. Upgrade or downgrade at any time.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, index) => (
            <motion.div 
              key={tier.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl border flex flex-col p-8 glass-panel overflow-hidden ${
                tier.popular 
                  ? 'border-indigo-500 bg-gradient-to-b from-card/80 to-card shadow-2xl shadow-indigo-500/10 scale-102 z-10' 
                  : 'border-border bg-card/40'
              }`}
            >
              {/* Popular glowing top border banner */}
              {tier.popular && (
                <>
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 via-primary to-cyan-400"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-md shadow-indigo-500/20">
                    <Sparkles size={10} className="animate-spin" />
                    MOST POPULAR
                  </div>
                </>
              )}

              {/* Decorative top corner background accent glow */}
              <div className={`absolute -right-16 -top-16 w-36 h-36 bg-gradient-to-br ${tier.color} rounded-full blur-2xl pointer-events-none -z-10`}></div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-1">{tier.name}</h3>
                <p className="text-xs text-muted-foreground min-h-[32px]">{tier.description}</p>
              </div>

              <div className="flex items-baseline gap-1.5 mb-8 pb-6 border-b border-border/20">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-muted-foreground text-sm font-semibold">/mo</span>}
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {tier.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`rounded-full p-0.5 shrink-0 ${tier.popular ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-foreground/90">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={tier.popular ? 'primary' : 'outline'} 
                className={`w-full rounded-xl py-2.5 font-bold text-sm transition-all duration-300 ${
                  tier.popular 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 border-none shadow-lg shadow-indigo-500/20' 
                    : 'border-border/60 hover:bg-muted/40'
                }`}
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

