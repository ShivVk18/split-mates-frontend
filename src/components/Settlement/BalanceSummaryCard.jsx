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
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-slate-800">You Owe</h3>
          </div>
        </div>
        <p className="text-3xl font-bold text-red-600">
          ₹{totalOwing.toLocaleString("en-IN")}
        </p>
        <p className="text-sm text-slate-600 mt-2">
          {relationships?.filter(r => r.youOwe > 0).length || 0} people
        </p>
      </div>

      {/* You Are Owed */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-800">You Are Owed</h3>
          </div>
        </div>
        <p className="text-3xl font-bold text-green-600">
          ₹{totalOwed.toLocaleString("en-IN")}
        </p>
        <p className="text-sm text-slate-600 mt-2">
          {relationships?.filter(r => r.owesYou > 0).length || 0} people
        </p>
      </div>

      {/* Net Balance */}
      <div className={`bg-gradient-to-br ${
        isPositive ? "from-blue-50 to-indigo-50 border-blue-200" : 
        isNegative ? "from-orange-50 to-red-50 border-orange-200" : 
        "from-slate-50 to-gray-50 border-slate-200"
      } border rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              isPositive ? "bg-blue-100" : 
              isNegative ? "bg-orange-100" : 
              "bg-slate-100"
            }`}>
              <DollarSign className={`w-5 h-5 ${
                isPositive ? "text-blue-600" : 
                isNegative ? "text-orange-600" : 
                "text-slate-600"
              }`} />
            </div>
            <h3 className="font-semibold text-slate-800">Net Balance</h3>
          </div>
        </div>
        <p className={`text-3xl font-bold ${
          isPositive ? "text-blue-600" : 
          isNegative ? "text-orange-600" : 
          "text-slate-600"
        }`}>
          {netBalance >= 0 ? "+" : ""}₹{Math.abs(netBalance).toLocaleString("en-IN")}
        </p>
        <p className="text-sm text-slate-600 mt-2">
          {isPositive ? "You're in the positive" : 
           isNegative ? "You need to settle up" : 
           "All settled up!"}
        </p>
      </div>

      {/* Relationships Breakdown */}
      {relationships && relationships.length > 0 && (
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Balance Breakdown
            </h3>
            {totalOwing > 0 && (
              <Button
                size="sm"
                onClick={onCreateSettlement}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white"
              >
                Settle Now
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {relationships.map((relationship) => (
              <div
                key={relationship.user.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {relationship.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      {relationship.user.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {relationship.user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  {relationship.youOwe > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">You owe:</span>
                      <span className="text-sm font-semibold text-red-600">
                        ₹{relationship.youOwe.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  {relationship.owesYou > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Owes you:</span>
                      <span className="text-sm font-semibold text-green-600">
                        ₹{relationship.owesYou.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  {relationship.youOwe === 0 && relationship.owesYou === 0 && (
                    <div className="text-sm text-slate-500 text-center py-1">
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