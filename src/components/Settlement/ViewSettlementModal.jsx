import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Calendar, 
  CreditCard, 
  FileText, 
  CheckCircle,
  Users
} from "lucide-react";
import { settlementHelpers } from "@/services/settlementService";
import { Modal, ModalFooter } from "@/components/ui/Modal";

const ViewSettlementModal = ({ settlement, onClose, onComplete }) => {
  if (!settlement) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusInfo = settlementHelpers.getSettlementStatusInfo(settlement.status);
  const paymentMethod = settlementHelpers.getPaymentMethodText(settlement.method);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Settlement details"
      subtitle={`Transaction reference #${settlement.id?.slice(-8) || "details"}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Status Badge & Group */}
        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(settlement.status)}`}>
            {statusInfo.text}
          </span>
          {settlement.group && (
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
              <Users className="w-3.5 h-3.5" />
              <span>{settlement.group.name}</span>
            </div>
          )}
        </div>

        {/* Amount Surface Card */}
        <div className="bg-muted/30 border border-border/60 rounded-xl p-5 text-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Settlement Amount</p>
          <p className="text-4xl font-extrabold text-foreground">
            ₹{settlement.amount.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Payer and Payee */}
        <div className="bg-muted/20 border border-border/60 rounded-xl p-4">
          <div className="flex items-center justify-between">
            {/* Payer */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-muted border border-border/60 flex items-center justify-center mb-2">
                <span className="text-foreground font-semibold text-lg">
                  {settlement.paidBy.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="font-semibold text-xs text-foreground">{settlement.paidBy.name}</p>
              <span className="mt-1 text-[10px] text-muted-foreground uppercase font-semibold">
                Payer
              </span>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center px-4">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Payee */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-muted border border-border/60 flex items-center justify-center mb-2">
                <span className="text-foreground font-semibold text-lg">
                  {settlement.paidTo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="font-semibold text-xs text-foreground">{settlement.paidTo.name}</p>
              <span className="mt-1 text-[10px] text-muted-foreground uppercase font-semibold">
                Recipient
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-muted/20 border border-border/40 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Date</span>
            </div>
            <p className="font-medium text-foreground">{formatDate(settlement.createdAt)}</p>
          </div>

          <div className="bg-muted/20 border border-border/40 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment Method</span>
            </div>
            <p className="font-medium text-foreground">{paymentMethod}</p>
          </div>
        </div>

        {/* Notes */}
        {settlement.description && (
          <div className="bg-muted/20 border border-border/40 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
              <FileText className="w-3.5 h-3.5" />
              <span>Note</span>
            </div>
            <p className="text-xs text-foreground/90">{settlement.description}</p>
          </div>
        )}

        <ModalFooter>
          {settlement.status === "PENDING" && onComplete && (
            <Button
              onClick={() => onComplete(settlement.id)}
              className="h-10 px-4 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-xl transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Mark as complete
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={onClose}
            className="h-10 px-4 text-sm font-medium border-border/80 bg-background text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
          >
            Close
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default ViewSettlementModal;