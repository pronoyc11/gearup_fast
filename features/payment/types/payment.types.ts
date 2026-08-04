export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type Payment = {
  id: string;
  amount?: number;
  status: PaymentStatus;
  provider?: "STRIPE" | "SSLCOMMERZ";
  rentalOrderId?: string;
  paidAt?: string;
  createdAt?: string;
};

export type CheckoutSession = {
  id?: string;
  url?: string;
  sessionUrl?: string;
};
