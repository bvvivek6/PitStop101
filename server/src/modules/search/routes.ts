import { Router } from "express";
import { validateQuery } from "../../middleware/validate.js";
import { searchController } from "./controller.js";
import { searchQuerySchema } from "./validator.js";

export const searchRoutes = Router();
searchRoutes.get("/", validateQuery(searchQuerySchema), searchController);
