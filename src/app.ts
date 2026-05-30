import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import userRoute from "./routes/userRoute.ts";
import cors from "cors";
import activityRoute from "./routes/activityRoute.ts";
import aiRoute from "./routes/aiRoute.ts";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", async (req: Request, res: Response) => {
  res.send("API is working");
});

app.use("/api/user", userRoute);
app.use("/api/activity", activityRoute);
app.use("/api/ai", aiRoute);

export default app;
