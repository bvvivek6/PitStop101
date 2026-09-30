export const analyticsEventTypes = [
  "content_view",
  "search",
  "bookmark",
  "reaction",
  "share",
  "media_view",
  "follow",
] as const;

export const analyticsEntityTypes = [
  "content",
  "vehicle",
  "brand",
  "category",
  "tag",
  "media",
  "search",
] as const;

export type AnalyticsEventType = (typeof analyticsEventTypes)[number];
export type AnalyticsEntityType = (typeof analyticsEntityTypes)[number];

export interface CreateAnalyticsEventInput {
  eventType: AnalyticsEventType;
  entityType?: AnalyticsEntityType;
  entityId?: string;
  sessionId?: string;
  anonymousId?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface AnalyticsQuery {
  from?: string;
  to?: string;
  entityType?: AnalyticsEntityType;
  eventType?: AnalyticsEventType;
  limit?: string;
}
