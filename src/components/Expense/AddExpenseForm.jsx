import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
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

      if (data.splitType === "EQUAL") {
        const equalShare = amountNum / groupMembers.length;
        calculatedSplits = groupMembers.map((member) => ({
          userId: member.id,
          amount: parseFloat(equalShare.toFixed(2)),
        }));
        console.log("✂️ Calculated equal splits:", calculatedSplits);
      } else {
        console.log("❌ Unsupported split type:", data.splitType);
        toast.error("Only EQUAL split is currently supported");
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
                              disabled={split.value !== "EQUAL"}
                            >
                              {split.label} {split.value !== "EQUAL" && "(Coming soon)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {selectedGroupId && groupMembers.length > 0 && form.watch("amount") && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Split Preview (Equal)
                  </p>
                  <p className="text-xs text-blue-700">
                    Each of {groupMembers.length} members will pay:{" "}
                    <span className="font-semibold">
                      {form.watch("currency")} {(parseFloat(form.watch("amount") || 0) / groupMembers.length).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}

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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
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