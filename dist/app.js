import express from "express";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import activityRoute from "./routes/activityRoute.js";
import { env } from "./config/environment.js";
const app = express();
app.use(helmet());
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.get("/", (_req, res) => {
    res.send("API is working");
});
app.use("/api/user", userRoute);
app.use("/api/activity", activityRoute);
export default app;
