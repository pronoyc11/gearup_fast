import type { User } from "@/features/auth/types/auth.types";
import type { Category } from "@/features/category/types/category.types";

export type GearAvailability = "AVAILABLE" | "OUT_OF_STOCK" | "MAINTENANCE";

export type Gear = {
  id: string;
  title: string;
  description: string;
  brand: string;
  pricePerDay: number | string;
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

export type GearFilters = {
  searchTerm?: string;
  categoryName?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: GearAvailability | "";
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type GearPayload = {
  categoryId: string;
  title: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  availability: GearAvailability;
  image: string;
  specifications?: Record<string, unknown>;
};

export type GearUpdatePayload = Partial<GearPayload>;
