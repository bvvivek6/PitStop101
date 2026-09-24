import type { ErrorRequestHandler, RequestHandler } from "express";
import { z } from "zod";

export class AppError extends Error {
  public readonly statusCode: number;

  public constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new AppError("Route not found", 404));
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  const isValidationError = error instanceof z.ZodError;
  const statusCode = isValidationError
    ? 400
    : error instanceof AppError
      ? error.statusCode
      : 500;
  const message = isValidationError
    ? "Request validation failed"
    : error instanceof AppError
      ? error.message
      : "Internal server error";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(isValidationError ? { issues: error.issues } : {}),
    },
  });
};
