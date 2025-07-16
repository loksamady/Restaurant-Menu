import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().min(1, "Required"),
  phone: z.string().min(1, "Required"),
  email: z.string().email("Required"),
  company: z.string().optional(),
  message: z.string().optional(),
});

export type QuoteSchemaType = z.infer<typeof quoteSchema>;
