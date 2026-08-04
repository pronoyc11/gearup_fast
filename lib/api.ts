"use client";

import type {
  ApiList,
  Category,
  Gear,
  GearAvailability,
  Payment,
  RentalOrder,
  RentalStatus,
  Review,
  Role,
  User,
  UserStatus,
} from "./types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://gearup-backend-gold.vercel.app";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: Exclude<Role, "ADMIN">;
  phone?: string;
  address?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type GearInput = {
  categoryId: string;
  title: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  availability: GearAvailability;
  image?: string;
  specifications?: Record<string, unknown>;
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

function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("gearup_token") ?? "";
}

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
) {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (options.auth !== false) {
    const accessToken = token();
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const text = await res.text();
  const payload = text ? JSON.parse(text) : null;
  if (!res.ok || payload?.success === false) {
    throw new Error(payload?.message ?? `Request failed with ${res.status}`);
  }
  return unwrap<T>(payload);
}

function queryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}

export const api = {
  login: (body: LoginInput) =>
    request<{ accessToken: string; user?: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      auth: false,
    }),
  register: (body: RegisterInput) =>
    request<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
      auth: false,
    }),
  me: () => request<User>("/api/user/me"),
  updateProfile: (body: Partial<User>) =>
    request<User>("/api/user/update-profile", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteProfile: () => request<User>("/api/user/delete-profile", { method: "DELETE" }),

  categories: () => request<Category[]>("/api/category", { auth: false }),
  createCategory: (body: Pick<Category, "name" | "description">) =>
    request<Category>("/api/category", { method: "POST", body: JSON.stringify(body) }),
  updateCategory: (id: string, body: Pick<Category, "name" | "description">) =>
    request<Category>(`/api/category/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteCategory: (id: string) => request<Category>(`/api/category/${id}`, { method: "DELETE" }),

  gear: (filters: GearFilters = {}) =>
    request<ApiList<Gear> | Gear[]>(`/api/gear${queryString({ limit: 12, ...filters })}`, {
      auth: false,
    }),
  gearById: (id: string) => request<Gear>(`/api/gear/${id}`, { auth: false }),
  createGear: (body: GearInput) =>
    request<Gear>("/api/gear", { method: "POST", body: JSON.stringify(body) }),
  updateGear: (id: string, body: Partial<GearInput>) =>
    request<Gear>(`/api/gear/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteGear: (id: string) => request<Gear>(`/api/gear/${id}`, { method: "DELETE" }),

  createRental: (body: {
    startDate: string;
    endDate: string;
    items: { gearId: string; quantity: number }[];
  }) =>
    request<RentalOrder>("/api/rental/customer", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  customerRentals: () => request<RentalOrder[]>("/api/rental/customer"),
  customerRental: (id: string) => request<RentalOrder>(`/api/rental/customer/${id}`),
  cancelRental: (id: string) =>
    request<RentalOrder>(`/api/rental/customer/cancel/${id}`, { method: "PATCH" }),

  providerRentals: () => request<RentalOrder[] | ApiList<RentalOrder>>("/api/rental/provider"),
  providerRental: (id: string) => request<RentalOrder>(`/api/rental/provider/${id}`),
  updateRentalItem: (itemId: string, status: RentalStatus) =>
    request<RentalOrder>(`/api/rental/provider/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  createPaymentSession: (rentalOrderId: string) =>
    request<{ url?: string; sessionUrl?: string; id?: string }>("/api/payment/create-session", {
      method: "POST",
      body: JSON.stringify({ rentalOrderId }),
    }),
  payments: () => request<Payment[]>("/api/payment"),
  paymentById: (id: string) => request<Payment>(`/api/payment/${id}`),

  reviews: (gearId: string) => request<Review[]>(`/api/review/${gearId}`, { auth: false }),
  createReview: (body: { rentalOrderItemId: string; rating: number; comment: string }) =>
    request<Review>("/api/review/create", { method: "POST", body: JSON.stringify(body) }),
  updateReview: (id: string, body: { rating: number; comment: string }) =>
    request<Review>(`/api/review/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteReview: (id: string) => request<Review>(`/api/review/${id}`, { method: "DELETE" }),

  adminUsers: () => request<User[]>("/api/admin/users"),
  adminUser: (id: string) => request<User>(`/api/admin/users/${id}`),
  updateUserStatus: (id: string, status: UserStatus) =>
    request<User>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  adminGear: () => request<ApiList<Gear> | Gear[]>("/api/admin/gear?limit=100"),
  adminRentals: () => request<ApiList<RentalOrder> | RentalOrder[]>("/api/admin/rentals?limit=100"),
};

export function listOf<T>(value: ApiList<T> | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : value.data;
}
