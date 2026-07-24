import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function TimelineProcess() {
  const steps = [
    {
      num: "01",
      title: "Secure the Bag (Join & Invite)",
      description: "Sign up in seconds, pick your currency, and invite your squad to start splitting."
    },
    {
      num: "02",
      title: "Create & Log Splits",
      description: "Create logs for trips or rent. Split equally or exactly. Updates everyone's balance instantly."
    },
    {
      num: "03",
      title: "Settle Up fr fr",
      description: "See who owes what, ask our AI coach for budgeting advice, and settle up in one tap. Understood the assignment."
    }
  ];

  return (
    <section id="timeline" className="w-full bg-muted/25 border-y border-border/80 py-24 px-6 scroll-mt-24 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-muted border border-border text-foreground px-3 py-1 rounded-full text-xs">Main Quest</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">A Simple, Drama-Free Lifecycle</h2>
        </div>

        <div className="relative border-l border-border ml-4 md:ml-[50%] space-y-12 py-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center">
              {/* Node bullet */}
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, type: "spring", stiffness: 150 }}
                className="absolute -left-[5px] md:left-0 md:-translate-x-1/2 w-2.5 h-2.5 rounded-full bg-background border border-foreground/40 z-10" 
              />

              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:pl-10 md:order-2'} pl-6`}
              >
                <span className="text-3xl font-bold text-muted-foreground/30 font-mono block mb-1">{step.num}</span>
                <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
              </motion.div>
              <div className="md:w-1/2 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
