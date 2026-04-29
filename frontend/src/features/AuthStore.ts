// features/AuthStore.ts
import { create } from "zustand";
import { Api } from "./Api";

type User = {
  id: number;
  name: string;
};

type AuthState = {
  user: User | null;
  authReady: boolean;
  init: () => Promise<void>;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  authReady: false,

  init: async () => {
    if (get().authReady) return;

    try {
      const user = await Api.me();
      set({ user, authReady: true });
    } catch (e) {
      set({ user: null, authReady: true });
    }
  },

  setUser: (user) => set({ user }),
}));