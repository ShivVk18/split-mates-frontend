import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, DollarSign, Users, CreditCard, FileText } from "lucide-react";

const CreateSettlementForm = ({ onClose, onSubmit, groups, balanceData, loading }) => {
  const [formData, setFormData] = useState({
    paidToId: "",
    groupId: "",
    amount: "",
    note: "",
    method: "CASH",
  });

  const [errors, setErrors] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [availableMembers, setAvailableMembers] = useState([]);

  const paymentMethods = [
    { value: "CASH", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "CARD", label: "Card" },
    { value: "PAYPAL", label: "PayPal" },
  ];

  const handleGroupChange = (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    setSelectedGroup(group);
    setFormData({ ...formData, groupId, paidToId: "" });
    
    // Get members from the selected group (you may need to fetch this)
    if (group?.members) {
      setAvailableMembers(group.members);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.paidToId) {
      newErrors.paidToId = "Please select who you're paying";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.method) {
      newErrors.method = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     console.log(formData)
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Get suggested amount based on balance data
  const getSuggestedAmount = () => {
    if (!balanceData || !formData.paidToId) return null;
    
    const relationship = balanceData.relationships?.find(
      (r) => r.user.id === formData.paidToId
    );
    
    return relationship?.youOwe || 0;
  };

  const suggestedAmount = getSuggestedAmount();

  console.log(balanceData)

  return (
   <div className="fixed inset-0 z-[9999]  flex items-center justify-center p-4 animate-in fade-in duration-200">

    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
      onClick={onClose}
    />

    {/* Modal */}
    <div className="relative z-[9999] w-full max-w-lg bg-white rounded-xl shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-xl z-10">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
            Create Settlement
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Settle balances with your friends
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5 text-slate-500" />
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">

        {/* Group */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Group (Optional)
          </label>

          <select
            value={formData.groupId}
            onChange={(e) => handleGroupChange(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pay To */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Pay To <span className="text-red-500">*</span>
          </label>

          <select
            value={formData.paidToId}
            onChange={(e) =>
              handleChange("paidToId", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
              errors.paidToId
                ? "border-red-500"
                : "border-slate-300"
            }`}
          >
            <option value="">Select Person</option>

            {balanceData?.relationships?.map((r) => (
              <option key={r.user.id} value={r.user.id}>
                {r.user.name}
                {r.youOwe > 0 &&
                  ` (You owe ₹${r.youOwe})`}
              </option>
            ))}
          </select>

          {errors.paidToId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.paidToId}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Amount *
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
              ₹
            </span>

            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                handleChange("amount", e.target.value)
              }
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
                errors.amount
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />
          </div>

          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.amount}
            </p>
          )}

          {suggestedAmount > 0 && (
            <button
              type="button"
              onClick={() =>
                handleChange(
                  "amount",
                  suggestedAmount.toString()
                )
              }
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Use suggested amount ₹{suggestedAmount}
            </button>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Payment Method *
          </label>

          <select
            value={formData.method}
            onChange={(e) =>
              handleChange("method", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
              errors.method
                ? "border-red-500"
                : "border-slate-300"
            }`}
          >
            {paymentMethods.map((method) => (
              <option
                key={method.value}
                value={method.value}
              >
                {method.label}
              </option>
            ))}
          </select>

          {errors.method && (
            <p className="text-red-500 text-sm mt-1">
              {errors.method}
            </p>
          )}
        </div>

        {/* Note */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Note
          </label>

          <textarea
            rows={3}
            value={formData.note}
            onChange={(e) =>
              handleChange("note", e.target.value)
            }
            placeholder="Add a note..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          >
            Create Settlement
          </Button>
        </div>

      </form>
    </div>
  </div>
  );
};

export default CreateSettlementForm;