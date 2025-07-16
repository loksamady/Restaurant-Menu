import { passwordRegex, usernameRegex } from "@src/util/regexUtil";
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

// Base schema used by both create and update
const baseUserSchema = z.object({
  roles: z
    .array(z.number().int())
    .refine((value) => value && value.length !== 0, {
      message: "Roles is required",
    }),
  merchantId: z.number().optional().nullable(),
});

// For creating a user: requires username and password
export const createUserSchema = baseUserSchema.extend({
  username: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(15, "Maximum 15 characters")
    .regex(usernameRegex, "Alphanumeric and underscores only"),
  password: z.string().regex(passwordRegex, "Must follow the requirements"),
});

// For updating a user: Rot required, password is optional
export const updateUserSchema = baseUserSchema.extend({
  username: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(15, "Maximum 15 characters")
    .regex(usernameRegex, "Alphanumeric and underscores only"),
  password: z
    .string()
    .regex(passwordRegex, "Must follow the requirements")
    .optional()
    .or(z.literal("")), // allow empty string
});

export const updateAuthSchema = z.object({
  username: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(15, "Maximum 15 characters")
    .regex(usernameRegex, "Alphanumeric and underscores only"),
  password: z
    .string()
    .regex(passwordRegex, "Must follow the requirements")
    .optional()
    .or(z.literal("")), // allow empty string
});

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;
export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
export type UpdateAuthSchemaType = z.infer<typeof updateAuthSchema>;
