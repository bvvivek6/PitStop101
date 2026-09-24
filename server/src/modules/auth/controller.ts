import type { RequestHandler } from "express";
import { register, login } from "./service.js";
import type { RegisterUserInput } from "../users/validator.js";
import type { z } from "zod";
import type { loginSchema } from "./validator.js";

export const registerController: RequestHandler = async (req, res, next) => {
  try {
    const result = await register(req.body as RegisterUserInput);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const loginController: RequestHandler = async (req, res, next) => {
  try {
    const input = req.body as z.infer<typeof loginSchema>;
    const result = await login(input.email, input.password);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
