import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CtaSection({ onSignUp }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onSignUp();
    }
  };

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto z-10 relative">
      <div className="relative rounded-2xl border border-border bg-card/40 p-8 md:p-16 text-center overflow-hidden shadow-sm backdrop-blur-md">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_60%)] opacity-30" />
        
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-none">Ready to Split Smarter?</h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-md mx-auto">
            Take control of your group expenses. No complex spreadsheets. Try our Gemini AI coach, track settlements in one tap, and get clean, exportable reports.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-sm mx-auto pt-4">
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/90 border-border text-foreground placeholder:text-muted-foreground/60 rounded-xl py-5 text-xs"
              required
            />
            <Button 
              type="submit"
              className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 font-bold text-xs py-5 px-6 rounded-xl shrink-0 transition-transform duration-150 active:scale-95 cursor-pointer"
            >
              Get Started Free
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground/75">Free plan available forever • Up to 3 active groups • No credit card required</p>
        </div>
      </div>
    </section>
  );
}
