import { z } from "zod";

export const cartCheckoutSchema = z.object({
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
});

export type CartCheckoutFormValues = z.infer<typeof cartCheckoutSchema>;
