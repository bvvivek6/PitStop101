import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, trim: true, maxlength: 1_000 },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true },
);

categorySchema.index({ name: 1 });
categorySchema.index({ parentCategory: 1, name: 1 });

export const CategoryModel = model("Category", categorySchema);
