import { apiClient } from "@/shared/api/axios";
import type { User, UserStatus } from "@/features/auth/types/auth.types";
import type { Gear } from "@/features/gear/types/gear.types";
import type { RentalOrder } from "@/features/rental/types/rental.types";
import type { ApiList } from "@/shared/types/api.types";

export const adminApi = {
  getUsers: () => apiClient.get<unknown, User[]>("/api/admin/users"),
  updateUserStatus: (userId: string, status: UserStatus) =>
    apiClient.patch<unknown, User>(`/api/admin/users/${userId}`, { status }),
  getGear: () => apiClient.get<unknown, ApiList<Gear> | Gear[]>("/api/admin/gear", { params: { limit: 100 } }),
  getRentals: () => apiClient.get<unknown, ApiList<RentalOrder> | RentalOrder[]>("/api/admin/rentals", { params: { limit: 100 } }),
};
