import { Types } from "mongoose";
import { AppError } from "../../middleware/error-handler.js";
import { ContentModel } from "./model.js";
import type {
  ContentListQuery,
  CreateContentInput,
  UpdateContentInput,
} from "./types.js";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "story";

export const listContent = async (query: ContentListQuery) => {
  const page = Number.parseInt(query.page ?? "1", 10) || 1;
  const limit = Math.min(Number.parseInt(query.limit ?? "20", 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  else filter.status = "published";
  if (query.category) filter.category = query.category;
  if (query.author) filter.author = query.author;
  if (query.tag) filter.tags = query.tag;

  if (query.search) {
    filter.$or = [
      { title: { $regex: escapeRegex(query.search), $options: "i" } },
      { excerpt: { $regex: escapeRegex(query.search), $options: "i" } },
      { subtitle: { $regex: escapeRegex(query.search), $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    ContentModel.find(filter)
      .populate("author", "name role")
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    ContentModel.countDocuments(filter).exec(),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getContentBySlug = async (slug: string) => {
  const content = await ContentModel.findOne({ slug: slug.toLowerCase() })
    .populate("author", "name role")
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .lean()
    .exec();

  if (!content) throw new AppError("Content not found", 404);
  return content;
};

export const createContent = async (input: CreateContentInput) => {
  const authorId = input.author ?? "";
  if (!Types.ObjectId.isValid(authorId)) {
    throw new AppError("Invalid author id", 400);
  }

  const slug = (input.slug ?? slugify(input.title)).toLowerCase();
  const existing = await ContentModel.exists({ slug }).exec();
  if (existing)
    throw new AppError("A content item with that slug already exists", 409);

  const content = await ContentModel.create({
    ...input,
    slug,
    author: authorId,
    publishedAt: input.status === "published" ? new Date() : null,
    readingTime: Math.max(Math.ceil((input.content.length || 1) / 180), 1),
  });

  return ContentModel.findById(content._id)
    .populate("author", "name role")
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .lean()
    .exec();
};

export const updateContent = async (id: string, input: UpdateContentInput) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Invalid content id", 400);

  const existing = await ContentModel.findById(id).exec();
  if (!existing) throw new AppError("Content not found", 404);

  if (input.title && !input.slug) {
    input.slug = slugify(input.title);
  }

  if (input.slug) {
    const slug = input.slug.toLowerCase();
    const duplicate = await ContentModel.exists({
      slug,
      _id: { $ne: id },
    }).exec();
    if (duplicate)
      throw new AppError("A content item with that slug already exists", 409);
  }

  const updatePayload: UpdateContentInput = { ...input };

  if (input.status === "published" && !existing.publishedAt) {
    updatePayload.publishedAt = new Date();
  }

  const updated = await ContentModel.findByIdAndUpdate(
    id,
    {
      ...updatePayload,
      ...(input.content
        ? { readingTime: Math.max(Math.ceil(input.content.length / 180), 1) }
        : {}),
    },
    { new: true },
  )
    .populate("author", "name role")
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .lean()
    .exec();

  if (!updated) throw new AppError("Content not found", 404);
  return updated;
};

export const deleteContent = async (id: string) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Invalid content id", 400);
  const deleted = await ContentModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new AppError("Content not found", 404);
  return deleted;
};

export const publishContent = async (id: string) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Invalid content id", 400);

  const published = await ContentModel.findByIdAndUpdate(
    id,
    { status: "published", publishedAt: new Date() },
    { new: true },
  )
    .populate("author", "name role")
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .lean()
    .exec();

  if (!published) throw new AppError("Content not found", 404);
  return published;
};
