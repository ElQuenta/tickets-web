import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "./models/user";

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {} as User,
      isAuthenticated: false,
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: {} as User, isAuthenticated: false }),
    }),
    { name: "auth" },
  ),
);
