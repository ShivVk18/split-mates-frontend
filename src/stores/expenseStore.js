import expenseService from "@/services/expenseService";
import { toast } from "sonner";
import { create } from "zustand";

const useExpenseStore = create((set) => ({
  expenses: [],
  currentPage: 1,
  totalExpenses: 0,
  totalPages: 1,
  limit: 10,
  totalExpenseAmount: 0,

  setExpenses: (expenses) => set({ expenses }),
  
  setPagination: (data) =>
    set({
      currentPage: data.pagination?.page || 1,
      totalExpenses: data.pagination?.total || 0,
      totalPages: data.pagination?.pages || 1,
      limit: data.pagination?.limit || 10,
      totalExpenseAmount: data.totalExpenseAmount || 0,
    }),

  addExpense: (expense) =>
    set((state) => ({ expenses: [...state.expenses, expense] })),

  updateExpense: (id, updatedExpense) =>
    set((state) => ({
      expenses: state.expenses.map((exp) =>
        exp.id === id ? { ...exp, ...updatedExpense } : exp
      ),
    })),

  removeExpense: async (id) => {
    try {
      const response = await expenseService.deleteExpense(id);

      set((state) => ({
        expenses: state.expenses.filter((exp) => exp.id !== id),
      }));

      toast.success("Expense deleted successfully ✅");
      return response;
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast.error(error?.message || "Failed to delete expense ❌");
      throw error;
    }
  },

  settleExpense: async (id) => {
    try {
      const response = await expenseService.settleExpense(id);

      set((state) => ({
        expenses: state.expenses.map((exp) =>
          exp.id === id ? { ...exp, isSettled: true } : exp
        ),
      }));

      toast.success("Expense settled successfully ✅");
      return response;
    } catch (error) {
      console.error("Failed to settle expense:", error);
      toast.error(error?.message || "Failed to settle expense ❌");
      throw error;
    }
  },
}));

export default useExpenseStore;