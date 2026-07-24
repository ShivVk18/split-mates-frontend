import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExpenseSchema } from "@/utils/zodSchema";
import groupService from "@/services/groupService";
import { toast } from "sonner";

const AddExpense = ({ onClose, onSubmit, groups = [], loading = false }) => {
  const form = useForm({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      groupId: "",
      description: "",
      amount: "",
      currency: "INR",
      splitType: "EQUAL",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      paidById: "",
      splits: [],
      tagIds: [],
    },
  });

  const [groupMembers, setGroupMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberSplits, setMemberSplits] = useState({});

  const handleSplitInputChange = (userId, value) => {
    setMemberSplits((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  const splitType = form.watch("splitType");

  useEffect(() => {
    if (!groupMembers || groupMembers.length === 0) return;

    const initialSplits = {};
    groupMembers.forEach((member) => {
      if (splitType === "SHARES") {
        initialSplits[member.id] = "1";
      } else {
        initialSplits[member.id] = "";
      }
    });
    setMemberSplits(initialSplits);
  }, [groupMembers, splitType]);

  const isSplitValid = () => {
    const amountVal = parseFloat(form.watch("amount") || 0);

    if (splitType === "EQUAL") {
      return { valid: true, message: "" };
    }

    if (splitType === "EXACT") {
      const totalExact = groupMembers.reduce((sum, m) => sum + (parseFloat(memberSplits[m.id]) || 0), 0);
      const diff = Math.abs(totalExact - amountVal);
      if (diff > 0.01) {
        return {
          valid: false,
          message: `Total assigned amount: ${form.watch("currency")} ${totalExact.toFixed(2)} (Remaining: ${form.watch("currency")} ${(amountVal - totalExact).toFixed(2)})`,
        };
      }
      return { valid: true, message: `Perfect! Total assigned matches the expense amount.` };
    }

    if (splitType === "PERCENTAGE") {
      const totalPct = groupMembers.reduce((sum, m) => sum + (parseFloat(memberSplits[m.id]) || 0), 0);
      const diff = Math.abs(totalPct - 100);
      if (diff > 0.01) {
        return {
          valid: false,
          message: `Total percentage assigned: ${totalPct.toFixed(1)}% (Remaining: ${(100 - totalPct).toFixed(1)}%)`,
        };
      }
      return { valid: true, message: `Perfect! Total percentage equals 100%.` };
    }

    if (splitType === "SHARES") {
      const totalShares = groupMembers.reduce((sum, m) => sum + (parseFloat(memberSplits[m.id]) || 0), 0);
      if (totalShares <= 0) {
        return {
          valid: false,
          message: "Please assign at least 1 share to one of the members.",
        };
      }
      return { valid: true, message: `Perfect! Total shares: ${totalShares}` };
    }

    return { valid: false, message: "Invalid split type" };
  };

  const getSplitProgress = () => {
    const sType = form.watch("splitType");
    const amountVal = parseFloat(form.watch("amount") || 0);

    if (sType === "EQUAL" || !groupMembers || groupMembers.length === 0) {
      return 100;
    }

    if (sType === "EXACT") {
      const totalExact = groupMembers.reduce((sum, m) => sum + (parseFloat(memberSplits[m.id]) || 0), 0);
      return amountVal > 0 ? (totalExact / amountVal) * 100 : 0;
    }

    if (sType === "PERCENTAGE") {
      const totalPct = groupMembers.reduce((sum, m) => sum + (parseFloat(memberSplits[m.id]) || 0), 0);
      return totalPct;
    }

    if (sType === "SHARES") {
      const totalShares = groupMembers.reduce((sum, m) => sum + (parseFloat(memberSplits[m.id]) || 0), 0);
      return totalShares > 0 ? 100 : 0;
    }

    return 0;
  };

  const selectedGroupId = form.watch("groupId");

  useEffect(() => {
    if (!selectedGroupId) {
      setGroupMembers([]);
      form.setValue("paidById", "");
      return;
    }

    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        console.log("🔍 Fetching members for group:", selectedGroupId);
        const response = await groupService.getGroupById(selectedGroupId);
        console.log("📦 Group response:", response);
        
        if (response?.success && response?.data?.members) {
          console.log("✅ Members fetched:", response.data.members);
          setGroupMembers(response.data.members);
        } else {
          console.log("❌ No members found in response");
          setGroupMembers([]);
          toast.error("No members found in this group");
        }
      } catch (error) {
        console.error("❌ Error fetching group members:", error);
        toast.error("Failed to load group members");
        setGroupMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [selectedGroupId, form]);

  const handleFormSubmit = async (data) => {
    console.log("🚀 Form submitted with data:", data);
    console.log("📋 Form values:", form.getValues());
    console.log("❌ Form errors:", form.formState.errors);

    try {
      // Validate that a group is selected
      if (!data.groupId) {
        console.log("❌ No group selected");
        toast.error("Please select a group");
        return;
      }

      // Validate that paidById is selected
      if (!data.paidById) {
        console.log("❌ No payer selected");
        toast.error("Please select who paid");
        return;
      }

      // Validate group members
      if (groupMembers.length === 0) {
        console.log("❌ No group members");
        toast.error("Group has no members to split with");
        return;
      }

      // Convert amount to number for calculations
      const amountNum = parseFloat(data.amount);
      console.log("💰 Amount:", data.amount, "→", amountNum);
      
      if (isNaN(amountNum) || amountNum <= 0) {
        console.log("❌ Invalid amount");
        toast.error("Please enter a valid amount");
        return;
      }

      // Calculate splits based on split type
      let calculatedSplits = [];
      const sType = data.splitType;

      if (sType === "EQUAL") {
        const equalShare = amountNum / groupMembers.length;
        calculatedSplits = groupMembers.map((member) => ({
          userId: member.id,
          amount: parseFloat(equalShare.toFixed(2)),
        }));
      } else if (sType === "EXACT") {
        const validation = isSplitValid();
        if (!validation.valid) {
          toast.error(validation.message);
          return;
        }
        calculatedSplits = groupMembers.map((member) => ({
          userId: member.id,
          amount: parseFloat(memberSplits[member.id] || 0),
        }));
      } else if (sType === "PERCENTAGE") {
        const validation = isSplitValid();
        if (!validation.valid) {
          toast.error(validation.message);
          return;
        }
        calculatedSplits = groupMembers.map((member) => ({
          userId: member.id,
          percentage: parseFloat(memberSplits[member.id] || 0),
        }));
      } else if (sType === "SHARES") {
        const validation = isSplitValid();
        if (!validation.valid) {
          toast.error(validation.message);
          return;
        }
        calculatedSplits = groupMembers.map((member) => ({
          userId: member.id,
          shares: parseFloat(memberSplits[member.id] || 0),
        }));
      } else {
        toast.error("Invalid split type");
        return;
      }

      // Prepare final data - Backend expects amount as number, not string
      const finalData = {
        groupId: data.groupId,
        paidById: data.paidById,
        description: data.description,
        amount: amountNum, // Send as number
        currency: data.currency || "INR",
        splitType: data.splitType,
        date: data.date || new Date().toISOString(),
        isSettled: data.isSettled || false,
        notes: data.notes || null,
        splits: calculatedSplits,
        tagIds: data.tagIds || [],
      };

      console.log("📤 Sending final data:", finalData);
      console.log("📤 Final data JSON:", JSON.stringify(finalData, null, 2));
      
      // Call the parent's onSubmit
      await onSubmit(finalData);
      console.log("✅ onSubmit completed successfully");
      
    } catch (error) {
      console.error("❌ Error in handleFormSubmit:", error);
      toast.error(error.message || "Failed to submit expense");
    }
  };

  // Add validation error logging
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log("📝 Form field changed:", name, "=", value[name]);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const splitTypes = [
    { label: "Equal Split", value: "EQUAL" },
    { label: "Exact Amounts", value: "EXACT" },
    { label: "Percentage Split", value: "PERCENTAGE" },
    { label: "Shares Split", value: "SHARES" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-xl z-10">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Add New Expense
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Fill in the details to add your expense
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors group"
          >
            <X className="h-5 w-5 text-slate-500 group-hover:text-slate-700" />
          </button>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit, (errors) => {
              console.log("❌ Form validation errors:", errors);
              toast.error("Please fill all required fields correctly");
            })} className="space-y-6">
              
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Group *</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => {
                          console.log("👥 Group selected:", value);
                          field.onChange(value);
                        }}
                        value={field.value}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          {loading ? (
                            <p className="p-2 text-slate-500 text-sm">Loading...</p>
                          ) : groups.length === 0 ? (
                            <p className="p-2 text-slate-500 text-sm">No groups available</p>
                          ) : (
                            groups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expense Description *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dinner at Cafe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="Enter amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input placeholder="INR, USD, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="paidById"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid By *</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => {
                          console.log("💳 Payer selected:", value);
                          field.onChange(value);
                        }}
                        value={field.value}
                        disabled={!selectedGroupId || loadingMembers}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payer" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingMembers ? (
                            <p className="p-2 text-slate-500 text-sm">Loading members...</p>
                          ) : groupMembers.length > 0 ? (
                            groupMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))
                          ) : (
                            <p className="p-2 text-slate-500 text-sm">
                              {selectedGroupId
                                ? "No members found"
                                : "Select a group first"}
                            </p>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="splitType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Split Type *</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select split type" />
                        </SelectTrigger>
                        <SelectContent>
                          {splitTypes.map((split) => (
                            <SelectItem 
                              key={split.value} 
                              value={split.value}
                            >
                              {split.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Member Splits Allocation */}
              {selectedGroupId && groupMembers.length > 0 && (
                <div className="space-y-4 border border-slate-200 dark:border-border/50 rounded-lg p-4 bg-slate-50 dark:bg-muted/10">
                  <FormLabel className="text-sm font-semibold text-slate-800 dark:text-foreground">
                    Split Breakdown
                  </FormLabel>
                  
                  <div className="space-y-3">
                    {groupMembers.map((member) => {
                      const shareValue = memberSplits[member.id] || "";
                      let previewLabel = "";
                      
                      if (form.watch("splitType") === "EQUAL") {
                        const amountVal = parseFloat(form.watch("amount") || 0);
                        const equalShare = amountVal > 0 ? (amountVal / groupMembers.length).toFixed(2) : "0.00";
                        previewLabel = `${form.watch("currency")} ${equalShare}`;
                      } else if (form.watch("splitType") === "PERCENTAGE" && form.watch("amount")) {
                        const pct = parseFloat(shareValue) || 0;
                        const amt = parseFloat(form.watch("amount") || 0);
                        previewLabel = `${form.watch("currency")} ${((pct / 100) * amt).toFixed(2)}`;
                      } else if (form.watch("splitType") === "SHARES" && form.watch("amount")) {
                        const amt = parseFloat(form.watch("amount") || 0);
                        const totalShares = groupMembers.reduce((sum, m) => sum + (parseFloat(memberSplits[m.id]) || 0), 0);
                        const shares = parseFloat(shareValue) || 0;
                        const shareAmt = totalShares > 0 ? ((shares / totalShares) * amt).toFixed(2) : "0.00";
                        previewLabel = `${form.watch("currency")} ${shareAmt}`;
                      }

                      return (
                        <div key={member.id} className="flex items-center justify-between gap-3 bg-white dark:bg-card p-3 rounded-lg border border-slate-200 dark:border-border/50">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xs">
                                {member.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-slate-900 dark:text-foreground truncate">{member.name}</p>
                              {previewLabel && (
                                <p className="text-[10px] text-slate-500">{previewLabel}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="w-32 shrink-0">
                            {form.watch("splitType") === "EQUAL" ? (
                              <div className="text-right text-xs font-bold text-slate-700 dark:text-slate-200">
                                {previewLabel}
                              </div>
                            ) : (
                              <div className="relative">
                                <Input
                                  type="number"
                                  step="any"
                                  min="0"
                                  placeholder={
                                    form.watch("splitType") === "EXACT" ? "0.00" :
                                    form.watch("splitType") === "PERCENTAGE" ? "0" :
                                    "1"
                                  }
                                  value={shareValue}
                                  onChange={(e) => handleSplitInputChange(member.id, e.target.value)}
                                  className="h-8 text-xs pr-7 text-right"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-medium pointer-events-none">
                                  {form.watch("splitType") === "EXACT" ? form.watch("currency") :
                                   form.watch("splitType") === "PERCENTAGE" ? "%" :
                                   "sh"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Live Validation Banner with Elastic Progress Gauge */}
                  {form.watch("splitType") !== "EQUAL" && (
                    <div className={`text-[10px] font-semibold p-2.5 rounded-md border space-y-2 ${
                      isSplitValid().valid 
                        ? "bg-green-500/10 text-green-600 border-green-500/25 dark:text-green-400" 
                        : "bg-orange-500/10 text-orange-600 border-orange-500/25 dark:text-orange-400"
                    }`}>
                      <p>{isSplitValid().message}</p>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-muted/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${getSplitProgress()}%` }}
                          transition={{ type: "spring", stiffness: 180, damping: 18 }}
                          className={`h-full rounded-full ${
                            isSplitValid().valid 
                              ? "bg-green-500 dark:bg-green-400" 
                              : getSplitProgress() > 100 
                                ? "bg-red-500 dark:bg-red-400" 
                                : "bg-orange-500 dark:bg-orange-400"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any extra details about the expense"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    console.log("❌ Form cancelled");
                    onClose();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold shadow-md active:scale-98 transition-all"
                  disabled={loadingMembers}
                  onClick={() => console.log("🔘 Submit button clicked")}
                >
                  Add Expense
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;