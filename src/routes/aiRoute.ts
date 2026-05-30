import express from "express";
import {
  chatController,
  hintController,
  evaluationController,
} from "../controllers/aiControllers.ts";
import { protect } from "../middlewares/authMiddleware.js";
import { aiRateLimiter } from "../middlewares/aiRateLimiter.js";
import {
  chatBodySchema,
  evaluationBodySchema,
  hintBodySchema,
  validateBody,
} from "../middlewares/aiValidationMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(aiRateLimiter);

router.post("/chat", validateBody(chatBodySchema), chatController);
router.post("/hint", validateBody(hintBodySchema), hintController);
router.post(
  "/evaluate",
  validateBody(evaluationBodySchema),
  evaluationController,
);

export default router;
