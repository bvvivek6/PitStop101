import { Router } from "express";
import { authenticate, authorize } from "../../middleware/authenticate.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import {
  createCommentController,
  listCommentsController,
  moderateCommentController,
  removeBookmarkController,
  removeReactionController,
  saveBookmarkController,
  setReactionController,
} from "./controller.js";
import {
  commentListQuerySchema,
  createCommentSchema,
  moderateCommentSchema,
  setReactionSchema,
} from "./validator.js";

export const engagementRoutes = Router();

engagementRoutes.get(
  "/content/:contentId/comments",
  validateQuery(commentListQuerySchema),
  listCommentsController,
);
engagementRoutes.post(
  "/content/:contentId/comments",
  authenticate,
  validateBody(createCommentSchema),
  createCommentController,
);
engagementRoutes.patch(
  "/comments/:commentId/status",
  authenticate,
  authorize("editor", "admin"),
  validateBody(moderateCommentSchema),
  moderateCommentController,
);

engagementRoutes.put(
  "/content/:contentId/bookmark",
  authenticate,
  saveBookmarkController,
);
engagementRoutes.delete(
  "/content/:contentId/bookmark",
  authenticate,
  removeBookmarkController,
);

engagementRoutes.put(
  "/content/:contentId/reaction",
  authenticate,
  validateBody(setReactionSchema),
  setReactionController,
);
engagementRoutes.delete(
  "/content/:contentId/reaction",
  authenticate,
  removeReactionController,
);
