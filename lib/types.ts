export type Role = "ADMIN" | "CUSTOMER" | "PROVIDER";

export type UserStatus = "ACTIVE" | "SUSPENDED";

export type GearAvailability = "AVAILABLE" | "OUT_OF_STOCK" | "MAINTENANCE";

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

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
};

export type ApiList<T> = {
  data: T[];
  meta?: ApiMeta;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: UserStatus;
  phone?: string;
  address?: string;
  createdAt?: string;
};

export type Gear = {
  id: string;
  title: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  availability: GearAvailability;
  image?: string;
  specifications?: Record<string, unknown>;
  category?: Category;
  categoryId?: string;
  provider?: User;
  providerId?: string;
  createdAt?: string;
};

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

export type Payment = {
  id: string;
  amount?: number;
  status: PaymentStatus;
  provider?: "STRIPE" | "SSLCOMMERZ";
  rentalOrderId?: string;
  paidAt?: string;
  createdAt?: string;
};

export type Review = {
  id: string;
  rating: number;
  comment: string;
  user?: User;
  rentalOrderItemId?: string;
  createdAt?: string;
};
