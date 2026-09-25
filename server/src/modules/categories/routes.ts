import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authenticate.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import {
  createCategoryController,
  getCategoryController,
  listCategoriesController,
} from "./controller.js";
import { categoryListQuerySchema, createCategorySchema } from "./validator.js";

export const categoryRoutes = Router();
categoryRoutes.get(
  "/",
  validateQuery(categoryListQuerySchema),
  listCategoriesController,
);
categoryRoutes.get("/:slug", getCategoryController);
categoryRoutes.post(
  "/",
  authenticate,
  authorize("editor", "admin"),
  validateBody(createCategorySchema),
  createCategoryController,
);
