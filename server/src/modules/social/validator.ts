import { z } from "zod";
import { followTargetTypes } from "./types.js";

export const followListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  targetType: z.enum(followTargetTypes).optional(),
});

export const followTargetSchema = z.object({
  targetType: z.enum(followTargetTypes),
  targetId: z.string().min(1),
});
