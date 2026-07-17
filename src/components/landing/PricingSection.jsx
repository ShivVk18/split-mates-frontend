import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PricingSection({ onPlanSelect }) {
  const [period, setPeriod] = useState("monthly");

  const plans = [
    {
      name: "Starter",
      price: 0,
      description: "Ideal for roommate groups and occasional trips.",
      features: [
        "Up to 3 active groups",
        "Standard equal bill splitting",
        "Basic expense categorization",
        "Mobile & Web dashboard access",
        "Email customer support"
      ],
      cta: "Get Started Free"
    },
    {
      name: "Pro",
      price: period === "monthly" ? 5 : 4,
      description: "For power users looking to save money and gain insights.",
      features: [
        "Unlimited active groups",
        "Smart Wealth Coach",
        "Premium Monthly savings reports",
        "Styled PDF exports",
        "Advanced custom split structures",
        "Smart automatic overdue reminders",
        "Priority 24/7 support"
      ],
      cta: "Try Pro Free",
      popular: true
    },
    {
      name: "Enterprise",
      price: 15,
      description: "Tailored for organizations and travel agencies.",
      features: [
        "Everything in Pro",
        "Custom workspace integrations",
        "Receipt scanning & OCR automation",
        "Dedicated success manager",
        "Custom SLA guarantees",
        "Developer API & webhook access"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="w-full bg-muted/20 border-y border-border py-24 px-6 scroll-mt-24 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-muted border border-border text-foreground px-3 py-1 rounded-full text-xs">Pricing</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Pricing Plans</h2>
          
          {/* Switch toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-xs ${period === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"}`}>Monthly</span>
            <button 
              onClick={() => setPeriod(period === "monthly" ? "annually" : "monthly")}
              className="w-9 h-5 bg-muted border border-border rounded-full p-0.5 transition-colors duration-200 flex items-center relative cursor-pointer"
            >
              <div className={`w-3.5 h-3.5 bg-foreground rounded-full transition-transform duration-200 ${period === "annually" ? "translate-x-4" : ""}`} />
            </button>
            <span className={`text-xs ${period === "annually" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Annually <span className="text-[10px] text-orange-600 dark:text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded-full ml-1 font-bold">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl border ${plan.popular ? 'border-orange-500/35 dark:border-orange-500/25 ring-1 ring-orange-500/10' : 'border-border'} bg-card p-6 flex flex-col justify-between relative overflow-hidden shadow-xs`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-orange-600 text-white text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-lg">
                  Recommended
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-xs text-muted-foreground ml-1">/month</span>
                </div>
                <hr className="border-border" />
                <ul className="space-y-3 text-xs text-muted-foreground">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <Button 
                  onClick={onPlanSelect}
                  className={`w-full py-4.5 rounded-xl font-bold text-xs ${
                    plan.popular 
                      ? 'bg-foreground text-background hover:bg-foreground/90' 
                      : 'bg-muted hover:bg-accent text-foreground border border-border'
                  } transition-all duration-200 cursor-pointer`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
