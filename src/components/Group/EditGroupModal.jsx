import React from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupSchema } from "@/utils/zodSchema";

const EditGroupModal = ({ group, onClose, onUpdate }) => {
  const form = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group?.name || "",
      description: group?.description || "",
      category: group?.category || "GENERAL",
      currency: group?.currency || "INR",
    },
  });

  const onSubmit = async (data) => {
    await onUpdate(group.id, data);
  };

  const GroupCategory = [
    { label: "General", value: "GENERAL" },
    { label: "Trip", value: "TRIP" },
    { label: "Home", value: "HOME" },
    { label: "Couple", value: "COUPLE" },
    { label: "Friends", value: "FRIENDS" },
    { label: "Work", value: "WORK" },
    { label: "Project", value: "PROJECT" },
    { label: "Event", value: "EVENT" },
    { label: "Travel", value: "TRAVEL" },
    { label: "Food", value: "FOOD" },
    { label: "Utilities", value: "UTILITIES" },
    { label: "Entertainment", value: "ENTERTAINMENT" },
    { label: "Shopping", value: "SHOPPING" },
    { label: "Transport", value: "TRANSPORT" },
    { label: "Other", value: "OTHER" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-xl z-10">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Edit Group
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Update group details
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors group"
          >
            <X className="h-5 w-5 text-slate-500 group-hover:text-slate-700" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Group Name" {...field} />
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
                    <FormLabel>Group Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {GroupCategory.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
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
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Your Currency" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                  Update Group
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;