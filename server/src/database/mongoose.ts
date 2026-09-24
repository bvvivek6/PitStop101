import mongoose from "mongoose";
import { env } from "../config/env.js";

export const connectDatabase = async (): Promise<void> => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5_000,
  });
  console.log("MongoDB connected");
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
