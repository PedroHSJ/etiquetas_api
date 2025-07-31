import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";

const server = express();

// Declare global variables for TypeScript
declare global {
  var __nestApp: any;
  var __dataSource: any;
}

export default async (req: any, res: any) => {
  try {
    if (!global.__nestApp) {
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
        {
          logger: ["error", "warn"],
        },
      );

      app.enableCors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true,
      });

      await app.init();
      global.__nestApp = app;
    }

    return server(req, res);
  } catch (error) {
    console.error("Error initializing NestJS app:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
