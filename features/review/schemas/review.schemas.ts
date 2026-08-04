import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1, "Rating must be at least 1.").max(5, "Rating cannot exceed 5."),
  comment: z.string().min(3, "Review comment is required."),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
