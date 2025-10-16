import React from "react";
import { Button } from "@/components/ui/button";
import { 
  X, 
  ArrowRight, 
  Calendar, 
  CreditCard, 
  FileText, 
  CheckCircle,
  Users,
  Clock
} from "lucide-react";
import { settlementHelpers } from "@/services/settlementService";

const ViewSettlementModal = ({ settlement, onClose, onComplete }) => {
  if (!settlement) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusInfo = settlementHelpers.getSettlementStatusInfo(settlement.status);
  const paymentMethod = settlementHelpers.getPaymentMethodText(settlement.method);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Settlement Details</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(settlement.status)}`}>
              {statusInfo.text}
            </span>
            {settlement.group && (
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">{settlement.group.name}</span>
              </div>
            )}
          </div>

          {/* Amount Card */}
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="text-sm text-slate-600 mb-2">Settlement Amount</p>
            <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              ₹{settlement.amount.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Payer and Payee */}
          <div className="bg-slate-50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              {/* Payer */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-2xl">
                    {settlement.paidBy.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="font-semibold text-slate-800">{settlement.paidBy.name}</p>
                <p className="text-sm text-slate-500">{settlement.paidBy.email}</p>
                <span className="mt-2 text-xs text-slate-600 bg-white px-3 py-1 rounded-full">
                  Payer
                </span>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center">
                <ArrowRight className="w-8 h-8 text-slate-400" />
                <p className="text-xs text-slate-500 mt-2">{paymentMethod}</p>
              </div>

              {/* Payee */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-2xl">
                    {settlement.paidTo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="font-semibold text-slate-800">{settlement.paidTo.name}</p>
                <p className="text-sm text-slate-500">{settlement.paidTo.email}</p>
                <span className="mt-2 text-xs text-slate-600 bg-white px-3 py-1 rounded-full">
                  Recipient
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Method */}
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <CreditCard className="w-4 h-4" />
                <p className="text-sm font-medium">Payment Method</p>
              </div>
              <p className="font-semibold text-slate-800">{paymentMethod}</p>
            </div>

            {/* Created Date */}
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Calendar className="w-4 h-4" />
                <p className="text-sm font-medium">Created On</p>
              </div>
              <p className="font-semibold text-slate-800 text-sm">
                {formatDate(settlement.createdAt)}
              </p>
            </div>

            {/* Settled Date (if completed) */}
            {settlement.settledAt && (
              <div className="border border-green-200 bg-green-50 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <p className="text-sm font-medium">Settled On</p>
                </div>
                <p className="font-semibold text-green-800 text-sm">
                  {formatDate(settlement.settledAt)}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {settlement.description && (
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <FileText className="w-4 h-4" />
                <p className="text-sm font-medium">Note</p>
              </div>
              <p className="text-slate-800">{settlement.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            {settlement.status === "PENDING" && (
              <Button
                onClick={() => onComplete(settlement.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSettlementModal;