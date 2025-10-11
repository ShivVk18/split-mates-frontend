import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setUser: ({ user, token }) => {
        if (!user || !token) {
          return get().logout();
        }

        set({
          user,
          token,
        });
      },

      logout: () => {
        set({
          user: null,
          role: null,
          userType: null,
          token: null,
        });

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      },
    }),
    {
      name: "splitmates-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
