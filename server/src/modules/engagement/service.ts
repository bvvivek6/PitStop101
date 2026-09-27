import { Types } from "mongoose";
import { AppError } from "../../middleware/error-handler.js";
import { ContentModel } from "../content/model.js";
import { paginate, parsePagination } from "../../utils/pagination.js";
import { BookmarkModel, CommentModel, ReactionModel } from "./model.js";
import type {
  CommentListQuery,
  CreateCommentInput,
  ModerateCommentInput,
  SetReactionInput,
} from "./types.js";

const assertObjectId = (value: string, label: string) => {
  if (!Types.ObjectId.isValid(value))
    throw new AppError(`Invalid ${label} id`, 400);
};

const assertContent = async (contentId: string) => {
  assertObjectId(contentId, "content");
  const exists = await ContentModel.exists({
    _id: contentId,
    status: "published",
  }).exec();
  if (!exists) throw new AppError("Published content not found", 404);
};

export const listComments = async (
  contentId: string,
  query: CommentListQuery,
) => {
  await assertContent(contentId);
  return paginate(
    CommentModel,
    { content: contentId, status: "approved" },
    parsePagination(query.page, query.limit),
  );
};

export const createComment = async (
  contentId: string,
  input: CreateCommentInput,
  authorId: string,
) => {
  await assertContent(contentId);
  assertObjectId(authorId, "author");

  if (input.parentComment) {
    assertObjectId(input.parentComment, "parent comment");
    const parent = await CommentModel.exists({
      _id: input.parentComment,
      content: contentId,
      status: "approved",
    }).exec();
    if (!parent) throw new AppError("Parent comment not found", 404);
  }

  return CommentModel.create({
    ...input,
    content: contentId,
    author: authorId,
  });
};

export const moderateComment = async (
  commentId: string,
  input: ModerateCommentInput,
) => {
  assertObjectId(commentId, "comment");
  const comment = await CommentModel.findByIdAndUpdate(
    commentId,
    { status: input.status },
    { new: true },
  )
    .populate("author", "name avatarUrl")
    .lean()
    .exec();

  if (!comment) throw new AppError("Comment not found", 404);
  return comment;
};

export const saveBookmark = async (contentId: string, userId: string) => {
  await assertContent(contentId);
  assertObjectId(userId, "user");
  return BookmarkModel.findOneAndUpdate(
    { content: contentId, user: userId },
    { content: contentId, user: userId },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
    .lean()
    .exec();
};

export const removeBookmark = async (contentId: string, userId: string) => {
  assertObjectId(contentId, "content");
  assertObjectId(userId, "user");
  const deleted = await BookmarkModel.findOneAndDelete({
    content: contentId,
    user: userId,
  }).exec();
  if (!deleted) throw new AppError("Bookmark not found", 404);
};

export const setReaction = async (
  contentId: string,
  userId: string,
  input: SetReactionInput,
) => {
  await assertContent(contentId);
  assertObjectId(userId, "user");
  return ReactionModel.findOneAndUpdate(
    { content: contentId, user: userId },
    { type: input.type },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
    .lean()
    .exec();
};

export const removeReaction = async (contentId: string, userId: string) => {
  assertObjectId(contentId, "content");
  assertObjectId(userId, "user");
  const deleted = await ReactionModel.findOneAndDelete({
    content: contentId,
    user: userId,
  }).exec();
  if (!deleted) throw new AppError("Reaction not found", 404);
};
