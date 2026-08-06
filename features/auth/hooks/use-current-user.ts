"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "../api/auth.api";

export function useCurrentUser(enabled = true) {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["auth", "me", userId],
    queryFn: authApi.me,
    enabled: enabled && Boolean(userId),
  });
}
