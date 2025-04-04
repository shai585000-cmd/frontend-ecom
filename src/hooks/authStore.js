import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (user, tokens) => {
        console.log("setAuth appelé avec:", { user, tokens }); // Debug
        set({
          user,
          tokens,
          isAuthenticated: true,
          error: null,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      clearAuth: () => {
        console.log("clearAuth appelé"); // Debug
        set(
          {
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: null,
          },
          true
        ); // Force update
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
