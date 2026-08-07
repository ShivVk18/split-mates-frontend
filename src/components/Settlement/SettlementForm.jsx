import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, DollarSign, Users, CreditCard, FileText, UserPlus, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import settlementService from "@/services/settlementService";
import { Modal, ModalFooter } from "@/components/ui/Modal";

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create settlement"
      subtitle="Settle balances with one or multiple friends"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Group Option */}
        <div>
          <label className="text-xs font-semibold text-foreground/90 uppercase tracking-wider mb-1.5 block">
            Group <span className="text-muted-foreground font-normal lowercase">(optional)</span>
          </label>
          <select
            value={formData.groupId}
            onChange={(e) => handleGroupChange(e.target.value)}
            disabled={loading || submitting}
            className="w-full h-11 px-3.5 bg-background border border-border/80 text-foreground rounded-xl focus:border-foreground/40 focus:ring-2 focus:ring-foreground/5 transition-all text-sm outline-none"
          >
            <option value="">Select group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Recipient Dropdown */}
        <div>
          <label className="text-xs font-semibold text-foreground/90 uppercase tracking-wider mb-1.5 block">
            Add recipient
          </label>
          <select
            onChange={(e) => {
              handleAddRecipient(e.target.value);
              e.target.value = "";
            }}
            value=""
            disabled={submitting}
            className="w-full h-11 px-3.5 bg-background border border-border/80 text-foreground rounded-xl focus:border-foreground/40 focus:ring-2 focus:ring-foreground/5 transition-all text-sm outline-none"
          >
            <option value="">-- Choose friend to add --</option>
            {unlistedRelationships.map((r) => (
              <option key={r.user.id} value={r.user.id}>
                {r.user.name} {r.youOwe > 0 ? `(Owe ₹${r.youOwe})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Settle Up Recipients Checklist */}
        <div>
          <label className="text-xs font-semibold text-foreground/90 uppercase tracking-wider mb-2 block">
            Recipients *
          </label>

          {selectedRecipients.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-border/60 rounded-xl bg-muted/20">
              <p className="text-xs text-muted-foreground font-medium">No outstanding balances selected.</p>
              <p className="text-[11px] text-muted-foreground/70 mt-0.5">Select a friend above to start.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {selectedRecipients.map((r) => (
                <div 
                  key={r.userId}
                  className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                    r.checked 
                      ? "border-border bg-muted/30" 
                      : "border-border/40 bg-muted/10 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleRecipientChecked(r.userId)}
                      className="text-foreground hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {r.checked ? (
                        <CheckSquare className="h-4 w-4 text-foreground" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    <div className="w-7 h-7 rounded-full bg-muted text-foreground flex items-center justify-center font-medium text-xs">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-xs text-foreground">{r.name}</p>
                      {r.youOwe > 0 ? (
                        <p className="text-[11px] text-muted-foreground">Owe: ₹{r.youOwe}</p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">Prepayment / Settled</p>
                      )}
                    </div>
                  </div>

                  {r.checked && (
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        ₹
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={r.amount}
                        onChange={(e) => handleAmountChange(r.userId, e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-6 pr-2 py-1 bg-background border border-border/80 text-foreground rounded-lg text-xs outline-none focus:border-foreground/40 font-semibold"
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
          <div className="bg-muted/30 border border-border/60 rounded-xl p-3.5 flex justify-between items-center">
            <span className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">Total amount:</span>
            <span className="text-base font-bold text-foreground">
              ₹{totalSettlementAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Payment Method */}
        <div>
          <label className="text-xs font-semibold text-foreground/90 uppercase tracking-wider mb-1.5 block">
            Payment method *
          </label>
          <select
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            className="w-full h-11 px-3.5 bg-background border border-border/80 text-foreground rounded-xl focus:border-foreground/40 focus:ring-2 focus:ring-foreground/5 transition-all text-sm outline-none"
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
          <label className="text-xs font-semibold text-foreground/90 uppercase tracking-wider mb-1.5 block">
            Note <span className="text-muted-foreground font-normal lowercase">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Add a note..."
            className="w-full px-3.5 py-2.5 bg-background border border-border/80 text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:border-foreground/40 focus:ring-2 focus:ring-foreground/5 transition-all resize-none text-sm outline-none"
          />
        </div>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="h-10 px-4 text-sm font-medium border-border/80 bg-background text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting || totalSettlementAmount <= 0}
            className="h-10 px-5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {submitting ? "Processing..." : "Create settlement"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default CreateSettlementForm;