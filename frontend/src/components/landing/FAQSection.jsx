import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const faqs = [
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 14-day free trial on our Pro plan. No credit card required."
  },
  {
    question: "Can I switch plans later?",
    answer: "Absolutely. You can upgrade or downgrade your plan at any time. Prorated charges will be applied automatically."
  },
  {
    question: "What integrations do you support?",
    answer: "We support over 50 integrations including GitHub, Jira, Figma, Google Drive, and more. We are constantly adding new ones."
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. All data is encrypted at rest and in transit. We are SOC2 compliant and perform regular security audits."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about the product and billing.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border border-border rounded-lg overflow-hidden bg-card">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between font-medium text-left hover:bg-accent/50 transition-colors"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {faq.question}
                  <ChevronDown className={cn("w-5 h-5 transition-transform duration-200 text-muted-foreground", isOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-4 pt-0 text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
