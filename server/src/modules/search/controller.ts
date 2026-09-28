import type { RequestHandler } from "express";
import { search } from "./service.js";
import type { SearchQuery } from "./types.js";

export const searchController: RequestHandler = async (req, res, next) => {
  try {
    const results = await search(req.query as unknown as SearchQuery);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
