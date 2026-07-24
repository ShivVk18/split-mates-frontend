import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, TrendingDown, Sparkles, Users } from "lucide-react";

const OptimalSettlementModal = ({ groups, onClose, onCalculate, selectedGroupData }) => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    if (!selectedGroup) return;
    
    setLoading(true);
    try {
      await onCalculate(selectedGroup);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card text-foreground rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <h2 className="text-2xl font-bold text-white">
              AI Optimal Settlement
            </h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors text-white group">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Banner */}
          {!loading && !selectedGroupData && (
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 dark:bg-none dark:bg-muted/50 dark:border-border/50 rounded-lg p-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <strong className="text-slate-800 dark:text-foreground">What is AI Optimal Settlement?</strong><br />
                This feature uses SplitMates AI to calculate the minimum number of transactions needed to settle all debts within a group, reducing transaction complexity and saving your group transfer fees.
              </p>
            </div>
          )}

          {/* AI Computing Aura Pulse */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-5">
              <div className="relative flex items-center justify-center">
                {/* Concentric aura pulse rings */}
                <motion.div 
                  animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  className="absolute w-12 h-12 bg-orange-500/30 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.35 }}
                  className="absolute w-12 h-12 bg-orange-500/40 rounded-full"
                />
                
                {/* Center Sparkles Icon */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-foreground">SplitMates AI is analyzing...</p>
                <p className="text-[10px] text-muted-foreground max-w-xs">Optimizing transaction routes and drafting saving suggestions with Gemini.</p>
              </div>
            </div>
          )}

          {/* Group Selection */}
          {!selectedGroupData && !loading && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                Select Group
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-3 border border-input bg-card text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Choose a group...</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>

              <Button
                onClick={handleCalculate}
                disabled={!selectedGroup}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                Ask AI to Optimize Settlements
              </Button>
            </div>
          )}

          {/* Results */}
          {selectedGroupData && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 dark:bg-none dark:bg-blue-900/10 dark:border-blue-800/20 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium mb-1">Original</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {selectedGroupData.data.originalTransactions}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">transactions needed</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 dark:bg-none dark:bg-green-900/10 dark:border-green-800/20 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium mb-1">Optimized</p>
                  <p className="text-3xl font-bold text-green-700">
                    {selectedGroupData.data.optimizedTransactions}
                  </p>
                  <p className="text-xs text-green-600 mt-1">transactions needed</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 dark:bg-none dark:bg-orange-900/10 dark:border-orange-800/20 rounded-lg p-4">
                  <p className="text-sm text-orange-600 font-medium mb-1">Savings</p>
                  <p className="text-3xl font-bold text-orange-700">
                    {selectedGroupData.data.savings}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">fewer transactions</p>
                </div>
              </div>

              {/* AI Insights Card */}
              {selectedGroupData.data.aiSummary && (
                <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 dark:from-orange-500/5 dark:to-amber-500/5 dark:border-orange-500/10 rounded-xl p-5 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full pointer-events-none" />
                  <h4 className="font-bold text-slate-800 dark:text-foreground text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                    SplitMates AI Insights
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line prose dark:prose-invert">
                    {selectedGroupData.data.aiSummary}
                  </p>
                </div>
              )}

              {/* Optimized Transactions List */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-blue-600" />
                  Recommended Settlements
                </h3>

                {selectedGroupData.data.transactions && selectedGroupData.data.transactions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedGroupData.data.transactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-muted/10 border border-slate-200 dark:border-border/50 rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          {/* Payer and Recipient info */}
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold border bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/20 dark:border-orange-900/30 dark:text-orange-400">
                                AI Recommended Route
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              {/* Payer */}
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
                                  <span className="text-blue-700 dark:text-blue-400 font-semibold text-sm">
                                    {transaction.from?.name?.charAt(0).toUpperCase() || "?"}
                                  </span>
                                </div>
                                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                                  {transaction.from?.name || "Unknown"}
                                </span>
                              </div>

                              <ArrowRight className="w-4 h-4 text-slate-400" />

                              {/* Recipient */}
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950/40 flex items-center justify-center">
                                  <span className="text-teal-700 dark:text-teal-400 font-semibold text-sm">
                                    {transaction.to?.name?.charAt(0).toUpperCase() || "?"}
                                  </span>
                                </div>
                                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                                  {transaction.to?.name || "Unknown"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Section - Amount */}
                          <div className="flex flex-col sm:items-end justify-center">
                            <p className="text-xl font-extrabold text-slate-800 dark:text-slate-200">
                              ₹{transaction.amount.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-lg">
                    <p className="text-slate-600">No settlements needed - all balanced! 🎉</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedGroup("");
                    onClose();
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setSelectedGroup("")}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                >
                  Optimize Another Group
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimalSettlementModal;