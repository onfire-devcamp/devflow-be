import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { ParsedQs } from "qs";
import {
  sendMessage,
  getChatHistoryForFrontend,
  appendChatMessageForFrontend,
} from "../services/aiChatService.js";
import { requestHintOrExplanation } from "../services/aiHintService.js";
import {
  evaluateExplainToPass,
  submitTaskForEvaluation,
} from "../services/aiEvaluationService.js";
import { getAuthenticatedUserId } from "../utils/authUtils.ts";
import { BadRequestError } from "../utils/customErrors.js";
import {
  SuccessResponse,
  handleControllerError,
} from "../utils/responseUtils.js";
import { getChatHistorySchema } from "../middlewares/aiValidationMiddleware.js";

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

interface ExplainToPassBody {
  projectId: string;
  taskId: string;
  mcqAnswer: string;
  explanation: string;
}

interface AppendChatMessageBody {
  projectId: string;
  taskId: string;
  sender: "user" | "ai";
  text: string;
  isPassAction?: boolean;
}

export const getChatHistoryController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { projectId, taskId, cursor, limit } = getChatHistorySchema.parse({
      ...req.params,
      ...req.query,
    });

    const history = await getChatHistoryForFrontend(
      userId,
      projectId,
      taskId,
      cursor,
      limit,
    );

    new SuccessResponse(res, history);
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const appendChatMessageController = async (
  req: Request<
    Record<string, string>,
    unknown,
    AppendChatMessageBody,
    ParsedQs
  >,
  res: Response,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { projectId, taskId, sender, text, isPassAction } = req.body;

    const savedMessage = await appendChatMessageForFrontend(userId, {
      projectId,
      taskId,
      sender,
      text,
      isPassAction,
    });

    new SuccessResponse(res, savedMessage, 201);
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const chatController = async (
  req: Request<Record<string, string>, unknown, ChatBody, ParsedQs>,
  res: Response,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { projectId, taskId, message } = req.body;

    const result = await sendMessage(userId, projectId, taskId, message);

    new SuccessResponse(res, result);
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

    new SuccessResponse(res, result);
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

    new SuccessResponse(res, result);
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};

export const explainToPassController = async (
  req: Request<Record<string, string>, unknown, ExplainToPassBody, ParsedQs>,
  res: Response,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { projectId, taskId, mcqAnswer, explanation } = req.body;

    const result = await evaluateExplainToPass(
      userId,
      projectId,
      taskId,
      mcqAnswer,
      explanation,
    );

    new SuccessResponse(res, result);
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
};
