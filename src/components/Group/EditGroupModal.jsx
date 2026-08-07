import React from "react";
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
import { Modal, ModalFooter } from "@/components/ui/Modal";

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit group details"
      subtitle={`Update settings for ${group?.name || "group"}`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
                  Group name
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter Group Name" 
                    className="h-11 px-3.5 bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:border-foreground/40 focus:ring-2 focus:ring-foreground/5 transition-all"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
                  Description
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter group description" 
                    className="h-11 px-3.5 bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:border-foreground/40 focus:ring-2 focus:ring-foreground/5 transition-all"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
                    Category
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11 px-3.5 bg-background border-border/80 text-foreground rounded-xl focus:border-foreground/40 focus:ring-2 focus:ring-foreground/5 transition-all">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover text-popover-foreground border-border/80 rounded-xl shadow-lg">
                        {GroupCategory.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
                    Currency
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="INR, USD, EUR..." 
                      className="h-11 px-3.5 bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:border-foreground/40 focus:ring-2 focus:ring-foreground/5 transition-all"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <ModalFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="h-10 px-4 text-sm font-medium border-border/80 bg-background text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="h-10 px-5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Save changes
            </Button>
          </ModalFooter>
        </form>
      </Form>
    </Modal>
  );
};

export default EditGroupModal;