export const vehicleTypes = [
  "car",
  "bike",
  "scooter",
  "commercial",
  "concept",
] as const;
export const fuelTypes = [
  "petrol",
  "diesel",
  "hybrid",
  "electric",
  "hydrogen",
  "other",
] as const;

export type VehicleType = (typeof vehicleTypes)[number];
export type FuelType = (typeof fuelTypes)[number];

export interface VehicleListQuery {
  page?: string;
  limit?: string;
  search?: string;
  vehicleType?: string;
  fuelType?: string;
  brand?: string;
}
