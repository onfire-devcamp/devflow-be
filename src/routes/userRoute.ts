import express from "express";
import {
  createUser,
  getUser,
  deleteProfile,
  updateProfile,
  loginUser,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();
//anyone can access this
router.post("/", createUser);
router.post("/login", loginUser);
//need token to get
router.get("/", protect, getUser);
router.put("/:id", protect, updateProfile);
router.delete("/:id", protect, deleteProfile);

export default router;
