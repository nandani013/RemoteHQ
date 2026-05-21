import React from 'react';
import { Check } from 'lucide-react';
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
  },
  {
    name: 'Pro',
    price: '$12',
    description: 'For growing teams that need more power.',
    features: ['Up to 50 users', 'Advanced analytics', 'Priority Support', 'Custom integrations', 'Team roles'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large scale organizations.',
    features: ['Unlimited users', 'Custom reporting', 'Dedicated SLA', 'On-premise deployment', 'SSO'],
    cta: 'Contact Sales',
    popular: false,
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the plan that best fits your team's needs. Upgrade at any time.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div 
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border p-8 glass-panel ${tier.popular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'}`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-muted-foreground">/mo</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
              <Button variant={tier.popular ? 'primary' : 'outline'} className="w-full mb-8">
                {tier.cta}
              </Button>
              <div className="space-y-4">
                {tier.features.map(feature => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
