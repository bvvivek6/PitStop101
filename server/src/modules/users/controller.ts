import type { RequestHandler } from "express";
import { findPublicUserById } from "./service.js";
import type { AuthenticatedRequest } from "../../middleware/authenticate.js";

export const getCurrentUser: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const currentUser = await findPublicUserById(user.userId);
    res.status(200).json({ success: true, data: currentUser });
  } catch (error) {
    next(error);
  }
};
