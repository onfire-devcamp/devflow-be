import express from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.ts";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
