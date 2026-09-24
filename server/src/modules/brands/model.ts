import { Schema, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    country: { type: String, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 2_000 },
    logoUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

brandSchema.index({ name: 1 });
export const BrandModel = model("Brand", brandSchema);
