"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "../api/auth.api";

export function useCurrentUser(enabled = true) {
  const userId = useAuthStore((state) => state.user?.id);
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionKey = userId ?? accessToken?.slice(-12);

  return useQuery({
    queryKey: ["auth", "me", sessionKey],
    queryFn: () => authApi.me(),
    enabled: enabled && Boolean(accessToken),
  });
}
