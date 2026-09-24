import { createApp } from "./src/app.js";
import { env } from "./src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./src/database/mongoose.js";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`Pitstop API listening on http://localhost:${env.PORT}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`${signal} received. Shutting down gracefully.`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
};

startServer().catch((error: unknown) => {
  console.error("Unable to start Pitstop API", error);
  process.exit(1);
});
