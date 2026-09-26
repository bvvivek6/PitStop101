export const mediaKinds = ["image", "video", "audio"] as const;
export const mediaProviders = ["cloudinary", "external"] as const;
export const mediaStatuses = ["active", "archived"] as const;

export type MediaKind = (typeof mediaKinds)[number];
export type MediaProvider = (typeof mediaProviders)[number];
export type MediaStatus = (typeof mediaStatuses)[number];

export interface MediaListQuery {
  page?: string;
  limit?: string;
  kind?: MediaKind;
  status?: MediaStatus;
  owner?: string;
}

export interface CreateMediaInput {
  url: string;
  publicId?: string;
  kind: MediaKind;
  provider?: MediaProvider;
  alt?: string;
  caption?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  bytes?: number;
  metadata?: Record<string, string | number | boolean>;
}
