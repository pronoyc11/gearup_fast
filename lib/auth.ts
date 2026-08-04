"use client";

import type { Role, User } from "./types";

export function persistAuth(accessToken: string, user?: User) {
  localStorage.setItem("gearup_token", accessToken);
  if (user) localStorage.setItem("gearup_user", JSON.stringify(user));
  document.cookie = `gearup_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
  if (user?.role) document.cookie = `gearup_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearAuth() {
  localStorage.removeItem("gearup_token");
  localStorage.removeItem("gearup_user");
  document.cookie = "gearup_token=; path=/; max-age=0";
  document.cookie = "gearup_role=; path=/; max-age=0";
}

export function storedUser(): User | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem("gearup_user");
  return value ? (JSON.parse(value) as User) : null;
}

export function dashboardFor(role?: Role) {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "PROVIDER") return "/dashboard/provider";
  return "/dashboard/customer";
}
