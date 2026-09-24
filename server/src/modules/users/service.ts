import bcrypt from "bcrypt";
import { AppError } from "../../middleware/error-handler.js";
import { UserModel } from "./model.js";
import type { RegisterUserInput } from "./validator.js";

const SALT_ROUNDS = 12;

export const toPublicUser = (user: {
  _id: unknown;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const createUser = async (input: RegisterUserInput) => {
  const email = input.email.toLowerCase();
  const existingUser = await UserModel.exists({ email }).exec();
  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await UserModel.create({ ...input, email, passwordHash });
  return toPublicUser(user);
};

export const findUserForAuthentication = async (email: string) =>
  UserModel.findOne({ email: email.toLowerCase() })
    .select("+passwordHash")
    .exec();

export const findPublicUserById = async (id: string) => {
  const user = await UserModel.findById(id).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return toPublicUser(user);
};

export const verifyPassword = (password: string, passwordHash: string) =>
  bcrypt.compare(password, passwordHash);
