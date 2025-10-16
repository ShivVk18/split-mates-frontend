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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Create Settlement</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Group Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Users className="w-4 h-4" />
              Group (Optional)
            </label>
            <select
              value={formData.groupId}
              onChange={(e) => handleGroupChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            >
              <option value="">Select a group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pay To Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Users className="w-4 h-4" />
              Pay To <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.paidToId}
              onChange={(e) => handleChange("paidToId", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.paidToId ? "border-red-500" : "border-slate-300"
              }`}
            >
              <option value="">Select a person</option>
              {balanceData?.relationships?.map((relationship) => (
                <option key={relationship.user.id} value={relationship.user.id}>
                  {relationship.user.name} 
                  {relationship.youOwe > 0 && ` (You owe: ₹${relationship.youOwe})`}
                </option>
              ))}
            </select>
            {errors.paidToId && (
              <p className="text-red-500 text-sm mt-1">{errors.paidToId}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <DollarSign className="w-4 h-4" />
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="0.00"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.amount ? "border-red-500" : "border-slate-300"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
            {suggestedAmount > 0 && (
              <button
                type="button"
                onClick={() => handleChange("amount", suggestedAmount.toString())}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Use suggested amount: ₹{suggestedAmount}
              </button>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <CreditCard className="w-4 h-4" />
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.method}
              onChange={(e) => handleChange("method", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.method ? "border-red-500" : "border-slate-300"
              }`}
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
            {errors.method && (
              <p className="text-red-500 text-sm mt-1">{errors.method}</p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <FileText className="w-4 h-4" />
              Note (Optional)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => handleChange("note", e.target.value)}
              placeholder="Add a note about this settlement..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          {/* Actions */}
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white"
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