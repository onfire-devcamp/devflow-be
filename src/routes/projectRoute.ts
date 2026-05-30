import express from "express";
import {
  getProjectDetailsController,
  getProjectRoadmapController,
  getProjectTechStackController,
  getProjectsController,
  getTaskDetailsController,
} from "../controllers/projectControllers.js";

const router = express.Router();

router.get("/", getProjectsController);
router.get("/tasks/:taskId", getTaskDetailsController);
router.get("/:projectId/roadmap", getProjectRoadmapController);
router.get("/:projectId/tech-stack", getProjectTechStackController);
router.get("/:projectId", getProjectDetailsController);

export default router;
