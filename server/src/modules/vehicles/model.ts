import { Schema, model } from "mongoose";
import { fuelTypes, vehicleTypes } from "./types.js";

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, trim: true, maxlength: 200 },
    credit: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false },
);

const vehicleSchema = new Schema(
  {
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: vehicleTypes,
      required: true,
      index: true,
    },
    fuelTypes: [{ type: String, enum: fuelTypes }],
    segment: { type: String, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 2_000 },
    images: { type: [imageSchema], default: [] },
  },
  { timestamps: true },
);

vehicleSchema.index({ name: 1 });
vehicleSchema.index({ brand: 1, vehicleType: 1 });
export const VehicleModel = model("Vehicle", vehicleSchema);

const generationSchema = new Schema(
  {
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    code: { type: String, trim: true, maxlength: 50 },
    startYear: { type: Number, min: 1886, max: 2_200 },
    endYear: { type: Number, min: 1886, max: 2_200 },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

generationSchema.index({ vehicle: 1, name: 1 }, { unique: true });
export const GenerationModel = model("Generation", generationSchema);

const specificationsSchema = new Schema(
  {
    price: { type: Number, min: 0 },
    engine: { type: String, trim: true, maxlength: 100 },
    displacement: { type: Number, min: 0 },
    power: { type: Number, min: 0 },
    torque: { type: Number, min: 0 },
    transmission: { type: String, trim: true, maxlength: 100 },
    drivetrain: { type: String, trim: true, maxlength: 100 },
    fuelType: { type: String, enum: fuelTypes },
    mileage: { type: Number, min: 0 },
    range: { type: Number, min: 0 },
    batteryCapacity: { type: Number, min: 0 },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      wheelbase: { type: Number, min: 0 },
    },
    weight: { type: Number, min: 0 },
    seatingCapacity: { type: Number, min: 1 },
    safetyRating: { type: Number, min: 0, max: 5 },
    features: [{ type: String, trim: true, maxlength: 100 }],
  },
  { _id: false },
);

const variantSchema = new Schema(
  {
    generation: {
      type: Schema.Types.ObjectId,
      ref: "Generation",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    specifications: { type: specificationsSchema, required: true },
  },
  { timestamps: true },
);

variantSchema.index({ generation: 1, name: 1 }, { unique: true });
export const VariantModel = model("Variant", variantSchema);
