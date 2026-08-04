import { apiClient } from "@/shared/api/axios";
import type { Review, ReviewPayload } from "../types/review.types";

export const reviewApi = {
  getReviewsByGear: (gearId: string) => apiClient.get<unknown, Review[]>(`/api/review/${gearId}`),
  createReview: (payload: ReviewPayload) => apiClient.post<unknown, Review>("/api/review/create", payload),
};
