import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { ParsedQs } from "qs";
import {
  completeTask,
  getUserWorkspace,
  initializeWorkspace,
  saveUserFile,
} from "../services/workspaceService.js";
import { BadRequestError } from "../utils/customErrors.ts";
import { handleControllerError } from "../utils/responseUtils.js";

interface InitializeWorkspaceBody {
  projectId: string;
  taskId: string;
}

interface CompleteTaskBody {
  projectId: string;
  taskId: string;
}

interface SaveUserFileBody {
  projectId: string;
  fileId: string;
  newContent: string;
}

const getAuthenticatedUserId = (req: Pick<Request, "user">): string => {
  const authenticatedUser = req.user as jwt.JwtPayload;
  const userId = authenticatedUser?.userId;

  if (!userId || typeof userId !== "string") {
    throw new BadRequestError("Invalid authenticated user context.");
  }

  return userId;
};

export const initializeWorkspaceController = async (
  req: Request<
    Record<string, string>,
    unknown,
    InitializeWorkspaceBody,
    ParsedQs
  >,
  res: Response,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { projectId, taskId } = req.body;

    const workspace = await initializeWorkspace(userId, projectId, taskId);

    res.status(200).json({ success: true, data: workspace });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const completeTaskController = async (
  req: Request<Record<string, string>, unknown, CompleteTaskBody, ParsedQs>,
  res: Response,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { projectId, taskId } = req.body;

    const progress = await completeTask(userId, projectId, taskId);

    res.status(200).json({ success: true, data: progress });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const getUserWorkspaceController = async (
  req: Request<Record<string, string>, unknown, unknown, ParsedQs>,
  res: Response,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { projectId } = req.params;

    if (!projectId) {
      throw new BadRequestError("projectId is required.");
    }

    const workspace = await getUserWorkspace(userId, projectId);

    res.status(200).json({ success: true, data: workspace });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const saveUserFileController = async (
  req: Request<Record<string, string>, unknown, SaveUserFileBody, ParsedQs>,
  res: Response,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { projectId, fileId, newContent } = req.body;

    const savedFile = await saveUserFile({
      userId,
      projectId,
      fileId,
      newContent,
    });

    res.status(200).json({ success: true, data: savedFile });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};
