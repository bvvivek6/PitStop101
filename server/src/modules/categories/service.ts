import { AppError } from "../../middleware/error-handler.js";
import { paginate, parsePagination } from "../../utils/pagination.js";
import { CategoryModel } from "./model.js";
import type { CategoryListQuery, CreateCategoryInput } from "./types.js";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "category";

export const listCategories = async (query: CategoryListQuery) => {
  const params = parsePagination(query.page, query.limit);
  const filter = query.search
    ? { name: { $regex: query.search, $options: "i" } }
    : {};
  return paginate(CategoryModel, filter, params);
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await CategoryModel.findOne({ slug: slug.toLowerCase() })
    .lean()
    .exec();
  if (!category) throw new AppError("Category not found", 404);
  return category;
};

export const createCategory = async (input: CreateCategoryInput) => {
  const slug = (input.slug ?? slugify(input.name)).toLowerCase();
  const existing = await CategoryModel.exists({ slug }).exec();
  if (existing) throw new AppError("Category already exists", 409);

  return CategoryModel.create({
    name: input.name,
    slug,
    description: input.description,
    parentCategory: input.parentCategory || null,
  });
};
