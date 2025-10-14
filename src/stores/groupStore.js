import groupService from "@/services/groupService";
import { toast } from "sonner";
import { create } from "zustand";

const useGroupStore = create((set) => ({
  groups: [],
  currentPage: 1,
  totalGroups: 0,
  totalPages: 1,
  limit: 10,

  setGroups: (groups) => set({ groups }),
  setPagination: (data) =>
    set({
      currentPage: data.currentPage,
      totalGroups: data.totalGroups,
      totalPages: data.totalPages,
      limit: data.limit,
    }),

  addGroup: (group) =>
    set((state) => ({ groups: [...state.groups, group] })),

  removeGroup: async (id) => {
    try {
      
      const response = await groupService.deleteGroup(id);

     
      set((state) => ({
        groups: state.groups.filter((g) => g.id !== id),
      }));

      toast.success("Group deleted successfully ✅");
      return response;
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast.error(error?.message || "Failed to delete group ❌");
      throw error;
    }
  },
}));

export default useGroupStore;
