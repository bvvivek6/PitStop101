import { Types } from "mongoose";
import { AppError } from "../../middleware/error-handler.js";
import { AnalyticsEventModel } from "./model.js";
import type { AnalyticsQuery, CreateAnalyticsEventInput } from "./types.js";

const normalizeLimit = (value?: string) =>
  Math.min(Math.max(Number.parseInt(value ?? "20", 10) || 20, 1), 100);

export const recordAnalyticsEvent = async (
  input: CreateAnalyticsEventInput,
  userId?: string,
) => {
  if (input.entityId && !Types.ObjectId.isValid(input.entityId)) {
    throw new AppError("Invalid analytics entity id", 400);
  }
  if (!input.entityId && input.entityType && input.entityType !== "search") {
    throw new AppError("Analytics entity id is required", 400);
  }
  if (!input.sessionId && !input.anonymousId && !userId) {
    throw new AppError("A session, anonymous, or authenticated identity is required", 400);
  }

  return AnalyticsEventModel.create({
    ...input,
    entityId: input.entityId || undefined,
    user: userId || undefined,
  });
};

export const getAnalytics = async (query: AnalyticsQuery) => {
  const createdAt: Record<string, Date> = {};
  if (query.from) createdAt.$gte = new Date(query.from);
  if (query.to) createdAt.$lte = new Date(query.to);

  const filter: Record<string, unknown> = {};
  if (Object.keys(createdAt).length) filter.createdAt = createdAt;
  if (query.entityType) filter.entityType = query.entityType;
  if (query.eventType) filter.eventType = query.eventType;

  const limit = normalizeLimit(query.limit);
  const [events, totals] = await Promise.all([
    AnalyticsEventModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { entityType: "$entityType", entityId: "$entityId" },
          events: { $sum: 1 },
          eventTypes: { $addToSet: "$eventType" },
          lastEventAt: { $max: "$createdAt" },
        },
      },
      { $sort: { events: -1, lastEventAt: -1 } },
      { $limit: limit },
    ]).exec(),
    AnalyticsEventModel.aggregate([
      { $match: filter },
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).exec(),
  ]);

  return { events, totals };
};
