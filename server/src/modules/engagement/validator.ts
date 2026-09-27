import { z } from "zod";
import { commentStatuses, reactionTypes } from "./types.js";

export const commentListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(2_000),
  parentComment: z.string().optional(),
});

export const setReactionSchema = z.object({
  type: z.enum(reactionTypes),
});

export const moderateCommentSchema = z.object({
  status: z.enum(commentStatuses),
});
