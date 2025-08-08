import { z } from "zod";

export const CreateCustomerSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  username: z.string().min(1, "Username is required"),
  phone_number: z.string().min(5, "Phone number must be at least 5 characters"),
  address: z.string().min(1, "Address is required"),
  telegram_id: z.string().optional(),
  telegram_username: z.string().optional(),
});

export type CreateCustomerSchemaType = z.infer<typeof CreateCustomerSchema>;
