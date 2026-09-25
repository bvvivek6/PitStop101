import { z } from "zod";

export const categoryListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().trim().max(100).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(1_000).optional(),
  parentCategory: z.string().optional(),
});
