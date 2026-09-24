import { AppError } from "../../middleware/error-handler.js";
import { paginate, parsePagination } from "../../utils/pagination.js";
import { BrandModel } from "./model.js";
import type { BrandListQuery } from "./types.js";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const listBrands = (query: BrandListQuery) => {
  const params = parsePagination(query.page, query.limit);
  const filter = query.search
    ? { name: { $regex: escapeRegex(query.search), $options: "i" } }
    : {};
  return paginate(BrandModel, filter, params);
};

export const getBrandBySlug = async (slug: string) => {
  const brand = await BrandModel.findOne({ slug: slug.toLowerCase() })
    .lean()
    .exec();
  if (!brand) throw new AppError("Brand not found", 404);
  return brand;
};
