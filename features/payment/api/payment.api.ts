import { apiClient } from "@/shared/api/axios";
import type { CheckoutSession, Payment } from "../types/payment.types";

export const paymentApi = {
  createCheckoutSession: (rentalOrderId: string) =>
    apiClient.post<unknown, CheckoutSession>("/api/payment/create-session", { rentalOrderId }),
  getPayments: () => apiClient.get<unknown, Payment[]>("/api/payment"),
};
