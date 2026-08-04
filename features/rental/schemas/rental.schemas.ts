import { z } from "zod";

export const createRentalSchema = z.object({
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  quantity: z.number().min(1, "Quantity must be at least 1."),
});

export type CreateRentalFormValues = z.infer<typeof createRentalSchema>;
