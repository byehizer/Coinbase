import { z } from "zod";

export const OrderItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  image_url: z.string().url(),
});

export const CreateOrderSchema = z.object({
  client_name: z.string().min(3, "Name must be at least 3 characters"),
  client_email: z.string().email("Email must be valid"),
  total: z.number().positive("Total must be greater than 0"), 
  payment_method: z.enum(["Zelle", "Venmo"]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  country: z.string().regex(/^[a-zA-Z\s]+$/, "Valid country is required"),
  items: z.array(OrderItemSchema).nonempty("At least one item is required"),
});

export const updateOrderSchema = z.object({
  clientName: z.string().trim().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid client email is required"),
  status: z
    .enum(["pending", "cancelled", "delivered", "shipped", "paid"])
    .optional(),
  trackingStatus: z
    .enum(["pending", "in_transit", "delivered"])
    .optional(),
  deliveryAddress: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryCountry: z.string().optional(),
});
