import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../middleware/error-handler.js";
import {
  createUser,
  findUserForAuthentication,
  toPublicUser,
  verifyPassword,
} from "../users/service.js";
import type { UserClaims } from "./types.js";
import type { RegisterUserInput } from "../users/validator.js";

const issueToken = (claims: UserClaims): string =>
  jwt.sign(claims, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

export const register = async (input: RegisterUserInput) => {
  const user = await createUser(input);
  return {
    user,
    token: issueToken({
      userId: user.id,
      role: user.role as UserClaims["role"],
    }),
  };
};

export const login = async (email: string, password: string) => {
  const user = await findUserForAuthentication(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new AppError("Invalid email or password", 401);
  }

  const publicUser = toPublicUser(user);
  return {
    user: publicUser,
    token: issueToken({
      userId: publicUser.id,
      role: publicUser.role as UserClaims["role"],
    }),
  };
};

export const verifyToken = (token: string): UserClaims => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as UserClaims;
  } catch {
    throw new AppError("Invalid or expired authentication token", 401);
  }
};
