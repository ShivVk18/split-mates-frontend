import settlementService from "@/services/settlementService";
import { toast } from "sonner";
import { create } from "zustand";

const useSettlementStore = create((set) => ({
  settlements: [],
  currentPage: 1,
  totalSettlements: 0,
  totalPages: 1,
  totalItems: 0,
  balanceSummary: null,

  setSettlements: (settlements) => set({ settlements }),
  
  setPagination: (data) =>
    set({
      currentPage: data.currentPage || 1,
      totalPages: data.totalPages || 1,
      totalItems: data.totalItems || 0,
    }),

  setBalanceSummary: (summary) => set({ balanceSummary: summary }),

  addSettlement: (settlement) =>
    set((state) => ({ 
      settlements: [settlement, ...state.settlements]
    })),

  updateSettlement: (id, updatedSettlement) =>
    set((state) => ({
      settlements: state.settlements.map((settlement) =>
        settlement.id === id ? { ...settlement, ...updatedSettlement } : settlement
      ),
    })),

  markAsComplete: async (settlementId) => {
    try {
      const response = await settlementService.markSettlementComplete(settlementId);

      set((state) => ({
        settlements: state.settlements.map((settlement) =>
          settlement.id === settlementId 
            ? { ...settlement, status: "COMPLETED", settledAt: new Date() } 
            : settlement
        ),
      }));

      toast.success("Settlement marked as complete ✅");
      return response;
    } catch (error) {
      console.error("Failed to complete settlement:", error);
      toast.error(error?.message || "Failed to complete settlement ❌");
      throw error;
    }
  },

  // Filter settlements by status
  filterByStatus: (status) =>
    set((state) => ({
      settlements: state.settlements.filter((s) => 
        status ? s.status === status : true
      ),
    })),

  // Clear settlements
  clearSettlements: () => set({ settlements: [], currentPage: 1, totalPages: 1, totalItems: 0 }),
}));

export default useSettlementStore;