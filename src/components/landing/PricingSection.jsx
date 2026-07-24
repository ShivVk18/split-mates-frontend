import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PricingSection({ onPlanSelect }) {
  return (
    <section id="pricing" className="w-full bg-muted/20 border-y border-border py-24 px-6 scroll-mt-24 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-muted border border-border text-foreground px-3 py-1 rounded-full text-xs">Cost Vibe</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Subscription Plans</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">Sleek, transparent pricing tiers built for you and the crew.</p>
        </div>

        {/* Coming Soon Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4, transition: { duration: 0.25 } }}
          className="bg-card border border-border rounded-2xl p-8 md:p-12 max-w-3xl mx-auto shadow-md backdrop-blur-md relative overflow-hidden transform-gpu cursor-default"
        >
          {/* Decorative Sparkle corner */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            {/* Description Col */}
            <div className="md:col-span-3 space-y-4">
              <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-transparent text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full">
                Beta Era Special
              </Badge>
              <h3 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                Premium Tiers — Coming Soon (Lowkey Free)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We are currently cooking up our premium subscription models. During our beta era, **all premium capabilities** (including AI-Powered settlements, advanced custom splits, and automated reminders) are **100% free** for all users! No cap.
              </p>
              
              <div className="pt-2">
                <Button 
                  onClick={onPlanSelect}
                  className="bg-foreground text-background hover:bg-foreground/90 font-bold text-xs py-4 px-6 rounded-xl cursor-pointer transition-transform duration-150 active:scale-95 flex items-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  Get Early Access Now
                </Button>
              </div>
            </div>

            {/* Features Col */}
            <div className="md:col-span-2 space-y-3 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
              <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2">What is included free:</p>
              {[
                "Unlimited Active Groups",
                "AI-Powered Settlements",
                "Advanced custom split types",
                "Auto categorizations",
                "Smart overdue reminders"
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
