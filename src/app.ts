import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import userRoute from "./routes/userRoute.ts";
import activityRoute from "./routes/activityRoute.ts";
import { env } from "./config/environment.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

app.get("/", (_req: Request, res: Response) => {
  res.send("API is working");
});

app.use("/api/user", userRoute);
app.use("/api/activity", activityRoute);

export default app;
