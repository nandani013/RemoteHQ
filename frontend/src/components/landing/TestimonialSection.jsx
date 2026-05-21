import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "RemoteHQ has completely transformed how our remote team operates. It's fast, intuitive, and beautifully designed.",
    author: "Sarah Jenkins",
    role: "CTO, TechFlow",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    quote: "We switched from Slack to RemoteHQ and haven't looked back. The integrated project insights are a game changer.",
    author: "Marcus Chen",
    role: "Product Manager, InnovateInc",
    avatar: "https://i.pravatar.cc/150?u=marcus"
  },
  {
    quote: "Finally, a workspace that doesn't feel cluttered. The minimalist design helps me focus on what actually matters.",
    author: "Elena Rodriguez",
    role: "Lead Designer, StudioX",
    avatar: "https://i.pravatar.cc/150?u=elena"
  }
];

export function TestimonialSection() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Loved by remote teams</h2>
          <p className="text-lg text-muted-foreground">Don't just take our word for it.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between"
            >
              <p className="text-lg mb-8 italic text-card-foreground">"{t.quote}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full border border-border" />
                <div>
                  <div className="font-semibold text-sm">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
