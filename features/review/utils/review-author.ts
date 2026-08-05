import type { Review } from "../types/review.types";

export function getReviewAuthorName(review: Review) {
  return review.user?.name ?? review.customer?.name ?? review.userName ?? review.customerName ?? "Customer";
}
