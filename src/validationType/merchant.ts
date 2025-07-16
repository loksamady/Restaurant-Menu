import { phoneNumberRegex, slugRegex } from "@src/util/regexUtil";
import { z } from "zod";

export const merchantSchema = z.object({
  name: z.string().min(1, "Required"),
  titleEn: z.string(),
  titleKh: z.string(),
  titleCn: z.string(),
  subtitleEn: z.string(),
  subtitleKh: z.string(),
  subtitleCn: z.string(),
  primaryPhone: z
    .string()
    .min(9, "Invalid")
    .max(20, "Max 20 chars")
    .regex(
      phoneNumberRegex,
      "9 to 20 chars, only '+', '(', ')', numeric, and space"
    )
    .optional()
    .or(z.null()),
  secondaryPhone: z
    .string()
    .min(9, "Invalid")
    .max(20, "Max 20 chars")
    .regex(
      phoneNumberRegex,
      "9 to 20 chars, only '+', '(', ')', numeric, and space"
    )
    .optional()
    .or(z.literal("")) // Allows an empty string
    .or(z.null()),
  descriptionEn: z.string(),
  descriptionKh: z.string(),
  descriptionCn: z.string(),
  location: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === "" ||
        z.string().url().safeParse(value).success,
      { message: "Invalid" }
    ),
  openTime: z.string(),
  closeTime: z.string(),
  slug: z
    .string()
    .regex(slugRegex, "Only lowercase, number, and hyphen")
    .optional()
    .or(z.literal("")) // Allows an empty string
    .or(z.null()),
  address: z.string(),
  telegram: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === "" ||
        z.string().url().safeParse(value).success,
      { message: "Invalid" }
    ),
  facebook: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === "" ||
        z.string().url().safeParse(value).success,
      { message: "Invalid" }
    ),
  instagram: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === "" ||
        z.string().url().safeParse(value).success,
      { message: "Invalid" }
    ),
  tiktok: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === "" ||
        z.string().url().safeParse(value).success,
      { message: "Invalid" }
    ),
  active: z.boolean().default(true),
  logo: z.array(z.any()).optional(),
  banners: z.array(z.any()).optional(),
});

export const merchantThemeSchema = z.object({
  primary: z.string().max(6, "Invalid"),
  primaryLight: z.string().max(6, "Invalid"),
  primaryDark: z.string().max(6, "Invalid"),
  secondary: z.string().max(6, "Invalid"),
  secondaryLight: z.string().max(6, "Invalid"),
  secondaryDark: z.string().max(6, "Invalid"),
});

export type MerchantSchemaType = z.infer<typeof merchantSchema>;
export type MerchantThemeSchemaType = z.infer<typeof merchantThemeSchema>;
