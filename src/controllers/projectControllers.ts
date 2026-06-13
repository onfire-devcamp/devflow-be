import type { Request, Response } from "express";
import {
  getAllProjects,
  getProjectDetails,
  getProjectRoadmap,
  getProjectTechStackGrouped,
  getTaskDetails,
} from "../services/projectService.js";
import { getAuthenticatedUserId } from "../utils/authUtils.ts";
import { BadRequestError } from "../utils/customErrors.ts";
import {
  handleControllerError,
  SuccessResponse,
} from "../utils/responseUtils.js";

interface ProjectParams {
  projectId: string;
}

export const getProjectsController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projects = await getAllProjects();

    new SuccessResponse(res, projects);
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

interface ProjectDetailParams {
  slug: string;
}

export const getProjectDetailsController = async (
  req: Request<ProjectDetailParams>,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;
    console.log("getProjectDetailsController HIT with slug:", slug);

    if (!slug) {
      throw new BadRequestError("slug is required.");
    }

    const project = await getProjectDetails(slug);

    new SuccessResponse(res, project);
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const getProjectRoadmapController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { projectId } = req.params;

    if (!projectId || typeof projectId !== "string") {
      throw new BadRequestError("projectId is required.");
    }

    const userId = getAuthenticatedUserId(req);
    const roadmap = await getProjectRoadmap(projectId, userId);

    new SuccessResponse(res, roadmap);
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

    new SuccessResponse(res, techStack);
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const getTaskDetailsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { taskId } = req.params;

    if (!taskId || typeof taskId !== "string") {
      throw new BadRequestError("taskId is required.");
    }

    const userId = getAuthenticatedUserId(req);
    const taskDetails = await getTaskDetails(taskId, userId);

    new SuccessResponse(res, taskDetails);
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};
