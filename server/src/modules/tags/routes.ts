import { Router } from "express";
import { authenticate, authorize } from "../../middleware/authenticate.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import {
  createTagController,
  getTagController,
  listTagsController,
} from "./controller.js";
import { createTagSchema, tagListQuerySchema } from "./validator.js";

export const tagRoutes = Router();
tagRoutes.get("/", validateQuery(tagListQuerySchema), listTagsController);
tagRoutes.get("/:slug", getTagController);
tagRoutes.post(
  "/",
  authenticate,
  authorize("editor", "admin"),
  validateBody(createTagSchema),
  createTagController,
);
