export const contentTypes = [
  "news",
  "feature",
  "review",
  "first-drive",
  "comparison",
  "guide",
  "opinion",
  "interview",
  "launch",
  "analysis",
  "video",
  "gallery",
] as const;

export const contentStatuses = [
  "draft",
  "review",
  "published",
  "archived",
] as const;

export type ContentType = (typeof contentTypes)[number];
export type ContentStatus = (typeof contentStatuses)[number];

export interface ContentListQuery {
  page?: string;
  limit?: string;
  type?: ContentType;
  status?: ContentStatus;
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
}

export interface MediaAsset {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface SeoFields {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface ReviewMetrics {
  performance?: number;
  comfort?: number;
  practicality?: number;
  design?: number;
  value?: number;
  safety?: number;
  technology?: number;
}

export interface ComparisonEntry {
  vehicleId?: string;
  label?: string;
  score?: number;
}

export interface CreateContentInput {
  title: string;
  slug?: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  type: ContentType;
  status?: ContentStatus;
  category?: string;
  tags?: string[];
  author?: string;
  coverImage?: MediaAsset;
  gallery?: MediaAsset[];
  relatedVehicles?: string[];
  relatedBrands?: string[];
  seo?: SeoFields;
  source?: { name?: string; url?: string };
  references?: Array<{ title?: string; url?: string }>;
  reviewMetrics?: ReviewMetrics;
  comparisonData?: {
    summary?: string;
    entries?: ComparisonEntry[];
  };
}

export interface UpdateContentInput extends Partial<CreateContentInput> {
  publishedAt?: Date | string | null;
}
