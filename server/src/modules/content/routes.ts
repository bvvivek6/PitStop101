import { Router } from "express";
import { authenticate, authorize } from "../../middleware/authenticate.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import {
  createContentController,
  deleteContentController,
  getContentController,
  listContentController,
  publishContentController,
  updateContentController,
} from "./controller.js";
import {
  contentListQuerySchema,
  createContentSchema,
  updateContentSchema,
} from "./validator.js";

export const contentRoutes = Router();
contentRoutes.get(
  "/",
  validateQuery(contentListQuerySchema),
  listContentController,
);
contentRoutes.get("/:slug", getContentController);
contentRoutes.post(
  "/",
  authenticate,
  authorize("author", "editor", "admin"),
  validateBody(createContentSchema),
  createContentController,
);
contentRoutes.patch(
  "/:id",
  authenticate,
  authorize("author", "editor", "admin"),
  validateBody(updateContentSchema),
  updateContentController,
);
contentRoutes.post(
  "/:id/publish",
  authenticate,
  authorize("editor", "admin"),
  publishContentController,
);
contentRoutes.delete(
  "/:id",
  authenticate,
  authorize("editor", "admin"),
  deleteContentController,
);
