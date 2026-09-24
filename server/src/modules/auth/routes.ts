import { Router } from "express";
import { validateBody } from "../../middleware/validate.js";
import { registerController, loginController } from "./controller.js";
import { registerUserSchema } from "../users/validator.js";
import { loginSchema } from "./validator.js";

export const authRoutes = Router();
authRoutes.post(
  "/register",
  validateBody(registerUserSchema),
  registerController,
);
authRoutes.post("/login", validateBody(loginSchema), loginController);
