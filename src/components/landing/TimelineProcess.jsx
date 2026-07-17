import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function TimelineProcess() {
  const steps = [
    {
      num: "01",
      title: "Join & Invite",
      description: "Sign up using email, configure your preferred timezone and default currency (INR, USD, EUR, etc.), and invite friends to begin sharing expenses."
    },
    {
      num: "02",
      title: "Create Group & Add Split",
      description: "Establish shared group logs (e.g. travel, roommates). Log splits equally or exactly. Instantly updates logs for all group members."
    },
    {
      num: "03",
      title: "Generate Audits & Settle",
      description: "View net balance metrics compiled by your groups. Consult the smart wealth coach for optimization tips and mark debts as settled."
    }
  ];

  return (
    <section id="timeline" className="w-full bg-muted/25 border-y border-border/80 py-24 px-6 scroll-mt-24 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-muted border border-border text-foreground px-3 py-1 rounded-full text-xs">Timeline</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">A Simple, Transparent Lifecycle</h2>
        </div>

        <div className="relative border-l border-border ml-4 md:ml-1/2 space-y-12 py-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center">
              {/* Node bullet */}
              <div className="absolute -left-[5px] md:left-1/2 md:-translate-x-1/2 w-2.5 h-2.5 rounded-full bg-background border border-foreground/40 z-10" />

              <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:pl-10 md:order-2'} pl-6`}>
                <span className="text-3xl font-bold text-muted-foreground/30 font-mono block mb-1">{step.num}</span>
                <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
              </div>
              <div className="md:w-1/2 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
