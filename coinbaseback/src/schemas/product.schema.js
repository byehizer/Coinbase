import { z } from "zod";

const currentYear = new Date().getFullYear();

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  year: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: "Year must be a number" })
    .refine((val) => val >= 1700 && val <= currentYear, {
      message: `Year must be between 1700 and ${currentYear}`,
    }),
  country_origin: z.string().trim().min(1, "Country origin is required"),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), { message: "Price must be a number" })
    .refine((val) => val > 0, { message: "Price must be greater than 0" }),
  stock: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: "Stock must be a number" })
    .refine((val) => val >= 0, { message: "Stock cannot be negative" }),
});
