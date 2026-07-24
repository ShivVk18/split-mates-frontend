import React from "react";
import { motion } from "framer-motion";
import { Calculator, Bell, Shield, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -35 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
};

const fadeInRight = {
  initial: { opacity: 0, x: 35 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
};

const iconHover = {
  initial: { rotate: 0, scale: 1 },
  hover: { rotate: 8, scale: 1.15, transition: { duration: 0.25, ease: "easeOut" } }
};

export default function BentoFeatures() {
  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto z-10 relative scroll-mt-24">
      {/* Background variant for features section */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03] bg-[linear-gradient(45deg,var(--foreground)_25%,transparent_25%,transparent_75%,var(--foreground)_75%,var(--foreground)_100%)] bg-[size:30px_30px]" />

      <div className="text-center mb-16 relative z-10">
        <Badge className="mb-4 bg-muted border border-border text-foreground px-3 py-1 rounded-full text-xs">Vibe Check</Badge>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">No Cap Features. Pure Aesthetics.</h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">Built different to split simply. Here's how we keep your friendships valid.</p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Card 1: Large (Wealth Auditor) */}
        <motion.div 
          variants={fadeInLeft}
          initial="initial"
          whileInView="whileInView"
          whileHover={{ y: -8, scale: 1.015, transition: { type: "spring", stiffness: 350, damping: 22 } }}
          viewport={{ once: true }}
          className="md:col-span-2 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between cursor-default"
        >
          <div className="space-y-4">
            <motion.div 
              variants={iconHover}
              className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center origin-center"
            >
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground">Smart Wealth Auditor (AI is cooking)</h3>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-md">
              Generates custom monthly reports and personal savings insights. Audits your group's spending patterns and tells you who is lowkey overspending.
            </p>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
            <span className="bg-muted px-2.5 py-1 rounded-md border border-border/50">✓ Auto-categorized</span>
            <span className="bg-muted px-2.5 py-1 rounded-md border border-border/50">✓ Personal savings tips</span>
            <span className="bg-muted px-2.5 py-1 rounded-md border border-border/50">✓ PDF Export ready</span>
          </div>
        </motion.div>

        {/* Card 2: Small (Group splits) */}
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          whileHover={{ y: -8, scale: 1.015, transition: { type: "spring", stiffness: 350, damping: 22 } }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md hover:border-border/100 transition-all duration-300 flex flex-col justify-between cursor-default"
        >
          <div>
            <motion.div 
              variants={iconHover}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-5 origin-center"
            >
              <Calculator className="w-5 h-5 text-foreground" />
            </motion.div>
            <h3 className="text-lg font-bold text-foreground mb-2">Splits That Hit Different</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Split equally, by custom amount, or by percentage. Perfect for trips, dinners, and roommate eras.
            </p>
          </div>
        </motion.div>

        {/* Card 3: Small (Smart reminders) */}
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          whileHover={{ y: -8, scale: 1.015, transition: { type: "spring", stiffness: 350, damping: 22 } }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md hover:border-border/100 transition-all duration-300 flex flex-col justify-between cursor-default"
        >
          <div>
            <motion.div 
              variants={iconHover}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-5 origin-center"
            >
              <Bell className="w-5 h-5 text-foreground" />
            </motion.div>
            <h3 className="text-lg font-bold text-foreground mb-2">Auto Remind (No Awkward Texts)</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Tracks who's slacking on their share and lowkey pings them to settle up without the awkward texts.
            </p>
          </div>
        </motion.div>

        {/* Card 4: Large (Groups & Friendships) */}
        <motion.div 
          variants={fadeInRight}
          initial="initial"
          whileInView="whileInView"
          whileHover={{ y: -8, scale: 1.015, transition: { type: "spring", stiffness: 350, damping: 22 } }}
          viewport={{ once: true }}
          className="md:col-span-2 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md hover:border-border/100 transition-all duration-300 flex flex-col justify-between cursor-default"
        >
          <div className="space-y-4">
            <motion.div 
              variants={iconHover}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center origin-center"
            >
              <Users className="w-5 h-5 text-foreground" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground">Bestie Circle & Group Logs</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Build your trusted inner circle, invite friends, and share expense logs securely with the crew.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
