import express from "express";
import {
  createUser,
  getUser,
  deleteProfile,
  updateProfile,
  loginUser,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserSkills } from "../controllers/progressBarLogic.js";
const router = express.Router();
//anyone can access this
router.post("/", createUser);
router.post("/login", loginUser);
//need token to get
router.get("/", protect, getUser);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);
router.get("/skills", protect, getUserSkills);

export default router;
