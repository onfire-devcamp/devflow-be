import express from "express";
import {
  createUserActivity,
  getUserRecentActivities,
} from "../controllers/activityControllers.ts";

const router = express.Router();

router.get("/user/:userId", getUserRecentActivities);
router.post("/", createUserActivity);

export default router;
