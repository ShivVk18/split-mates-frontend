import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection({ onStartFree, onWatchDemo }) {
  return (
    <section className="relative pt-36 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center z-10">
      {/* Background Dots Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(ellipse_at_center,var(--foreground)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge className="mb-6 bg-accent text-accent-foreground border border-border px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
          <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
          Intelligent Balance Auditing & Settle Up
        </Badge>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-8 max-w-4xl"
      >
        Split Group Expenses. <br />
        <span className="bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-500 bg-clip-text text-transparent">
          Without the Awkwardness.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-sm sm:text-base md:text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed"
      >
        A premium group expense sharing application with built-in debt simplification. Track transactions in real-time, generate personal savings reports, and simplify your debt charts.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4 mb-20 z-20"
      >
        <Button
          onClick={onStartFree}
          className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs px-8 py-5.5 rounded-full shadow-md transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          Get Started
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="outline"
          onClick={onWatchDemo}
          className="w-full sm:w-auto border-border text-foreground hover:bg-accent/50 font-semibold text-xs px-8 py-5.5 rounded-full transition-all duration-200 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 mr-2" />
          Watch Demo
        </Button>
      </motion.div>

      {/* Mockup Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-4xl relative rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-md shadow-lg"
      >
        <div className="relative border border-border rounded-xl overflow-hidden bg-background">
          {/* Header mockup */}
          <div className="flex justify-between items-center bg-muted/30 px-5 py-3 border-b border-border">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
            </div>
            <div className="text-[10px] text-muted-foreground font-mono tracking-wider">SPLITMATES_DASHBOARD</div>
            <div className="w-3.5 h-3.5 rounded bg-muted" />
          </div>

          {/* Mock Dashboard Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border text-left min-h-[220px]">
            {/* Left Col: Balance details */}
            <div className="p-5 space-y-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Net Account Status</div>
              <div className="text-2xl font-bold text-foreground">
                ₹11,400 <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium ml-1">in the green</span>
              </div>
              <div className="border-t border-border/60 pt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Owed to you</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">₹20,000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">You owe</span>
                  <span className="text-amber-600 dark:text-amber-500 font-medium">₹8,600</span>
                </div>
              </div>
            </div>

            {/* Right Col: Ledger analysis preview */}
            <div className="p-5 space-y-4 md:col-span-2 bg-muted/10">
              <div className="flex justify-between items-center">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Ledger Optimization</div>
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15 border-transparent text-[9px] font-semibold tracking-wider">Audit complete</Badge>
              </div>
              <div className="bg-card p-3 rounded-lg border border-border text-xs text-muted-foreground leading-relaxed font-mono space-y-2 shadow-xs">
                <p className="text-amber-600 dark:text-amber-400 font-bold">// REAL-TIME DEBT SIMPLIFICATION:</p>
                <p>We consolidated splits for <span className="text-foreground font-medium">Goa Trip 2026</span>. You owe Charlie ₹6,000, and Charlie owes Bob ₹6,000. You can pay Bob directly to resolve both splits.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
