"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "../api/review.api";

export function useGearReviews(gearId: string) {
  return useQuery({
    queryKey: ["reviews", gearId],
    queryFn: () => reviewApi.getReviewsByGear(gearId),
    enabled: Boolean(gearId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["customer-rental"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
