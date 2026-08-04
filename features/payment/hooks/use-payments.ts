"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentApi } from "../api/payment.api";

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: paymentApi.getPayments,
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: paymentApi.createCheckoutSession,
  });
}
