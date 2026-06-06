import type { Request, Response } from "express";
import {
  getAllProjects,
  getProjectDetails,
  getProjectRoadmap,
  getProjectTechStackGrouped,
  getTaskDetails,
} from "../services/projectService.js";
import { BadRequestError } from "../utils/customErrors.ts";
import { handleControllerError } from "../utils/responseUtils.js";

interface ProjectParams {
  projectId: string;
}

interface TaskParams {
  taskId: string;
}

export const getProjectsController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projects = await getAllProjects();

    res.status(200).json({ success: true, data: projects });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const getProjectDetailsController = async (
  req: Request<ProjectParams>,
  res: Response,
): Promise<void> => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new BadRequestError("projectId is required.");
    }

    const project = await getProjectDetails(projectId);

    res.status(200).json({ success: true, data: project });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const getProjectRoadmapController = async (
  req: Request<ProjectParams>,
  res: Response,
): Promise<void> => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new BadRequestError("projectId is required.");
    }

    const roadmap = await getProjectRoadmap(projectId);

    res.status(200).json({ success: true, data: roadmap });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const getProjectTechStackController = async (
  req: Request<ProjectParams>,
  res: Response,
): Promise<void> => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new BadRequestError("projectId is required.");
    }

    const techStack = await getProjectTechStackGrouped(projectId);

    res.status(200).json({ success: true, data: techStack });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const getTaskDetailsController = async (
  req: Request<TaskParams>,
  res: Response,
): Promise<void> => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      throw new BadRequestError("taskId is required.");
    }

    const taskDetails = await getTaskDetails(taskId);

    res.status(200).json({ success: true, data: taskDetails });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};
