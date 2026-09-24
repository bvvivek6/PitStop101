import { Router } from "express";
import { validateQuery } from "../../middleware/validate.js";
import { getBrandController, listBrandsController } from "./controller.js";
import { brandListQuerySchema } from "./validator.js";

export const brandRoutes = Router();
brandRoutes.get("/", validateQuery(brandListQuerySchema), listBrandsController);
brandRoutes.get("/:slug", getBrandController);
