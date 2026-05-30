import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppRole } from "@/config/role-nav";
import { ROLE_HOME } from "@/config/role-nav";

export type { AppRole };

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: AppRole;
  avatar?: string;
  ecoPoints?: number;
  streak?: number;
  address?: string;
  membershipStatus?: "trial" | "member" | "staff";
}

interface AuthState {
  user: User | null;
  token: string | null;
  backendModel: string | null;
  isAuthenticated: boolean;
  pendingPhone: string | null;
  isNewUser: boolean;
  login: (userData: User) => void;
  setSession: (args: { token: string; user: User; backendModel?: string | null }) => void;
  logout: () => void;
  setPendingPhone: (phone: string | null) => void;
  setIsNewUser: (v: boolean) => void;
  updateUser: (patch: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      backendModel: null,
      isAuthenticated: false,
      pendingPhone: null,
      isNewUser: false,
      login: (userData) =>
        set({
          user: userData,
          isAuthenticated: true,
          pendingPhone: null,
          token: null,
          backendModel: null,
        }),
      setSession: ({ token, user, backendModel }) =>
        set({
          user,
          token,
          backendModel: backendModel ?? null,
          isAuthenticated: true,
          pendingPhone: null,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          backendModel: null,
          isAuthenticated: false,
          pendingPhone: null,
          isNewUser: false,
        }),
      setPendingPhone: (phone) => set({ pendingPhone: phone }),
      setIsNewUser: (v) => set({ isNewUser: v }),
      updateUser: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : {})),
    }),
    {
      name: "ecoxchange-auth-v2",
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        backendModel: s.backendModel,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);

export function defaultHomeForRole(role: AppRole): string {
  return ROLE_HOME[role];
}
