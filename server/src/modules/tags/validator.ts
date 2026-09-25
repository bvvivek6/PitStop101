import { z } from "zod";

export const tagListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().trim().max(100).optional(),
});

export const createTagSchema = z.object({
  name: z.string().trim().min(2).max(50),
  slug: z.string().trim().min(2).max(60).optional(),
});
