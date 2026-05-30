import express from "express";
import { refreshTokens, logout } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/refresh", refreshTokens);
router.post("/logout", logout);

export default router;
