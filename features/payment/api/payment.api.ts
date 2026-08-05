import { apiClient } from "@/shared/api/axios";
import type { CheckoutSession, CreateCheckoutSessionPayload, Payment } from "../types/payment.types";

export const paymentApi = {
  createCheckoutSession: (payload: CreateCheckoutSessionPayload) =>
    apiClient.post<unknown, CheckoutSession>("/api/payment/create-session", payload),
  getPayments: () => apiClient.get<unknown, Payment[]>("/api/payment"),
};
