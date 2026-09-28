import { BrandModel } from "../brands/model.js";
import { CategoryModel } from "../categories/model.js";
import { ContentModel } from "../content/model.js";
import { AppError } from "../../middleware/error-handler.js";
import { TagModel } from "../tags/model.js";
import { VehicleModel } from "../vehicles/model.js";
import type { SearchEntityType, SearchQuery, SearchResult } from "./types.js";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const allEntityTypes: SearchEntityType[] = [
  "content",
  "vehicle",
  "brand",
  "category",
  "tag",
];

const normalizeLimit = (value?: string) =>
  Math.min(Math.max(Number.parseInt(value ?? "10", 10) || 10, 1), 25);

const toResult = (
  entityType: SearchEntityType,
  item: {
    _id: unknown;
    name?: string;
    title?: string;
    slug: string;
    description?: string | null;
    excerpt?: string | null;
    type?: string;
    vehicleType?: string;
  },
): SearchResult => ({
  entityType,
  entityId: String(item._id),
  title: item.title ?? item.name ?? item.slug,
  slug: item.slug,
  description: item.description ?? item.excerpt ?? undefined,
  metadata: {
    ...(item.type ? { contentType: item.type } : {}),
    ...(item.vehicleType ? { vehicleType: item.vehicleType } : {}),
  },
});

export const search = async (query: SearchQuery) => {
  const term = escapeRegex(query.q);
  const limit = normalizeLimit(query.limit);
  const requestedTypes =
    typeof query.types === "string" ? query.types.split(",") : query.types;
  const entityTypes = (
    requestedTypes?.length ? requestedTypes : allEntityTypes
  ) as SearchEntityType[];
  if (
    entityTypes.some(
      (type) => !allEntityTypes.includes(type as SearchEntityType),
    )
  ) {
    throw new AppError("Invalid search entity type", 400);
  }
  const pattern = { $regex: term, $options: "i" };

  const searches = await Promise.all(
    entityTypes.map(async (entityType) => {
      switch (entityType) {
        case "content": {
          const items = await ContentModel.find({
            status: "published",
            $or: [
              { title: pattern },
              { subtitle: pattern },
              { excerpt: pattern },
            ],
          })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .lean()
            .exec();
          return items.map((item) => toResult("content", item));
        }
        case "vehicle": {
          const items = await VehicleModel.find({
            $or: [
              { name: pattern },
              { description: pattern },
              { segment: pattern },
            ],
          })
            .sort({ name: 1 })
            .limit(limit)
            .lean()
            .exec();
          return items.map((item) => toResult("vehicle", item));
        }
        case "brand": {
          const items = await BrandModel.find({
            $or: [
              { name: pattern },
              { description: pattern },
              { country: pattern },
            ],
          })
            .sort({ name: 1 })
            .limit(limit)
            .lean()
            .exec();
          return items.map((item) => toResult("brand", item));
        }
        case "category": {
          const items = await CategoryModel.find({
            $or: [{ name: pattern }, { description: pattern }],
          })
            .sort({ name: 1 })
            .limit(limit)
            .lean()
            .exec();
          return items.map((item) => toResult("category", item));
        }
        case "tag": {
          const items = await TagModel.find({ name: pattern })
            .sort({ name: 1 })
            .limit(limit)
            .lean()
            .exec();
          return items.map((item) => toResult("tag", item));
        }
      }
    }),
  );

  const results = searches.flat();
  return {
    query: query.q,
    results,
    counts: results.reduce<Record<string, number>>((counts, result) => {
      counts[result.entityType] = (counts[result.entityType] ?? 0) + 1;
      return counts;
    }, {}),
  };
};
