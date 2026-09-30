import { Router } from "express";
import { authenticate, authorize } from "../../middleware/authenticate.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import {
  getAnalyticsController,
  recordAnalyticsEventController,
} from "./controller.js";
import {
  analyticsQuerySchema,
  createAnalyticsEventSchema,
} from "./validator.js";

export const analyticsRoutes = Router();

analyticsRoutes.post(
  "/events",
  validateBody(createAnalyticsEventSchema),
  recordAnalyticsEventController,
);
analyticsRoutes.get(
  "/",
  authenticate,
  authorize("editor", "admin"),
  validateQuery(analyticsQuerySchema),
  getAnalyticsController,
);
