import type { RequestHandler } from "express";
import type { AuthenticatedRequest } from "../../middleware/authenticate.js";
import {
  createContent,
  deleteContent,
  getContentBySlug,
  listContent,
  publishContent,
  updateContent,
} from "./service.js";

export const listContentController: RequestHandler = async (req, res, next) => {
  try {
    const content = await listContent(req.query);
    res.status(200).json({ success: true, ...content });
  } catch (error) {
    next(error);
  }
};

export const getContentController: RequestHandler = async (req, res, next) => {
  try {
    const content = await getContentBySlug(String(req.params.slug));
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

export const createContentController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const content = await createContent({
      ...req.body,
      author: user.userId ?? req.body.author,
    });
    res.status(201).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

export const updateContentController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const content = await updateContent(String(req.params.id), req.body);
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

export const deleteContentController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const content = await deleteContent(String(req.params.id));
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

export const publishContentController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const content = await publishContent(String(req.params.id));
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};
