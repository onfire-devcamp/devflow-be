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

const router = express.Router();

router.get("/", getProjectsController);
router.get("/tasks/:taskId", protect, getTaskDetailsController);
router.get("/:projectId/roadmap", protect, getProjectRoadmapController);
router.get("/:projectId/tech-stack", getProjectTechStackController);
router.get("/:slug/codebase", getProjectCodebaseController);
router.get("/:slug", getProjectDetailsController);

export default router;
