import type { User } from "@/features/auth/types/auth.types";

export type Review = {
  id: string;
  rating: number;
  comment: string;
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
