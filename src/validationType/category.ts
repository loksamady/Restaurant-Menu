import { z } from "zod";

export const createCategorySchema = z.object({
  nameEn: z.string().min(1, "Required"),
  nameKh: z.string().min(1, "Required"),
  nameCn: z.string().min(1, "Required"),
  status: z.number(),
  displayOrder: z.number().optional().nullable(),
  merchantId: z.number().optional().nullable(),
});

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;
