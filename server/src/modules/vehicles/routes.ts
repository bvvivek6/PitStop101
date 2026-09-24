import { Router } from "express";
import { validateQuery } from "../../middleware/validate.js";
import {
  getVehicleController,
  listGenerationsController,
  listVariantsController,
  listVehiclesController,
} from "./controller.js";
import { paginationQuerySchema, vehicleListQuerySchema } from "./validator.js";

export const vehicleRoutes = Router();
vehicleRoutes.get(
  "/",
  validateQuery(vehicleListQuerySchema),
  listVehiclesController,
);
vehicleRoutes.get("/:slug", getVehicleController);
vehicleRoutes.get(
  "/:vehicleId/generations",
  validateQuery(paginationQuerySchema),
  listGenerationsController,
);
vehicleRoutes.get(
  "/generations/:generationId/variants",
  validateQuery(paginationQuerySchema),
  listVariantsController,
);
