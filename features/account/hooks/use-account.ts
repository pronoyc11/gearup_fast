"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "../api/account.api";

export function useProfile(enabled = true) {
  return useQuery({
    queryKey: ["account", "profile"],
    queryFn: accountApi.getProfile,
    enabled,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApi.updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(["account", "profile"], user);
      queryClient.setQueryData(["auth", "me"], user);
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
