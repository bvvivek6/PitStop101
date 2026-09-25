import type { RequestHandler } from "express";
import { createTag, getTagBySlug, listTags } from "./service.js";

export const listTagsController: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, ...(await listTags(req.query)) });
  } catch (error) {
    next(error);
  }
};

export const getTagController: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: await getTagBySlug(String(req.params.slug)),
    });
  } catch (error) {
    next(error);
  }
};

export const createTagController: RequestHandler = async (req, res, next) => {
  try {
    const tag = await createTag(req.body);
    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};
