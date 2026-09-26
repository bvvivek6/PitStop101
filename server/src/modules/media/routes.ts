import { Router } from "express";
import { authenticate, authorize } from "../../middleware/authenticate.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import {
  archiveMediaController,
  listMediaController,
  registerMediaController,
} from "./controller.js";
import { createMediaSchema, mediaListQuerySchema } from "./validator.js";

export const mediaRoutes = Router();
mediaRoutes.use(authenticate);
mediaRoutes.get("/", validateQuery(mediaListQuerySchema), listMediaController);
mediaRoutes.post(
  "/",
  authorize("author", "editor", "admin"),
  validateBody(createMediaSchema),
  registerMediaController,
);
mediaRoutes.delete(
  "/:id",
  authorize("author", "editor", "admin"),
  archiveMediaController,
);
