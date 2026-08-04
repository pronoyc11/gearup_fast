"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "../api/account.api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApi.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  });
}

export function useDeleteProfile() {
  return useMutation({
    mutationFn: accountApi.deleteProfile,
  });
}
