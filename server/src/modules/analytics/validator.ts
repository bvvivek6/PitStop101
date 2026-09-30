import { z } from "zod";
import { analyticsEntityTypes, analyticsEventTypes } from "./types.js";

const metadataSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
);

export const createAnalyticsEventSchema = z.object({
  eventType: z.enum(analyticsEventTypes),
  entityType: z.enum(analyticsEntityTypes).optional(),
  entityId: z.string().optional(),
  sessionId: z.string().trim().min(1).max(120).optional(),
  anonymousId: z.string().trim().min(1).max(120).optional(),
  metadata: metadataSchema.optional(),
});

export const analyticsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  entityType: z.enum(analyticsEntityTypes).optional(),
  eventType: z.enum(analyticsEventTypes).optional(),
  limit: z.string().optional(),
});
