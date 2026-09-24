import { z } from "zod";
import { fuelTypes, vehicleTypes } from "./types.js";

export const vehicleListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().trim().max(100).optional(),
  vehicleType: z.enum(vehicleTypes).optional(),
  fuelType: z.enum(fuelTypes).optional(),
  brand: z.string().optional(),
});

export const paginationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
