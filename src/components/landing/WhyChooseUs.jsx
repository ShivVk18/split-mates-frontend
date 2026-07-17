import React from "react";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 px-6 max-w-7xl mx-auto z-10 relative scroll-mt-24">
      {/* Unique dot glow variant for this section */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(circle_at_70%_50%,var(--foreground)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Copy */}
        <div className="space-y-6">
          <Badge className="bg-muted border border-border text-foreground px-3 py-1 rounded-full text-xs">Comparison</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Why SplitMates?</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Legacy spreadsheets are prone to mathematical errors, lack real-time synchronization, and require awkward follow-ups. SplitMates simplifies group balances automatically.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-2.5">
              <CheckCircle className="w-4.5 h-4.5 text-orange-500 shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">Automatic transaction routing simplifies multi-party balances</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <CheckCircle className="w-4.5 h-4.5 text-orange-500 shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">Smart balance reports extract monthly saving suggestions</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <CheckCircle className="w-4.5 h-4.5 text-orange-500 shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">Instant notifications keep your group updated</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Comparison Cards */}
        <div className="border border-border bg-card/30 rounded-2xl p-6 space-y-4 backdrop-blur-md">
          <h3 className="text-base font-bold text-foreground">Feature Comparison</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-border bg-background text-xs">
              <p className="text-muted-foreground font-semibold uppercase tracking-wider mb-2 text-[10px]">Typical Sheet Sharing</p>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• Manual mathematical entries & constant review</li>
                <li>• Endless transaction chains between multiple people</li>
                <li>• No currency conversion or category distribution tracking</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 text-xs">
              <p className="text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider mb-2 text-[10px]">SplitMates Ledgers</p>
              <ul className="space-y-1.5 text-foreground/80">
                <li>• Automated splits, instant sync, and clean updates</li>
                <li>• Direct balance routing minimizes payments between friends</li>
                <li>• Automatic category tag mapping & custom PDF report exports</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
