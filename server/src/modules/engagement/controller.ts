import type { RequestHandler } from "express";
import type { AuthenticatedRequest } from "../../middleware/authenticate.js";
import {
  createComment,
  listComments,
  moderateComment,
  removeBookmark,
  removeReaction,
  saveBookmark,
  setReaction,
} from "./service.js";

const getUser = (req: Parameters<RequestHandler>[0]) =>
  (req as AuthenticatedRequest).user;

export const listCommentsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const data = await listComments(String(req.params.contentId), req.query);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

export const createCommentController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const comment = await createComment(
      String(req.params.contentId),
      req.body,
      getUser(req).userId,
    );
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const moderateCommentController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const comment = await moderateComment(
      String(req.params.commentId),
      req.body,
    );
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const saveBookmarkController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const bookmark = await saveBookmark(
      String(req.params.contentId),
      getUser(req).userId,
    );
    res.status(200).json({ success: true, data: bookmark });
  } catch (error) {
    next(error);
  }
};

export const removeBookmarkController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    await removeBookmark(String(req.params.contentId), getUser(req).userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const setReactionController: RequestHandler = async (req, res, next) => {
  try {
    const reaction = await setReaction(
      String(req.params.contentId),
      getUser(req).userId,
      req.body,
    );
    res.status(200).json({ success: true, data: reaction });
  } catch (error) {
    next(error);
  }
};

export const removeReactionController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    await removeReaction(String(req.params.contentId), getUser(req).userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
