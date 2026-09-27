import type { RequestHandler } from "express";
import type { AuthenticatedRequest } from "../../middleware/authenticate.js";
import { followTarget, listFollows, unfollowTarget } from "./service.js";

const getUser = (req: Parameters<RequestHandler>[0]) =>
  (req as AuthenticatedRequest).user;

export const listFollowsController: RequestHandler = async (req, res, next) => {
  try {
    const follows = await listFollows(req.query);
    res.status(200).json({ success: true, ...follows });
  } catch (error) {
    next(error);
  }
};

export const followTargetController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const follow = await followTarget(getUser(req).userId, req.body);
    res.status(200).json({ success: true, data: follow });
  } catch (error) {
    next(error);
  }
};

export const unfollowTargetController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const targetType = req.params.targetType as "user" | "brand" | "vehicle";
    await unfollowTarget(
      getUser(req).userId,
      targetType,
      String(req.params.targetId),
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
