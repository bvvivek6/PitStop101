import type { RequestHandler } from "express";
import type { AuthenticatedRequest } from "../../middleware/authenticate.js";
import { getAnalytics, recordAnalyticsEvent } from "./service.js";

export const recordAnalyticsEventController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const event = await recordAnalyticsEvent(req.body, userId);
    res.status(202).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsController: RequestHandler = async (req, res, next) => {
  try {
    const analytics = await getAnalytics(req.query);
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
};
