"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { accountApi } from "../api/account.api";

export function useProfile(enabled = true) {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["account", "profile", userId],
    queryFn: accountApi.getProfile,
    enabled: enabled && Boolean(userId),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: accountApi.updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(["account", "profile", user.id ?? userId], user);
      queryClient.setQueryData(["auth", "me", user.id ?? userId], user);
      queryClient.invalidateQueries({ queryKey: ["account", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApi.deleteProfile,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["account", "profile"] });
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
    },
  });
}
