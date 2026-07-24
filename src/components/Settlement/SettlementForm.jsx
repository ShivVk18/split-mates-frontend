import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, DollarSign, Users, CreditCard, FileText, UserPlus, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import settlementService from "@/services/settlementService";

const CreateSettlementForm = ({ 
  onClose, 
  onSubmit, 
  groups, 
  balanceData, 
  loading,
  preselectedFriendId = "",
  preselectedAmount = ""
}) => {
  const [formData, setFormData] = useState({
    groupId: "",
    note: "",
    method: "CASH",
  });

  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [submitting, setSubmitting] = useState(false);
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

  // Initialize recipients based on balance data
  useEffect(() => {
    if (!balanceData) return;

    // Get everyone you owe money to (youOwe > 0)
    let initialList = balanceData.relationships
      ?.filter((r) => r.youOwe > 0)
      ?.map((r) => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        avatar: r.user.avatar,
        youOwe: r.youOwe,
        amount: r.youOwe.toString(),
        checked: true,
      })) || [];

    // If preselected recipient was passed
    if (preselectedFriendId) {
      const idx = initialList.findIndex(r => r.userId === preselectedFriendId);
      if (idx !== -1) {
        // Preselected user is already in the list
        initialList = initialList.map((r, i) => {
          if (i === idx) {
            return {
              ...r,
              checked: true,
              amount: preselectedAmount ? preselectedAmount.toString() : r.youOwe.toString(),
            };
          }
          // Uncheck other options to avoid accidental payments
          return { ...r, checked: false };
        });
      } else {
        // User not in owed list (prepayment or new friend)
        const rel = balanceData.relationships?.find(r => r.user.id === preselectedFriendId);
        initialList.unshift({
          userId: preselectedFriendId,
          name: rel?.user?.name || "Selected Friend",
          email: rel?.user?.email || "",
          avatar: rel?.user?.avatar || "",
          youOwe: rel?.youOwe || 0,
          amount: preselectedAmount ? preselectedAmount.toString() : "0",
          checked: true,
        });
        
        // Uncheck others
        initialList = initialList.map((r) => {
          if (r.userId === preselectedFriendId) return r;
          return { ...r, checked: false };
        });
      }
    }

    setSelectedRecipients(initialList);
  }, [balanceData, preselectedFriendId, preselectedAmount]);

  const handleGroupChange = (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    setSelectedGroup(group);
    setFormData({ ...formData, groupId });
    
    if (group?.members) {
      setAvailableMembers(group.members);
    }
  };

  const handleAddRecipient = (userId) => {
    if (!userId) return;

    const exists = selectedRecipients.find(r => r.userId === userId);
    if (exists) {
      setSelectedRecipients(
        selectedRecipients.map(r => r.userId === userId ? { ...r, checked: true } : r)
      );
      toast.info(`${exists.name} checked in settlement list.`);
    } else {
      const rel = balanceData?.relationships?.find(r => r.user.id === userId);
      if (rel) {
        setSelectedRecipients([
          ...selectedRecipients,
          {
            userId: rel.user.id,
            name: rel.user.name,
            email: rel.user.email,
            avatar: rel.user.avatar,
            youOwe: rel.youOwe || 0,
            amount: (rel.youOwe || 0).toString(),
            checked: true,
          }
        ]);
        toast.success(`Added ${rel.user.name} to settlement checklist.`);
      }
    }
  };

  const toggleRecipientChecked = (userId) => {
    setSelectedRecipients(
      selectedRecipients.map(r => r.userId === userId ? { ...r, checked: !r.checked } : r)
    );
  };

  const handleAmountChange = (userId, value) => {
    setSelectedRecipients(
      selectedRecipients.map(r => r.userId === userId ? { ...r, amount: value } : r)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const activePayees = selectedRecipients.filter(r => r.checked);
    if (activePayees.length === 0) {
      toast.error("Please select at least one person to pay");
      return;
    }

    // Validate amounts
    const invalid = activePayees.find(r => !r.amount || parseFloat(r.amount) <= 0);
    if (invalid) {
      toast.error(`Please enter a valid amount for ${invalid.name}`);
      return;
    }

    setSubmitting(true);
    try {
      const promises = activePayees.map((r) => {
        return settlementService.createSettlement({
          paidToId: r.userId,
          groupId: formData.groupId || undefined,
          amount: parseFloat(r.amount),
          note: formData.note,
          method: formData.method
        });
      });

      const results = await Promise.all(promises);
      toast.success(`Successfully created ${activePayees.length} settlement(s)!`);

      if (onSubmit) {
        onSubmit(results[0]);
      }
      onClose();
    } catch (error) {
      console.error("Failed to submit settlements:", error);
      toast.error(error.message || "Failed to create one or more settlements");
    } finally {
      setSubmitting(false);
    }
  };

  // Get total sum of checked inputs
  const totalSettlementAmount = selectedRecipients
    .filter(r => r.checked)
    .reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);

  // Filter out friends that are already checked/listed so user can add others
  const unlistedRelationships = balanceData?.relationships?.filter(
    rel => !selectedRecipients.some(r => r.userId === rel.user.id && r.checked)
  ) || [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-[9999] w-full max-w-lg bg-card text-foreground rounded-2xl shadow-2xl border border-border/80 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Create Settlement
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Settle balances with multiple friends at once
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Group Option */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Group (Optional)
            </label>
            <select
              value={formData.groupId}
              onChange={(e) => handleGroupChange(e.target.value)}
              disabled={loading || submitting}
              className="w-full px-4 py-3 border border-border bg-card text-foreground rounded-xl outline-none transition-all focus:border-orange-500"
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Recipient Dropdown (Allows adding prepayments/friends not owed) */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-1.5">
              <UserPlus className="h-4 w-4 text-orange-500" />
              Add Someone to Settle
            </label>
            <select
              onChange={(e) => {
                handleAddRecipient(e.target.value);
                e.target.value = ""; // reset select
              }}
              value=""
              disabled={submitting}
              className="w-full px-4 py-3 border border-border bg-card text-foreground rounded-xl outline-none focus:border-orange-500"
            >
              <option value="">-- Choose Friend to Add --</option>
              {unlistedRelationships.map((r) => (
                <option key={r.user.id} value={r.user.id}>
                  {r.user.name} {r.youOwe > 0 ? `(Owe ₹${r.youOwe})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Settle Up Recipients Checklist */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Settle With <span className="text-orange-500 font-bold">*</span>
            </label>

            {selectedRecipients.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-border rounded-xl bg-muted/20">
                <Users className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No outstanding balances found.</p>
                <p className="text-xs text-muted-foreground/80 mt-1">Select a friend above to start.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {selectedRecipients.map((r) => (
                  <div 
                    key={r.userId}
                    className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                      r.checked 
                        ? "border-orange-500/40 bg-orange-500/5" 
                        : "border-border/60 bg-muted/10 opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleRecipientChecked(r.userId)}
                        className="text-orange-500 hover:scale-105 transition-transform"
                      >
                        {r.checked ? (
                          <CheckSquare className="h-5 w-5 fill-orange-500/10" />
                        ) : (
                          <Square className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-semibold text-sm shadow-xs">
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{r.name}</p>
                        {r.youOwe > 0 ? (
                          <p className="text-xs text-red-500 font-medium">You owe: ₹{r.youOwe}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Prepayment / Settled</p>
                        )}
                      </div>
                    </div>

                    {r.checked && (
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                          ₹
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={r.amount}
                          onChange={(e) => handleAmountChange(r.userId, e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-6 pr-2 py-1.5 border border-border bg-card text-foreground rounded-lg text-sm outline-none focus:border-orange-500 font-semibold"
                          disabled={submitting}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settle Total Summary */}
          {totalSettlementAmount > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex justify-between items-center animate-in slide-in-from-top-2 duration-200">
              <span className="text-sm font-semibold text-foreground">Total Settle Amount:</span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                ₹{totalSettlementAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Payment Method <span className="text-orange-500 font-bold">*</span>
            </label>
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="w-full px-4 py-3 border border-border bg-card text-foreground rounded-xl outline-none focus:border-orange-500"
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Note
            </label>
            <textarea
              rows={2}
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Add a note..."
              className="w-full px-4 py-3 border border-border bg-card text-foreground rounded-xl outline-none resize-none focus:border-orange-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || totalSettlementAmount <= 0}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold shadow-md active:scale-95 transition-all duration-200 cursor-pointer rounded-xl"
            >
              {submitting ? "Processing..." : "Create Settlements"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSettlementForm;