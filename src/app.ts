import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import userRoute from "./routes/userRoute.ts";

const app = express();

app.use(express.json());
app.get("/", async (req: Request, res: Response) => {
  res.send("API is working");
});

app.use("/user", userRoute);

export default app;
