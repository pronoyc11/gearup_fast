"use client";

import { create } from "zustand";
import type { Role, User } from "@/features/auth/types/auth.types";
import { useCartStore } from "@/stores/cart.store";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAuth: (accessToken: string, user: User) => void;
  hydrate: () => void;
  logout: () => void;
};

const tokenKey = "gearup_token";
const userKey = "gearup_user";

function setAuthCookies(accessToken: string, role: Role) {
  document.cookie = `gearup_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `gearup_role=${role}; path=/; max-age=86400; SameSite=Lax`;
}

function clearAuthCookies() {
  document.cookie = "gearup_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  document.cookie = "gearup_role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => {
    localStorage.setItem(tokenKey, accessToken);
    localStorage.setItem(userKey, JSON.stringify(user));
    setAuthCookies(accessToken, user.role);
    set({ accessToken, user });
  },
  hydrate: () => {
    const accessToken = localStorage.getItem(tokenKey);
    const userValue = localStorage.getItem(userKey);
    const user = userValue ? (JSON.parse(userValue) as User) : null;

    set({ accessToken, user });
  },
  logout: () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    useCartStore.getState().clearCart();
    clearAuthCookies();
    set({ accessToken: null, user: null });
  },
}));

export function dashboardPath(role?: Role) {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "PROVIDER") return "/dashboard/provider";
  return "/dashboard/customer";
}
