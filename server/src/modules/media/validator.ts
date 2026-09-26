import { z } from "zod";
import { mediaKinds, mediaProviders, mediaStatuses } from "./types.js";

export const mediaListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  kind: z.enum(mediaKinds).optional(),
  status: z.enum(mediaStatuses).optional(),
  owner: z.string().optional(),
});

export const createMediaSchema = z.object({
  url: z.string().url(),
  publicId: z.string().trim().max(255).optional(),
  kind: z.enum(mediaKinds),
  provider: z.enum(mediaProviders).optional(),
  alt: z.string().trim().max(200).optional(),
  caption: z.string().trim().max(500).optional(),
  mimeType: z.string().trim().max(100).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  durationSeconds: z.number().nonnegative().optional(),
  bytes: z.number().int().nonnegative().optional(),
  metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
});
