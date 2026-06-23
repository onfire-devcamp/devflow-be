import express from "express";
import {
  completeTaskController,
  getUserWorkspaceController,
  initializeWorkspaceController,
  saveUserFileController,
} from "../controllers/workspaceControllers.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  completeTaskBodySchema,
  initializeWorkspaceBodySchema,
  saveUserFileBodySchema,
} from "../middlewares/workspaceValidationMiddleware.js";
import { validateBody } from "../middlewares/validationMiddleware.js";
import {
  autoSaveLimiter,
  heavyExportLimiter,
} from "../middlewares/rateLimiters.js";

const router = express.Router();

router.use(protect);

router.post(
  "/initialize",
  validateBody(initializeWorkspaceBodySchema),
  initializeWorkspaceController,
);
router.post(
  "/complete-task",
  validateBody(completeTaskBodySchema),
  completeTaskController,
);
router.put(
  "/file",
  autoSaveLimiter,
  validateBody(saveUserFileBodySchema),
  saveUserFileController,
);
router.get("/:projectId", heavyExportLimiter, getUserWorkspaceController);

export default router;
