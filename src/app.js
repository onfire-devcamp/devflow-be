import express from "express";
import "dotenv/config";
import userRoute from "./routes/userRoute.js";

const app = express();
const myLog = (req, res, next) => {
  console.log("test");
  next();
};
app.use(myLog);
app.use(express.json());
app.get("/", async (req, res) => {
  res.send("API is working");
});

app.use("/user", userRoute);

export default app;
