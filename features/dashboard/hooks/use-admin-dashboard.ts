"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserStatus } from "@/features/auth/types/auth.types";
import { adminApi } from "../api/admin.api";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: adminApi.getUsers,
  });
}

export function useAdminGear() {
  return useQuery({
    queryKey: ["admin-gear"],
    queryFn: adminApi.getGear,
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ["admin-rentals"],
    queryFn: adminApi.getRentals,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) => adminApi.updateUserStatus(userId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}
