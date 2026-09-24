import { z } from "zod";

export const brandListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().trim().max(100).optional(),
});
