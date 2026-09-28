export const searchEntityTypes = [
  "content",
  "vehicle",
  "brand",
  "category",
  "tag",
] as const;

export type SearchEntityType = (typeof searchEntityTypes)[number];

export interface SearchQuery {
  q: string;
  types?: SearchEntityType[] | string;
  limit?: string;
}

export interface SearchResult {
  entityType: SearchEntityType;
  entityId: string;
  title: string;
  slug: string;
  description?: string;
  metadata?: Record<string, unknown>;
}
