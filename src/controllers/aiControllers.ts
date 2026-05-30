import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { ParsedQs } from "qs";
import { sendMessage } from "../services/aiChatService.js";
import { requestHintOrExplanation } from "../services/aiHintService.js";
import { submitTaskForEvaluation } from "../services/aiEvaluationService.js";
import { BadRequestError } from "../utils/customErrors.ts";
import { handleControllerError } from "../utils/responseUtils.js";

interface ChatBody {
  projectId: string;
  taskId: string;
  message: string;
}

interface HintBody {
  projectId: string;
  taskId: string;
  fileId: string;
  type: "hint" | "explain";
  selectedCode: string;
  userQuestion?: string;
}

interface EvaluationBody {
  projectId: string;
  taskId: string;
}

const getAuthenticatedUserId = (req: Request): string => {
  const authenticatedUser = req.user as jwt.JwtPayload;
  const userId = authenticatedUser?.userId;

  if (!userId || typeof userId !== "string") {
    throw new BadRequestError("Invalid authenticated user context.");
  }

  return userId;
};

export const chatController = async (
  req: Request<Record<string, string>, unknown, ChatBody, ParsedQs>,
  res: Response,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { projectId, taskId, message } = req.body;

    const result = await sendMessage(userId, projectId, taskId, message);

    res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const hintController = async (
  req: Request<Record<string, string>, unknown, HintBody, ParsedQs>,
  res: Response,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { projectId, taskId, fileId, type, selectedCode, userQuestion } =
      req.body;

    const result = await requestHintOrExplanation(
      userId,
      projectId,
      taskId,
      fileId,
      type,
      selectedCode,
      userQuestion,
    );

    res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const evaluationController = async (
  req: Request<Record<string, string>, unknown, EvaluationBody, ParsedQs>,
  res: Response,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { projectId, taskId } = req.body;

    const result = await submitTaskForEvaluation(userId, projectId, taskId);

    res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};
