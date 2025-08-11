import { z } from "zod";

export const createOrderSchema = z.object({
  orderId: z.string().uuid(),
  orderNumber: z.string().min(5).max(100),
  orderDate: z
    .string()
    .refine(
      (val) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(val),
      { message: "Invalid ISO date format" }
    ),
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivered",
    "cancelled",
  ]),
  items: z.array(
    z.object({
      menuId: z.number().min(1),
      name: z.string().min(2).max(100),
      quantity: z.number().min(1),
      price: z.number().min(0),
      originalPrice: z.number().min(0),
      image: z.string().url().optional(),
      filePath: z.string().min(5).max(200).optional(),
    })
  ),
  totalAmount: z.number().min(0),
  originalAmount: z.number().min(0),
  totalSavings: z.number().min(0),
  deliveryAddress: z.string().min(5).max(200).optional(),
  specialInstructions: z.string().max(500).optional(),
  customerInfo: z.object({
    id: z.union([z.number().min(1), z.string().uuid()]).optional(),
    name: z.string().min(2).max(100),
    phone: z.string().min(10).max(15),
    profile_picture: z.string().url().optional(),
    username: z.string().min(2).max(100),
    isPremium: z.boolean().optional(),
    create_at: z
      .string()
      .refine(
        (val) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(val),
        { message: "Invalid ISO date format" }
      )
      .optional(),
    email: z.string().email(),
    address: z.string().min(5).max(200).optional(),
    notes: z.string().max(500).optional(),
    paymentMethod: z.string().min(2).max(100).optional(),
  }),
  submittedToApi: z.boolean(),
  estimatedDeliveryTime: z
    .string()
    .refine(
      (val) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(val),
      { message: "Invalid ISO date format" }
    )
    .optional(),
});
