import { AppError } from "../../middleware/error-handler.js";
import { paginate, parsePagination } from "../../utils/pagination.js";
import { TagModel } from "./model.js";
import type { CreateTagInput, TagListQuery } from "./types.js";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "tag";

export const listTags = async (query: TagListQuery) => {
  const params = parsePagination(query.page, query.limit);
  const filter = query.search
    ? { name: { $regex: query.search, $options: "i" } }
    : {};
  return paginate(TagModel, filter, params);
};

export const getTagBySlug = async (slug: string) => {
  const tag = await TagModel.findOne({ slug: slug.toLowerCase() })
    .lean()
    .exec();
  if (!tag) throw new AppError("Tag not found", 404);
  return tag;
};

export const createTag = async (input: CreateTagInput) => {
  const slug = (input.slug ?? slugify(input.name)).toLowerCase();
  const existing = await TagModel.exists({ slug }).exec();
  if (existing) throw new AppError("Tag already exists", 409);

  return TagModel.create({ name: input.name, slug });
};
