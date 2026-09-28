import { z } from "zod";
import { searchEntityTypes } from "./types.js";

export const searchQuerySchema = z.object({
  q: z.string().trim().min(2).max(100),
  types: z
    .string()
    .optional()
    .transform((value) =>
      value
        ? value
            .split(",")
            .filter((type): type is (typeof searchEntityTypes)[number] =>
              searchEntityTypes.includes(
                type as (typeof searchEntityTypes)[number],
              ),
            )
        : undefined,
    ),
  limit: z.string().optional(),
});
