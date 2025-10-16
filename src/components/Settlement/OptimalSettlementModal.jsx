import React, { useState } from "react";
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Optimal Settlement</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Banner */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>What is Optimal Settlement?</strong><br />
              This feature calculates the minimum number of transactions needed to settle all debts within a group,
              reducing complexity and saving time.
            </p>
          </div>

          {/* Group Selection */}
          {!selectedGroupData && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Users className="w-4 h-4" />
                Select Group
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                disabled={!selectedGroup || loading}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                {loading ? "Calculating..." : "Calculate Optimal Settlement"}
              </Button>
            </div>
          )}

          {/* Results */}
          {selectedGroupData && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium mb-1">Original</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {selectedGroupData.data.originalTransactions}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">transactions needed</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium mb-1">Optimized</p>
                  <p className="text-3xl font-bold text-green-700">
                    {selectedGroupData.data.optimizedTransactions}
                  </p>
                  <p className="text-xs text-green-600 mt-1">transactions needed</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium mb-1">Savings</p>
                  <p className="text-3xl font-bold text-purple-700">
                    {selectedGroupData.data.savings}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">fewer transactions</p>
                </div>
              </div>

              {/* Optimized Transactions List */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-purple-600" />
                  Recommended Settlements
                </h3>

                {selectedGroupData.data.transactions && selectedGroupData.data.transactions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedGroupData.data.transactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          {/* Payer */}
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {transaction.from?.name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                {transaction.from?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-500">Payer</p>
                            </div>
                          </div>

                          {/* Arrow and Amount */}
                          <div className="flex flex-col items-center px-4">
                            <ArrowRight className="w-6 h-6 text-purple-600 mb-1" />
                            <p className="text-lg font-bold text-purple-600">
                              ₹{transaction.amount.toLocaleString("en-IN")}
                            </p>
                          </div>

                          {/* Payee */}
                          <div className="flex items-center gap-3 flex-1 justify-end">
                            <div className="text-right">
                              <p className="font-medium text-slate-800">
                                {transaction.to?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-500">Recipient</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {transaction.to?.name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
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
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  Calculate for Another Group
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