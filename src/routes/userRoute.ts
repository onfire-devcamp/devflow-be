import express from "express";
import rateLimit from "express-rate-limit";
import {
  createUser,
  getUser,
  deleteProfile,
  updateProfile,
  loginUser,
  googleAuth,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", authLimiter, createUser);
router.post("/login", authLimiter, loginUser);
router.post("/google-auth", authLimiter, googleAuth);

router.get("/", protect, getUser);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

export default router;
