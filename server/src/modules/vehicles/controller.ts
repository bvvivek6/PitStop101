import type { RequestHandler } from "express";
import {
  getVehicleBySlug,
  listGenerations,
  listVariants,
  listVehicles,
} from "./service.js";

export const listVehiclesController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    res.status(200).json({ success: true, ...(await listVehicles(req.query)) });
  } catch (error) {
    next(error);
  }
};

export const getVehicleController: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: await getVehicleBySlug(String(req.params.slug)),
    });
  } catch (error) {
    next(error);
  }
};

export const listGenerationsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    res.status(200).json({
      success: true,
      ...(await listGenerations(String(req.params.vehicleId), req.query)),
    });
  } catch (error) {
    next(error);
  }
};

export const listVariantsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    res.status(200).json({
      success: true,
      ...(await listVariants(String(req.params.generationId), req.query)),
    });
  } catch (error) {
    next(error);
  }
};
