import { Schema, model } from "mongoose";
import { commentStatuses, reactionTypes } from "./types.js";

const commentSchema = new Schema(
  {
    content: {
      type: Schema.Types.ObjectId,
      ref: "Content",
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    body: { type: String, required: true, trim: true, maxlength: 2_000 },
    status: {
      type: String,
      enum: commentStatuses,
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

commentSchema.index({ content: 1, status: 1, createdAt: 1 });
export const CommentModel = model("Comment", commentSchema);

const bookmarkSchema = new Schema(
  {
    content: { type: Schema.Types.ObjectId, ref: "Content", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

bookmarkSchema.index({ user: 1, content: 1 }, { unique: true });
bookmarkSchema.index({ user: 1, createdAt: -1 });
export const BookmarkModel = model("Bookmark", bookmarkSchema);

const reactionSchema = new Schema(
  {
    content: { type: Schema.Types.ObjectId, ref: "Content", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: reactionTypes, required: true },
  },
  { timestamps: true },
);

reactionSchema.index({ user: 1, content: 1 }, { unique: true });
reactionSchema.index({ content: 1, type: 1 });
export const ReactionModel = model("Reaction", reactionSchema);
