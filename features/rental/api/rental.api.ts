import { apiClient } from "@/shared/api/axios";
import type { ApiList } from "@/shared/types/api.types";
import type { CreateRentalPayload, ProviderRentalItem, RentalOrder, RentalStatus } from "../types/rental.types";

export const rentalApi = {
  createRental: (payload: CreateRentalPayload) => apiClient.post<unknown, RentalOrder>("/api/rental/customer", payload),
  getCustomerRentals: () => apiClient.get<unknown, RentalOrder[]>("/api/rental/customer"),
  getCustomerRental: (orderId: string) => apiClient.get<unknown, RentalOrder>(`/api/rental/customer/${orderId}`),
  cancelRental: (orderId: string) => apiClient.patch<unknown, RentalOrder>(`/api/rental/customer/cancel/${orderId}`),
  cancelRentalItem: (itemId: string) => apiClient.patch<unknown, RentalOrder>(`/api/rental/customer/items/${itemId}/cancel`),
  getProviderRentals: () => apiClient.get<unknown, ProviderRentalItem[] | ApiList<ProviderRentalItem>>("/api/rental/provider"),
  updateRentalItem: (itemId: string, status: RentalStatus) =>
    apiClient.patch<unknown, RentalOrder>(`/api/rental/provider/items/${itemId}`, { status }),
};
