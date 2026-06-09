import express from "express";
import {
  getProjectDetailsController,
  getProjectRoadmapController,
  getProjectTechStackController,
  getProjectsController,
  getTaskDetailsController,
} from "../controllers/projectControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getProjectsController);
router.get("/tasks/:taskId", protect, getTaskDetailsController);
router.get("/:projectId/roadmap", getProjectRoadmapController);
router.get("/:projectId/tech-stack", getProjectTechStackController);
router.get("/:projectId", getProjectDetailsController);

export default router;
