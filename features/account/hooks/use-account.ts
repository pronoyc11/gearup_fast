"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { accountApi } from "../api/account.api";

export function useProfile(enabled = true) {
  const userId = useAuthStore((state) => state.user?.id);
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionKey = userId ?? accessToken?.slice(-12);

  return useQuery({
    queryKey: ["account", "profile", sessionKey],
    queryFn: accountApi.getProfile,
    enabled: enabled && Boolean(accessToken),
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
