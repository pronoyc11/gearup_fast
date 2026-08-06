import type { User } from "@/features/auth/types/auth.types";

export type Review = {
  id: string;
  rating: number;
  comment: string;
  userId?: string;
  customerId?: string;
  user?: User;
  customer?: User;
  userName?: string;
  customerName?: string;
  rentalOrderItemId?: string;
  createdAt?: string;
};

export type ReviewPayload = {
  rentalOrderItemId: string;
  rating: number;
  comment: string;
};

export type ReviewUpdatePayload = {
  rating: number;
  comment: string;
};
