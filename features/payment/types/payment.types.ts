export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type Payment = {
  id: string;
  amount?: number;
  status: PaymentStatus;
  provider?: "STRIPE" | "SSLCOMMERZ";
  rentalOrderId?: string;
  rentalOrderItemId?: string;
  paidAt?: string;
  createdAt?: string;
};

export type CheckoutSession = string;

export type CreateCheckoutSessionPayload = {
  rentalOrderId: string;
  rentalOrderItemId?: string;
};
