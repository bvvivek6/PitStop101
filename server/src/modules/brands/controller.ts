import type { RequestHandler } from "express";
import { getBrandBySlug, listBrands } from "./service.js";

export const listBrandsController: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, ...(await listBrands(req.query)) });
  } catch (error) {
    next(error);
  }
};

export const getBrandController: RequestHandler = async (req, res, next) => {
  try {
    res
      .status(200)
      .json({
        success: true,
        data: await getBrandBySlug(String(req.params.slug)),
      });
  } catch (error) {
    next(error);
  }
};
