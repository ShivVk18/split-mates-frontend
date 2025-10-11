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

  removeGroup: (id) =>
    set((state) => ({ groups: state.groups.filter((g) => g.id !== id) })),
}));

export default useGroupStore;
