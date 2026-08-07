import React from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";

const BalanceSummaryCard = ({ balanceData, onCreateSettlement }) => {
  if (!balanceData) return null;

  const { totalOwed, totalOwing, netBalance, relationships } = balanceData;

  const isPositive = netBalance > 0;
  const isNegative = netBalance < 0;

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* You Owe */}
      <div className="bg-card border border-border/80 dark:border-red-500/20 dark:bg-red-950/15 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-red-100 dark:bg-red-500/20 rounded-xl">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-foreground">You Owe</h3>
          </div>
        </div>
        <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
          ₹{totalOwing.toLocaleString("en-IN")}
        </p>
        <p className="text-xs font-medium text-muted-foreground mt-2">
          {relationships?.filter(r => r.iOwe > 0).length || 0} people
        </p>
      </div>

      {/* You Are Owed */}
      <div className="bg-card border border-border/80 dark:border-emerald-500/20 dark:bg-emerald-950/15 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-foreground">You Are Owed</h3>
          </div>
        </div>
        <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
          ₹{totalOwed.toLocaleString("en-IN")}
        </p>
        <p className="text-xs font-medium text-muted-foreground mt-2">
          {relationships?.filter(r => r.owedToMe > 0).length || 0} people
        </p>
      </div>

      {/* Net Balance */}
      <div className={`bg-card border ${
        isPositive ? "border-border/80 dark:border-emerald-500/20 dark:bg-emerald-950/15" : 
        isNegative ? "border-border/80 dark:border-red-500/20 dark:bg-red-950/15" : 
        "border-border/80 dark:bg-card/80"
      } rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${
              isPositive ? "bg-emerald-100 dark:bg-emerald-500/20" : 
              isNegative ? "bg-red-100 dark:bg-red-500/20" : 
              "bg-muted dark:bg-muted"
            }`}>
              <DollarSign className={`w-5 h-5 ${
                isPositive ? "text-emerald-600 dark:text-emerald-400" : 
                isNegative ? "text-red-600 dark:text-red-400" : 
                "text-muted-foreground"
              }`} />
            </div>
            <h3 className="font-semibold text-foreground">Net Balance</h3>
          </div>
        </div>
        <p className={`text-3xl font-extrabold tracking-tight ${
          isPositive ? "text-emerald-600 dark:text-emerald-400" : 
          isNegative ? "text-red-600 dark:text-red-400" : 
          "text-foreground"
        }`}>
          {netBalance >= 0 ? "+" : ""}₹{Math.abs(netBalance).toLocaleString("en-IN")}
        </p>
        <p className="text-xs font-medium text-muted-foreground mt-2">
          {isPositive ? "You're in the positive" : 
           isNegative ? "You need to settle up" : 
           "All settled up!"}
        </p>
      </div>

      {/* Relationships Breakdown */}
      {relationships && relationships.length > 0 && (
        <div className="md:col-span-3 bg-card border border-border/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              Balance Breakdown
            </h3>
            {totalOwing > 0 && (
              <Button
                size="sm"
                onClick={onCreateSettlement}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Settle Now
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {relationships.map((relationship) => (
              <div
                key={relationship.user.id}
                className="border border-border/60 bg-muted/20 hover:bg-muted/40 rounded-xl p-4 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-xs">
                    <span className="text-white font-semibold">
                      {relationship.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {relationship.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {relationship.user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  {relationship.iOwe > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">You owe:</span>
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        ₹{relationship.iOwe.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  {relationship.owedToMe > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Owes you:</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{relationship.owedToMe.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  {relationship.iOwe === 0 && relationship.owedToMe === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-1">
                      All settled up ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceSummaryCard;