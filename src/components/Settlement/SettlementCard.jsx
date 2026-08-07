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
      PENDING: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      COMPLETED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      CANCELLED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    };

    return (
      <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${colors[status] || colors.PENDING}`}>
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
          className="bg-card border border-border/80 text-foreground rounded-2xl p-5 shadow-xs hover:border-border transition-all duration-200"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Section - Payer and Payee Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {getStatusBadge(settlement.status)}
                {settlement.group && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{settlement.group.name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {settlement.paidBy.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-foreground text-sm">
                    {settlement.paidBy.name}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-muted-foreground/60" />

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      {settlement.paidTo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-foreground text-sm">
                    {settlement.paidTo.name}
                  </span>
                </div>
              </div>

              {settlement.description && (
                <p className="text-xs text-muted-foreground mb-3">
                  {settlement.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground/80">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(settlement.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{settlementHelpers.getPaymentMethodText(settlement.method)}</span>
                </div>
              </div>
            </div>

            {/* Right Section - Amount and Actions */}
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-2xl font-extrabold text-foreground tracking-tight">
                  ₹{settlement.amount.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewSettlement(settlement)}
                  className="rounded-full text-xs font-semibold px-4 cursor-pointer"
                >
                  View Details
                </Button>

                {settlement.status === "PENDING" && (
                  <Button
                    size="sm"
                    onClick={() => onCompleteSettlement(settlement.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold px-4 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
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