"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { rentalApi } from "../api/rental.api";
import type { RentalStatus } from "../types/rental.types";

export function useCreateRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rentalApi.createRental,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customer-rentals"] }),
  });
}

export function useCustomerRentals() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["customer-rentals", userId],
    queryFn: rentalApi.getCustomerRentals,
    enabled: Boolean(userId),
  });
}

export function useCustomerRental(orderId: string) {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["customer-rental", userId, orderId],
    queryFn: () => rentalApi.getCustomerRental(orderId),
    enabled: Boolean(userId && orderId),
  });
}

export function useCancelRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rentalApi.cancelRental,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["customer-rental"] });
    },
  });
}

export function useCancelRentalItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rentalApi.cancelRentalItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["customer-rental"] });
    },
  });
}

export function useProviderRentals() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["provider-rentals", userId],
    queryFn: rentalApi.getProviderRentals,
    enabled: Boolean(userId),
  });
}

export function useUpdateRentalItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, status }: { itemId: string; status: RentalStatus }) => rentalApi.updateRentalItem(itemId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["provider-rentals"] }),
  });
}
