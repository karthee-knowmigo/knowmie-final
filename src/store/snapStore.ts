// src/store/useUserStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* =========================
   User Types
========================= */

export interface Bitmoji {
  avatar: string;
}

export interface User {
  displayName: string;
  bitmoji: Bitmoji;
  externalId: string;
}

/* =========================
   Store Type
========================= */

interface UserStore {
  count: number;
  user: User | null;

  increment: () => void;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

/* =========================
   Store
========================= */

export const useUserStore = create<UserStore>()(
  persist(
    (set): UserStore => ({
      count: 0,
      user: null, // ✅ must be null

      increment: () => set((state) => ({ count: state.count + 1 })),

      login: (userData) => {
        console.log("user data is", userData);
        set({ user: userData });
      },

      logout: () => set({ user: null }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "user-storage",
    },
  ),
);
