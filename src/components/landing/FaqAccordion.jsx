import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FaqAccordion() {
  const [activeIdx, setActiveIdx] = useState(null);

  const faqs = [
    {
      question: "How does the smart bill split auditor work?",
      answer: "The auditor compiles all transaction records and splits in your groups from the last 30 days. It processes this data using our built-in optimization engine, analyzes net patterns, isolates excessive spends, and formats recommendations (savings, debt-simplification) in a clean document."
    },
    {
      question: "Is my personal data encrypted?",
      answer: "Yes, fully. All group names, transactions, and split records are encrypted end-to-end. Your account access is protected using industry-standard secure token checks."
    },
    {
      question: "Can I generate PDF reports for my group?",
      answer: "Yes. From the group reports tab, you can click 'Download PDF' to save a clean, high-quality, print-ready document version."
    },
    {
      question: "Is there a limit to how many friends I can add?",
      answer: "No. You can send invitations to any friend, and they will receive alerts on their dashboard instantly."
    }
  ];

  return (
    <section id="faqs" className="py-24 px-6 max-w-4xl mx-auto z-10 relative scroll-mt-24">
      {/* Unique diagonal line background style for FAQ */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.01] dark:opacity-[0.02] bg-[linear-gradient(135deg,var(--foreground)_25%,transparent_25%,transparent_50%,var(--foreground)_50%,var(--foreground)_75%,transparent_75%,transparent_100%)] bg-[size:40px_40px]" />

      <div className="text-center mb-16 relative z-10">
        <Badge className="mb-4 bg-muted border border-border text-foreground px-3 py-1 rounded-full text-xs">Help</Badge>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4 relative z-10">
        {faqs.map((faq, idx) => {
          const isOpen = activeIdx === idx;
          return (
            <div 
              key={idx} 
              className="border border-border rounded-xl bg-card/20 overflow-hidden transition-colors duration-200"
            >
              <button
                onClick={() => setActiveIdx(isOpen ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-xs md:text-sm text-foreground hover:bg-accent/40 transition-colors duration-150 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-orange-500 shrink-0" />
                  {faq.question}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 pt-1 text-[11px] md:text-xs text-muted-foreground leading-relaxed border-t border-border/60">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
