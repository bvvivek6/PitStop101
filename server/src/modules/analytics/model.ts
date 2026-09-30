import { Schema, model } from "mongoose";
import { analyticsEntityTypes, analyticsEventTypes } from "./types.js";

const analyticsEventSchema = new Schema(
  {
    eventType: { type: String, enum: analyticsEventTypes, required: true, index: true },
    entityType: { type: String, enum: analyticsEntityTypes, index: true },
    entityId: { type: Schema.Types.ObjectId, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    sessionId: { type: String, trim: true, maxlength: 120, index: true },
    anonymousId: { type: String, trim: true, maxlength: 120 },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const AnalyticsEventModel = model("AnalyticsEvent", analyticsEventSchema);
