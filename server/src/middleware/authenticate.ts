import type { Request, RequestHandler } from "express";
import { AppError } from "./error-handler.js";
import { verifyToken } from "../modules/auth/service.js";
import type { UserClaims } from "../modules/auth/types.js";
import type { UserRole } from "../modules/users/types.js";

export type AuthenticatedRequest = Request & { user: UserClaims };

export const authenticate: RequestHandler = (req, _res, next) => {
  const authorization = req.header("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError("Authentication required", 401));
    return;
  }

  try {
    const claims = verifyToken(authorization.slice(7));
    (req as AuthenticatedRequest).user = claims;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize =
  (...allowedRoles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    const { user } = req as AuthenticatedRequest;
    if (!allowedRoles.includes(user.role)) {
      next(
        new AppError("You do not have permission to perform this action", 403),
      );
      return;
    }
    next();
  };
