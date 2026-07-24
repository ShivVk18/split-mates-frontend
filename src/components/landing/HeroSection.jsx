import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Play, 
  DollarSign, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Users, 
  Receipt 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
          No cap, simplify your splits & settle up fr fr 💸
        </Badge>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-8 max-w-4xl"
      >
        Split Group Expenses. <br />
        <span className="text-orange-500">
          Without the Awkward Vibes.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-sm sm:text-base md:text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed"
      >
        Lowkey the best way to split expenses with your besties. Track who owes what in real-time, simplify debt charts, and consult our AI coach to save cash. No cap.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4 mb-20 z-20"
      >
        <motion.div
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="w-full sm:w-auto"
        >
          <Button
            onClick={onStartFree}
            className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs px-8 py-5.5 rounded-full shadow-md transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="w-full sm:w-auto"
        >
          <Button
            variant="outline"
            onClick={onWatchDemo}
            className="w-full border-border text-foreground hover:bg-accent/50 font-semibold text-xs px-8 py-5.5 rounded-full transition-all duration-200 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 mr-2" />
            Watch Demo
          </Button>
        </motion.div>
      </motion.div>

      {/* Mockup Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        whileHover={{ y: -8, rotateX: 2.5, rotateY: -1.5, transition: { duration: 0.3, ease: "easeOut" } }}
        style={{ perspective: 1000 }}
        className="w-full max-w-4xl relative rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-md shadow-lg transform-gpu cursor-default"
      >
        <div className="relative border border-border rounded-xl overflow-hidden bg-background">
          {/* Header mockup */}
          <div className="flex justify-between items-center bg-muted/30 px-4 py-2.5 border-b border-border">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
            </div>
            <div className="text-[10px] text-muted-foreground font-mono tracking-wider">SPLITMATES_DASHBOARD</div>
            <div className="w-3 h-3 rounded bg-muted" />
          </div>

          {/* Actual Dashboard Replica */}
          <div className="p-4 md:p-6 text-left space-y-5 bg-card/10">
            {/* Mock Welcome Banner */}
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-bold text-foreground">Welcome back, Alice</h4>
                <p className="text-[10px] text-muted-foreground">Manage your group shares and track balances</p>
              </div>
              <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/15 border-transparent text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                Active Session
              </Badge>
            </div>

            {/* Mock Stats Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Expenses", value: "₹24,500", icon: DollarSign, textColor: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-500/10" },
                { label: "You're Owed", value: "₹15,000", icon: ArrowDownLeft, textColor: "text-foreground", bgColor: "bg-muted" },
                { label: "You Owe", value: "₹3,600", icon: ArrowUpRight, textColor: "text-foreground", bgColor: "bg-muted" },
                { label: "Active Groups", value: "3", icon: Users, textColor: "text-foreground", bgColor: "bg-muted" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  className="bg-background border border-border/80 rounded-xl p-3 flex items-center justify-between shadow-2xs cursor-pointer"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground truncate">{stat.label}</p>
                    <p className={`text-sm font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                  <div className={`w-7 h-7 rounded-lg ${stat.bgColor} flex items-center justify-center shrink-0`}>
                    <stat.icon className="h-3 w-3 text-foreground" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mock Main Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mock Recent Expenses */}
              <div className="bg-background border border-border/80 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-1">
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-blue-600" />
                    Recent Expenses
                  </p>
                  <span className="text-[9px] text-muted-foreground hover:underline cursor-pointer">View All</span>
                </div>
                <div className="space-y-2">
                  {[
                    { title: "Dinner at Café", group: "Goa Trip 2026", amt: "₹1,200.00", cat: "Food", color: "emerald" },
                    { title: "Uber Ride", group: "Roomies", amt: "₹450.00", cat: "Transport", color: "blue" },
                    { title: "WiFi Bill", group: "Roomies", amt: "₹999.00", cat: "Utilities", color: "orange" }
                  ].map((exp, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-muted/10 border border-slate-100 dark:border-border/30 text-[10px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-6 h-6 rounded bg-${exp.color}-500/10 flex items-center justify-center text-${exp.color}-600 shrink-0`}>
                          <Receipt className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{exp.title}</p>
                          <p className="text-[8px] text-muted-foreground">{exp.group}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-foreground">{exp.amt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock Balance Summary */}
              <div className="bg-background border border-border/80 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-1">
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-foreground" />
                    Balance Summary
                  </p>
                  <span className="text-[9px] text-muted-foreground">Active</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "John Davis", type: "owes", status: "Owes you", amt: "₹12,000.00", btn: "Request", style: "border-emerald-200 text-emerald-700 hover:bg-emerald-50", color: "emerald" },
                    { name: "Bob Prince", type: "owed", status: "You owe", amt: "₹3,600.00", btn: "Pay", style: "border-red-200 text-red-700 hover:bg-red-50", color: "red" },
                    { name: "Diana Prince", type: "owes", status: "Owes you", amt: "₹3,000.00", btn: "Request", style: "border-emerald-200 text-emerald-700 hover:bg-emerald-50", color: "emerald" }
                  ].map((bal, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-muted/10 border border-slate-100 dark:border-border/30 text-[10px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="w-6 h-6 shrink-0 border border-border">
                          <AvatarFallback className="bg-muted text-foreground text-[8px] font-bold">
                            {bal.name.split(" ").map(n=>n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{bal.name}</p>
                          <p className="text-[8px] text-muted-foreground">{bal.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <p className={`font-bold text-${bal.color}-600`}>{bal.amt}</p>
                        <Button size="xs" className="h-5 text-[8px] px-2 py-0.5 rounded border border-border bg-background text-foreground hover:bg-muted font-medium cursor-pointer">
                          {bal.btn}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
