import { apiClient } from "@/shared/api/axios";
import type { Category, CategoryPayload } from "../types/category.types";

export const categoryApi = {
  getCategories: () => apiClient.get<unknown, Category[]>("/api/category"),
  createCategory: (payload: CategoryPayload) => apiClient.post<unknown, Category>("/api/category", payload),
  deleteCategory: (categoryId: string) => apiClient.delete<unknown, Category>(`/api/category/${categoryId}`),
};
