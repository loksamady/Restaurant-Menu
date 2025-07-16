import { z } from "zod";

export const createMenuSchema = z.object({
  nameEn: z.string().min(1, "Required"),
  nameKh: z.string().min(1, "Required"),
  nameCn: z.string().min(1, "Required"),
  code: z.string().optional().nullable(),
  descriptionEn: z.string(),
  descriptionKh: z.string(),
  descriptionCn: z.string(),
  price: z.number(),
  priceKh: z.number(),
  discount: z.number(),
  status: z.number(),
  categories: z.array(z.number().int()),
  files: z.array(z.any()).optional(),
  setMainFileId: z.number().optional(),
  merchantId: z.number().optional().nullable(),
  hot: z.boolean(),
});

export type CreateMenuSchemaType = z.infer<typeof createMenuSchema>;
