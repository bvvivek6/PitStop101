import type { RequestHandler } from "express";
import type { AuthenticatedRequest } from "../../middleware/authenticate.js";
import { archiveMedia, listMedia, registerMedia } from "./service.js";

const getRequestUser = (req: Parameters<RequestHandler>[0]) =>
  (req as AuthenticatedRequest).user;

export const listMediaController: RequestHandler = async (req, res, next) => {
  try {
    const user = getRequestUser(req);
    const canViewAll = user.role === "editor" || user.role === "admin";
    const data = await listMedia(req.query, user.userId, canViewAll);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

export const registerMediaController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const user = getRequestUser(req);
    const media = await registerMedia(req.body, user.userId);
    res.status(201).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
};

export const archiveMediaController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const user = getRequestUser(req);
    const canManageAll = user.role === "editor" || user.role === "admin";
    const media = await archiveMedia(
      String(req.params.id),
      user.userId,
      canManageAll,
    );
    res.status(200).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
};
