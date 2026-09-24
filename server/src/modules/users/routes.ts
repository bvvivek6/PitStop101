import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { getCurrentUser } from "./controller.js";

export const userRoutes = Router();
userRoutes.get("/me", authenticate, getCurrentUser);
