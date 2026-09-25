import type { RequestHandler } from "express";
import {
  createCategory,
  getCategoryBySlug,
  listCategories,
} from "./service.js";

export const listCategoriesController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    res
      .status(200)
      .json({ success: true, ...(await listCategories(req.query)) });
  } catch (error) {
    next(error);
  }
};

export const getCategoryController: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: await getCategoryBySlug(String(req.params.slug)),
    });
  } catch (error) {
    next(error);
  }
};

export const createCategoryController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};
