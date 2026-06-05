import express from "express";
import {
  chatController,
  explainToPassController,
  hintController,
  evaluationController,
} from "../controllers/aiControllers.ts";
import { protect } from "../middlewares/authMiddleware.js";
import { aiRateLimiter } from "../middlewares/aiRateLimiter.js";
import {
  chatBodySchema,
  evaluationBodySchema,
  explainToPassBodySchema,
  hintBodySchema,
} from "../middlewares/aiValidationMiddleware.js";
import { validateBody } from "../middlewares/validationMiddleware.js";

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
router.post(
  "/explain-to-pass",
  validateBody(explainToPassBodySchema),
  explainToPassController,
);

export default router;
