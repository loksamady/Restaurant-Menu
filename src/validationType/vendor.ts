import { passwordRegex, usernameRegex } from "@src/util/regexUtil";
import { z } from "zod";

export const vendorSchema = z.object({
  name: z.string().min(1, "Required"),
  period: z.number(),
  price: z.number(),
  discount: z.number(),
  merchantLimit: z.number().min(1, "Required"),
  status: z.boolean().default(true),
  username: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(15, "Maximum 15 characters")
    .regex(usernameRegex, "Alphanumeric and underscores only"),
  userRoles: z.array(z.number().int()).optional(),
});

export const createSchema = vendorSchema.extend({
  userPassword: z.string().regex(passwordRegex, "Must follow the requirements"),
});

export const updateSchema = vendorSchema.extend({
  userPassword: z
    .string()
    .regex(passwordRegex, "Must follow the requirements")
    .optional()
    .or(z.literal("")),
});

export type CreateVendorSchemaType = z.infer<typeof createSchema>;
export type UpdateVendorSchemaType = z.infer<typeof updateSchema>;
