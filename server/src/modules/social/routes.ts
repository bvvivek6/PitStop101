import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import {
  followTargetController,
  listFollowsController,
  unfollowTargetController,
} from "./controller.js";
import { followListQuerySchema, followTargetSchema } from "./validator.js";

export const socialRoutes = Router();

socialRoutes.get(
  "/follows",
  validateQuery(followListQuerySchema),
  listFollowsController,
);
socialRoutes.post(
  "/follow",
  authenticate,
  validateBody(followTargetSchema),
  followTargetController,
);
socialRoutes.delete(
  "/follow/:targetType/:targetId",
  authenticate,
  unfollowTargetController,
);
