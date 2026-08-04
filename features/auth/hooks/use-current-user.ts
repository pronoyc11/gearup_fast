"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    enabled,
  });
}
