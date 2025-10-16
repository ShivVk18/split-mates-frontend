import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Users, 
  Calendar,
  CreditCard
} from "lucide-react";
import useSettlementStore from "@/stores/settlementStore";
import { settlementHelpers } from "@/services/settlementService";

export const SettlementCards = ({ onViewSettlement, onCompleteSettlement }) => {
  const { settlements } = useSettlementStore();

  const getStatusBadge = (status) => {
    const statusInfo = settlementHelpers.getSettlementStatusInfo(status);
    const colors = {
      PENDING: "bg-orange-100 text-orange-700 border-orange-200",
      COMPLETED: "bg-green-100 text-green-700 border-green-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || colors.PENDING}`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!settlements || settlements.length === 0) {
    return null;
  }

  return (
    <>
      {settlements.map((settlement) => (
        <div
          key={settlement.id}
          className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Section - Payer and Payee Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {getStatusBadge(settlement.status)}
                {settlement.group && (
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Users className="w-3 h-3" />
                    <span>{settlement.group.name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-sm">
                      {settlement.paidBy.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-slate-800">
                    {settlement.paidBy.name}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400" />

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-teal-700 font-semibold text-sm">
                      {settlement.paidTo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-slate-800">
                    {settlement.paidTo.name}
                  </span>
                </div>
              </div>

              {settlement.description && (
                <p className="text-sm text-slate-600 mb-2">
                  {settlement.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(settlement.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  <span>{settlementHelpers.getPaymentMethodText(settlement.method)}</span>
                </div>
              </div>
            </div>

            {/* Right Section - Amount and Actions */}
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-800">
                  ₹{settlement.amount.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewSettlement(settlement)}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  View Details
                </Button>

                {settlement.status === "PENDING" && (
                  <Button
                    size="sm"
                    onClick={() => onCompleteSettlement(settlement.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};