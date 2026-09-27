export const followTargetTypes = ["user", "brand", "vehicle"] as const;

export type FollowTargetType = (typeof followTargetTypes)[number];

export interface FollowListQuery {
  page?: string;
  limit?: string;
  targetType?: FollowTargetType;
}

export interface FollowTargetInput {
  targetType: FollowTargetType;
  targetId: string;
}
