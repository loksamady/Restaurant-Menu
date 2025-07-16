import { z } from "zod";

export const createPageSchema = z.object({
  titleEn: z.string().min(2, "Required"),
  titleKh: z.string().min(2, "Required"),
  parentId: z.number().optional(),
  url: z.string().optional(),
  displayOrder: z.number().optional(),
  status: z.number(),
  descriptionEn: z.string().optional(),
  descriptionKh: z.string().optional(),
});

export type CreatePageSchemaType = z.infer<typeof createPageSchema>;
