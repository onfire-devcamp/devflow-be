import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.ts";
import activityRoute from "./routes/activityRoute.ts";
import authRoute from "./routes/authRoute.ts";
import { env } from "./config/environment.js";
import aiRoute from "./routes/aiRoute.ts";
import projectRoute from "./routes/projectRoute.js";
import workspaceRoute from "./routes/workspaceRoute.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true, // Required for HttpOnly cookies to be sent cross-origin
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.send("API is working");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/activity", activityRoute);
app.use("/api/ai", aiRoute);
app.use("/api/project", projectRoute);
app.use("/api/workspace", workspaceRoute);

export default app;
