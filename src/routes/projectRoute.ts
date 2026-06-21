import express from "express";
import {
  getProjectDetailsController,
  getProjectRoadmapController,
  getProjectTechStackController,
  getProjectCodebaseController,
  getProjectsController,
  getTaskDetailsController,
} from "../controllers/projectControllers.js";
import { protect } from "../middlewares/authMiddleware.js";
import { cacheResponse } from "../middlewares/cacheMiddleware.js";

const ONE_HOUR = 3600;

const router = express.Router();

router.get("/", cacheResponse(ONE_HOUR), getProjectsController);
router.get("/tasks/:taskId", protect, getTaskDetailsController);
router.get("/:projectId/roadmap", protect, getProjectRoadmapController);
router.get(
  "/:projectId/tech-stack",
  cacheResponse(ONE_HOUR),
  getProjectTechStackController,
);
router.get(
  "/:slug/codebase",
  cacheResponse(ONE_HOUR),
  getProjectCodebaseController,
);
router.get("/:slug", cacheResponse(ONE_HOUR), getProjectDetailsController);

export default router;
