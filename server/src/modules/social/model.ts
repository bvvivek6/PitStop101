import { Schema, model } from "mongoose";
import { followTargetTypes } from "./types.js";

const followSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: followTargetTypes,
      required: true,
      index: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
  },
  { timestamps: true },
);

followSchema.index(
  { follower: 1, targetType: 1, targetId: 1 },
  { unique: true },
);
followSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

export const FollowModel = model("Follow", followSchema);
