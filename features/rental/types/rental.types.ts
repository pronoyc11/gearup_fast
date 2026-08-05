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
  provider?: User;
  providerEmail?: string;
  quantity: number;
  pricePerDay?: number | string;
  subtotal?: number | string;
  status: RentalStatus;
  gear?: Gear;
  review?: Review;
  reviewId?: string;
  reviews?: Review[];
};

export type RentalOrder = {
  id: string;
  startDate: string;
  endDate: string;
  status: RentalStatus;
  totalAmount?: number | string;
  items: RentalItem[];
  customer?: User;
  createdAt?: string;
};

export type ProviderRentalItem = RentalItem & {
  rentalOrderId: string;
  rentalOrder: RentalOrder & {
    customerId?: string;
    payment?: {
      id: string;
      amount?: number | string;
      provider?: string;
      status?: string;
      paidAt?: string;
    } | null;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type CreateRentalPayload = {
  startDate: string;
  endDate: string;
  items: { gearId: string; quantity: number }[];
};
