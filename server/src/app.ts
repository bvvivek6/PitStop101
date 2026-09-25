import cors from "cors";
import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { authRoutes } from "./modules/auth/routes.js";
import { brandRoutes } from "./modules/brands/routes.js";
import { categoryRoutes } from "./modules/categories/routes.js";
import { contentRoutes } from "./modules/content/routes.js";
import { tagRoutes } from "./modules/tags/routes.js";
import { userRoutes } from "./modules/users/routes.js";
import { vehicleRoutes } from "./modules/vehicles/routes.js";

export const createApp = (): express.Express => {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1_000,
      limit: 100,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.get("/api/v1/health", (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        service: "pitstop-api",
        status: "ok",
        timestamp: new Date().toISOString(),
      },
    });
  });

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/brands", brandRoutes);
  app.use("/api/v1/vehicles", vehicleRoutes);
  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/tags", tagRoutes);
  app.use("/api/v1/content", contentRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
