import { Types } from "mongoose";
import { AppError } from "../../middleware/error-handler.js";
import { paginate, parsePagination } from "../../utils/pagination.js";
import { GenerationModel, VariantModel, VehicleModel } from "./model.js";
import type { VehicleListQuery } from "./types.js";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const listVehicles = async (query: VehicleListQuery) => {
  const params = parsePagination(query.page, query.limit);
  const filter: Record<string, unknown> = {};
  if (query.search)
    filter.name = { $regex: escapeRegex(query.search), $options: "i" };
  if (query.vehicleType) filter.vehicleType = query.vehicleType;
  if (query.fuelType) filter.fuelTypes = query.fuelType;
  if (query.brand && Types.ObjectId.isValid(query.brand))
    filter.brand = query.brand;
  return paginate(VehicleModel, filter, params);
};

export const getVehicleBySlug = async (slug: string) => {
  const vehicle = await VehicleModel.findOne({ slug: slug.toLowerCase() })
    .populate("brand", "name slug")
    .lean()
    .exec();
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  return vehicle;
};

export const listGenerations = (
  vehicleId: string,
  query: { page?: string; limit?: string },
) => {
  if (!Types.ObjectId.isValid(vehicleId))
    throw new AppError("Invalid vehicle id", 400);
  return paginate(
    GenerationModel,
    { vehicle: vehicleId },
    parsePagination(query.page, query.limit),
  );
};

export const listVariants = (
  generationId: string,
  query: { page?: string; limit?: string },
) => {
  if (!Types.ObjectId.isValid(generationId))
    throw new AppError("Invalid generation id", 400);
  return paginate(
    VariantModel,
    { generation: generationId },
    parsePagination(query.page, query.limit),
  );
};
