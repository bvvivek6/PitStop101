import { Types } from "mongoose";
import { AppError } from "../../middleware/error-handler.js";
import { paginate, parsePagination } from "../../utils/pagination.js";
import { MediaAssetModel } from "./model.js";
import type { CreateMediaInput, MediaListQuery } from "./types.js";

export const listMedia = async (
  query: MediaListQuery,
  requestingUserId: string,
  canViewAll: boolean,
) => {
  const filter: Record<string, unknown> = {
    status: query.status ?? "active",
  };

  if (query.kind) filter.kind = query.kind;
  if (canViewAll && query.owner) {
    if (!Types.ObjectId.isValid(query.owner)) {
      throw new AppError("Invalid owner id", 400);
    }
    filter.owner = query.owner;
  } else filter.owner = requestingUserId;

  return paginate(
    MediaAssetModel,
    filter,
    parsePagination(query.page, query.limit),
  );
};

export const registerMedia = async (
  input: CreateMediaInput,
  ownerId: string,
) => {
  if (!Types.ObjectId.isValid(ownerId))
    throw new AppError("Invalid owner id", 400);

  if (input.provider === "cloudinary" && !input.publicId) {
    throw new AppError("Cloudinary media requires a public id", 400);
  }

  return MediaAssetModel.create({ ...input, owner: ownerId });
};

export const archiveMedia = async (
  id: string,
  requestingUserId: string,
  canManageAll: boolean,
) => {
  if (!Types.ObjectId.isValid(id)) throw new AppError("Invalid media id", 400);

  const filter = canManageAll
    ? { _id: id }
    : { _id: id, owner: requestingUserId };
  const media = await MediaAssetModel.findOneAndUpdate(
    filter,
    { status: "archived" },
    { new: true },
  )
    .lean()
    .exec();

  if (!media) throw new AppError("Media asset not found", 404);
  return media;
};
