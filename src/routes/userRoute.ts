import express from "express";
import { authLimiter } from "../middlewares/rateLimiters.js";
import {
  createUser,
  getUser,
  deleteProfile,
  updateProfile,
  loginUser,
  googleAuth,
  getUserProgress,
  getUserStreak,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserSkills } from "../controllers/progressBarLogic.js";

const router = express.Router();

router.post("/", authLimiter, createUser);
router.post("/login", authLimiter, loginUser);
router.post("/google-auth", authLimiter, googleAuth);

router.get("/", protect, getUser);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);
router.get("/skills", protect, getUserSkills);
router.get("/progress", protect, getUserProgress);
router.get("/streak", protect, getUserStreak);

export default router;
