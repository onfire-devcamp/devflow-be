import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import userRoute from "./routes/userRoute.ts";

const app = express();

app.use(express.json());
app.use("/users", userRoute);

export default app;
