import { z } from "zod";

export const gearFilterSchema = z.object({
  searchTerm: z.string().optional(),
  categoryName: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  availability: z.enum(["", "AVAILABLE", "OUT_OF_STOCK", "MAINTENANCE"]).optional(),
});

export const gearSchema = z.object({
  categoryId: z.string().min(1, "Category is required."),
  title: z.string().min(2, "Title is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  brand: z.string().min(2, "Brand is required."),
  pricePerDay: z.number().min(1, "Price must be greater than 0."),
  stock: z.number().min(0, "Stock cannot be negative."),
  availability: z.enum(["AVAILABLE", "OUT_OF_STOCK", "MAINTENANCE"]),
  image: z.string().min(1, "Product image is required.").url("Upload a valid product image."),
  specifications: z.string().optional(),
});

export type GearFormValues = z.infer<typeof gearSchema>;
export type GearFilterValues = z.infer<typeof gearFilterSchema>;
