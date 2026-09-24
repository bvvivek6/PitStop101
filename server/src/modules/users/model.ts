import { Schema, model, type InferSchemaType } from "mongoose";
import { userRoles } from "./types.js";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: userRoles,
      default: "user",
      required: true,
      index: true,
    },
    avatarUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
