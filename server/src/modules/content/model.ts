import { Schema, model } from "mongoose";
import { contentStatuses, contentTypes } from "./types.js";

const mediaSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
    alt: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false },
);

const seoSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 240 },
    keywords: [{ type: String, trim: true, maxlength: 50 }],
    canonicalUrl: { type: String, trim: true },
  },
  { _id: false },
);

const reviewMetricsSchema = new Schema(
  {
    performance: { type: Number, min: 0, max: 10 },
    comfort: { type: Number, min: 0, max: 10 },
    practicality: { type: Number, min: 0, max: 10 },
    design: { type: Number, min: 0, max: 10 },
    value: { type: Number, min: 0, max: 10 },
    safety: { type: Number, min: 0, max: 10 },
    technology: { type: Number, min: 0, max: 10 },
  },
  { _id: false },
);

const comparisonEntrySchema = new Schema(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    label: { type: String, trim: true, maxlength: 120 },
    score: { type: Number, min: 0, max: 10 },
  },
  { _id: false },
);

const contentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subtitle: { type: String, trim: true, maxlength: 200 },
    excerpt: { type: String, trim: true, maxlength: 500 },
    content: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true, index: true },
    status: {
      type: String,
      enum: contentStatuses,
      default: "draft",
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag", index: true }],
    coverImage: { type: mediaSchema, default: null },
    gallery: { type: [mediaSchema], default: [] },
    relatedVehicles: [{ type: Schema.Types.ObjectId, ref: "Vehicle" }],
    relatedBrands: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
    relatedArticles: [{ type: Schema.Types.ObjectId, ref: "Content" }],
    readingTime: { type: Number, min: 1, default: 1 },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
    seo: { type: seoSchema, default: null },
    source: {
      name: { type: String, trim: true, maxlength: 100 },
      url: { type: String, trim: true },
    },
    references: [
      {
        title: { type: String, trim: true, maxlength: 150 },
        url: { type: String, trim: true },
      },
    ],
    reviewMetrics: { type: reviewMetricsSchema, default: null },
    comparisonData: {
      summary: { type: String, trim: true, maxlength: 300 },
      entries: { type: [comparisonEntrySchema], default: [] },
    },
  },
  { timestamps: true },
);

contentSchema.index({ title: 1 });
contentSchema.index({ status: 1, publishedAt: -1 });
contentSchema.index({ category: 1, status: 1, publishedAt: -1 });
contentSchema.index({ author: 1, status: 1, publishedAt: -1 });
contentSchema.index({ tags: 1, status: 1 });

export const ContentModel = model("Content", contentSchema);
