import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingDown } from "lucide-react";
import { Modal, ModalFooter } from "@/components/ui/Modal";

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Optimal settlement algorithm"
      subtitle="Minimize transaction counts across your group balances"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Info Banner */}
        {!loading && !selectedGroupData && (
          <div className="bg-muted/30 border border-border/60 rounded-xl p-4">
            <p className="text-xs text-foreground/90 font-medium">What is Optimal Settlement?</p>
            <p className="text-xs text-muted-foreground mt-1">
              Calculates the minimum number of net transactions required to settle all group debts, eliminating redundant back-and-forth payments.
            </p>
          </div>
        )}

        {/* AI Computing Animation */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-10 h-10 border-2 border-foreground border-t-transparent rounded-full"
            />
            <div className="text-center space-y-1">
              <p className="text-xs font-semibold text-foreground">Calculating optimal transfers...</p>
              <p className="text-[11px] text-muted-foreground">Simplifying balances and generating recommendations.</p>
            </div>
          </div>
        )}

        {/* Group Selection */}
        {!selectedGroupData && !loading && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground/90 uppercase tracking-wider mb-1.5 block">
                Select group
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full h-11 px-3.5 bg-background border border-border/80 text-foreground rounded-xl focus:border-foreground/40 focus:ring-2 focus:ring-foreground/5 transition-all text-sm outline-none"
              >
                <option value="">Choose a group...</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-10 px-4 text-sm font-medium border-border/80 bg-background text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCalculate}
                disabled={!selectedGroup}
                className="h-10 px-5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Calculate
              </Button>
            </ModalFooter>
          </div>
        )}

        {/* Optimal Results Display */}
        {selectedGroupData && !loading && (
          <div className="space-y-5">
            {/* Efficiency Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/20 border border-border/60 rounded-xl p-3.5 text-center">
                <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">Before</p>
                <p className="text-lg font-bold text-foreground mt-0.5">
                  {selectedGroupData.data?.originalTransactions || selectedGroupData.originalCount || 0} transfers
                </p>
              </div>

              <div className="bg-muted/30 border border-border/80 rounded-xl p-3.5 text-center">
                <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">After</p>
                <p className="text-lg font-bold text-foreground mt-0.5 flex items-center justify-center gap-1">
                  <TrendingDown className="h-4 w-4 text-emerald-500" />
                  {selectedGroupData.data?.optimizedTransactions || selectedGroupData.optimizedCount || 0} transfers
                </p>
              </div>
            </div>

            {/* Summary Recommendation */}
            {selectedGroupData.data?.aiSummary && (
              <div className="bg-muted/20 border border-border/60 rounded-xl p-3.5 space-y-1">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">AI Summary</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedGroupData.data.aiSummary}
                </p>
              </div>
            )}

            {/* Optimized Transactions List */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/90 uppercase tracking-wider block">
                Recommended Transfers
              </label>

              {(selectedGroupData.data?.transactions || selectedGroupData.transactions)?.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">All balances settled!</p>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {(selectedGroupData.data?.transactions || selectedGroupData.transactions)?.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{t.from?.name || t.fromName}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{t.to?.name || t.toName}</span>
                      </div>
                      <span className="font-bold text-foreground">
                        ₹{t.amount?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-10 px-4 text-sm font-medium border-border/80 bg-background text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
              >
                Close
              </Button>
            </ModalFooter>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default OptimalSettlementModal;