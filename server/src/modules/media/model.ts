import { Schema, model } from "mongoose";
import { mediaKinds, mediaProviders, mediaStatuses } from "./types.js";

const mediaAssetSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
    kind: { type: String, enum: mediaKinds, required: true, index: true },
    provider: {
      type: String,
      enum: mediaProviders,
      default: "external",
      required: true,
    },
    status: {
      type: String,
      enum: mediaStatuses,
      default: "active",
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    alt: { type: String, trim: true, maxlength: 200 },
    caption: { type: String, trim: true, maxlength: 500 },
    mimeType: { type: String, trim: true, maxlength: 100 },
    width: { type: Number, min: 1 },
    height: { type: Number, min: 1 },
    durationSeconds: { type: Number, min: 0 },
    bytes: { type: Number, min: 0 },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

mediaAssetSchema.index({ owner: 1, status: 1, createdAt: -1 });
mediaAssetSchema.index({ provider: 1, publicId: 1 }, { sparse: true });

export const MediaAssetModel = model("MediaAsset", mediaAssetSchema);
