import type { User } from "@/features/auth/types/auth.types";
import type { Gear } from "@/features/gear/types/gear.types";
import type { Review } from "@/features/review/types/review.types";

export type RentalStatus =
  | "PLACED"
  | "PARTIALLY_CONFIRMED"
  | "CONFIRMED"
  | "PAID"
  | "PARTIALLY_PICKED_UP"
  | "PICKED_UP"
  | "PARTIALLY_RETURNED"
  | "RETURNED"
  | "LATE_RETURN"
  | "CANCELLED";

export type RentalItem = {
  id: string;
  gearId: string;
  providerId?: string;
  quantity: number;
  subtotal?: number;
  status: RentalStatus;
  gear?: Gear;
  review?: Review;
};

export type RentalOrder = {
  id: string;
  startDate: string;
  endDate: string;
  status: RentalStatus;
  totalAmount?: number;
  items: RentalItem[];
  customer?: User;
  createdAt?: string;
};

export type CreateRentalPayload = {
  startDate: string;
  endDate: string;
  items: { gearId: string; quantity: number }[];
};
