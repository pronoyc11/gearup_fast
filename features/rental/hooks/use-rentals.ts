"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  return useQuery({
    queryKey: ["customer-rentals"],
    queryFn: rentalApi.getCustomerRentals,
  });
}

export function useCustomerRental(orderId: string) {
  return useQuery({
    queryKey: ["customer-rental", orderId],
    queryFn: () => rentalApi.getCustomerRental(orderId),
    enabled: Boolean(orderId),
  });
}

export function useCancelRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rentalApi.cancelRental,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customer-rentals"] }),
  });
}

export function useProviderRentals() {
  return useQuery({
    queryKey: ["provider-rentals"],
    queryFn: rentalApi.getProviderRentals,
  });
}

export function useUpdateRentalItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, status }: { itemId: string; status: RentalStatus }) => rentalApi.updateRentalItem(itemId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["provider-rentals"] }),
  });
}
