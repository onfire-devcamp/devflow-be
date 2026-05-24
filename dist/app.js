import express from "express";
import "dotenv/config";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import activityRoute from "./routes/activityRoute.js";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", async (req, res) => {
    res.send("API is working");
});
app.use("/api/user", userRoute);
app.use("/api/activity", activityRoute);
export default app;
