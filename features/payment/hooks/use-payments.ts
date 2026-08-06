"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { paymentApi } from "../api/payment.api";

export function usePayments() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["payments", userId],
    queryFn: paymentApi.getPayments,
    enabled: Boolean(userId),
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: paymentApi.createCheckoutSession,
   
  });
}
