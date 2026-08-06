import { z } from "zod";
import { isSameOrAfter, isTodayOrFuture } from "../utils/rental-date-validation";

export const createRentalSchema = z
  .object({
    startDate: z.string().min(1, "Start date is required.").refine(isTodayOrFuture, "Start date cannot be before today."),
    endDate: z.string().min(1, "End date is required.").refine(isTodayOrFuture, "End date cannot be before today."),
    quantity: z.number().min(1, "Quantity must be at least 1."),
  })
  .refine((values) => isSameOrAfter(values.endDate, values.startDate), {
    path: ["endDate"],
    message: "End date must be the same as or after the start date.",
  });

export type CreateRentalFormValues = z.infer<typeof createRentalSchema>;
