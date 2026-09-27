export const commentStatuses = ["pending", "approved", "rejected"] as const;
export const reactionTypes = [
  "like",
  "love",
  "insightful",
  "disagree",
] as const;

export type CommentStatus = (typeof commentStatuses)[number];
export type ReactionType = (typeof reactionTypes)[number];

export interface CommentListQuery {
  page?: string;
  limit?: string;
}

export interface CreateCommentInput {
  body: string;
  parentComment?: string;
}

export interface SetReactionInput {
  type: ReactionType;
}

export interface ModerateCommentInput {
  status: CommentStatus;
}
