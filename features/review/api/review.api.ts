import { apiClient } from "@/shared/api/axios";
import type { Review, ReviewPayload, ReviewUpdatePayload } from "../types/review.types";

export const reviewApi = {
  getReviewsByGear: (gearId: string) => apiClient.get<unknown, Review[]>(`/api/review/${gearId}`),
  createReview: (payload: ReviewPayload) => apiClient.post<unknown, Review>("/api/review/create", payload),
  updateReview: (reviewId: string, payload: ReviewUpdatePayload) => apiClient.patch<unknown, Review>(`/api/review/${reviewId}`, payload),
  deleteReview: (reviewId: string) => apiClient.delete<unknown, Review>(`/api/review/${reviewId}`),
};
