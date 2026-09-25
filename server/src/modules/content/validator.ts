import { z } from "zod";
import { contentStatuses, contentTypes } from "./types.js";

export const contentListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.enum(contentTypes).optional(),
  status: z.enum(contentStatuses).optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  search: z.string().trim().max(100).optional(),
});

export const createContentSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().min(3).max(180).optional(),
  subtitle: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().min(20),
  type: z.enum(contentTypes),
  status: z.enum(contentStatuses).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  coverImage: z
    .object({
      url: z.string().url(),
      publicId: z.string().optional(),
      alt: z.string().optional(),
    })
    .optional(),
  gallery: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
        alt: z.string().optional(),
      }),
    )
    .optional(),
  relatedVehicles: z.array(z.string()).optional(),
  relatedBrands: z.array(z.string()).optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      canonicalUrl: z.string().url().optional(),
    })
    .optional(),
  source: z
    .object({
      name: z.string().optional(),
      url: z.string().url().optional(),
    })
    .optional(),
  references: z
    .array(
      z.object({
        title: z.string().optional(),
        url: z.string().url(),
      }),
    )
    .optional(),
  reviewMetrics: z
    .object({
      performance: z.number().min(0).max(10).optional(),
      comfort: z.number().min(0).max(10).optional(),
      practicality: z.number().min(0).max(10).optional(),
      design: z.number().min(0).max(10).optional(),
      value: z.number().min(0).max(10).optional(),
      safety: z.number().min(0).max(10).optional(),
      technology: z.number().min(0).max(10).optional(),
    })
    .optional(),
  comparisonData: z
    .object({
      summary: z.string().optional(),
      entries: z
        .array(
          z.object({
            vehicleId: z.string().optional(),
            label: z.string().optional(),
            score: z.number().min(0).max(10).optional(),
          }),
        )
        .optional(),
    })
    .optional(),
});

export const updateContentSchema = createContentSchema.partial();
