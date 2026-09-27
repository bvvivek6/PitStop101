import { Types } from "mongoose";
import { AppError } from "../../middleware/error-handler.js";
import { BrandModel } from "../brands/model.js";
import { UserModel } from "../users/model.js";
import { VehicleModel } from "../vehicles/model.js";
import { paginate, parsePagination } from "../../utils/pagination.js";
import { FollowModel } from "./model.js";
import type { FollowListQuery, FollowTargetInput } from "./types.js";

const targetModels = {
  user: UserModel,
  brand: BrandModel,
  vehicle: VehicleModel,
} as const;

const assertTargetExists = async (
  targetType: FollowTargetInput["targetType"],
  targetId: string,
) => {
  if (!Types.ObjectId.isValid(targetId))
    throw new AppError("Invalid target id", 400);

  const model = targetModels[targetType] as any;
  const exists = await model.exists({ _id: targetId }).exec();
  if (!exists) throw new AppError(`${targetType} not found`, 404);
};

export const listFollows = async (query: FollowListQuery) => {
  const filter: Record<string, unknown> = {};
  if (query.targetType) filter.targetType = query.targetType;

  return paginate(
    FollowModel,
    filter,
    parsePagination(query.page, query.limit),
  );
};

export const followTarget = async (
  followerId: string,
  input: FollowTargetInput,
) => {
  if (!Types.ObjectId.isValid(followerId))
    throw new AppError("Invalid follower id", 400);
  await assertTargetExists(input.targetType, input.targetId);

  return FollowModel.findOneAndUpdate(
    {
      follower: followerId,
      targetType: input.targetType,
      targetId: input.targetId,
    },
    {
      follower: followerId,
      targetType: input.targetType,
      targetId: input.targetId,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
    .lean()
    .exec();
};

export const unfollowTarget = async (
  followerId: string,
  targetType: FollowTargetInput["targetType"],
  targetId: string,
) => {
  if (!Types.ObjectId.isValid(followerId))
    throw new AppError("Invalid follower id", 400);
  if (!Types.ObjectId.isValid(targetId))
    throw new AppError("Invalid target id", 400);

  const deleted = await FollowModel.findOneAndDelete({
    follower: followerId,
    targetType,
    targetId,
  }).exec();

  if (!deleted) throw new AppError("Follow not found", 404);
};
