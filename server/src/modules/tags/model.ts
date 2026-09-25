import { Schema, model } from "mongoose";

const tagSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

tagSchema.index({ name: 1 });

export const TagModel = model("Tag", tagSchema);
