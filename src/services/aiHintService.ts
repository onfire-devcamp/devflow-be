import AIHint from "../models/aiHintModel.js";
import GeminiClient from "../utils/geminiClient.js";
import {
  HINT_SYSTEM_PROMPT,
  EXPLAIN_SYSTEM_PROMPT,
  buildHintPrompt,
} from "../constants/aiPrompts.js";
import { toAIHintView } from "../utils/mappers.js";
import type { AIHintDocument } from "../models/aiHintModel.js";
import { getUserWorkspace } from "./workspaceService.js";
import { appendChatMessages } from "./aiChatService.js";
import { BadRequestError, NotFoundError } from "../utils/customErrors.js";
import { buildHintUserMessage } from "../constants/chatMessages.js";
import type { AIHintView } from "../types/aiTypes.js";
import { isValidObjectId } from "mongoose";

export const requestHintOrExplanation = async (
  userId: string,
  projectId: string,
  taskId: string,
  fileId: string,
  type: "hint" | "explain",
  selectedCode: string,
  userQuestion?: string,
): Promise<AIHintView> => {
  if (![userId, projectId, taskId, fileId].every(isValidObjectId)) {
    throw new BadRequestError("Invalid identifiers for hint request.");
  }

  const workspaceFiles = await getUserWorkspace(userId, projectId);
  const target = workspaceFiles.find((f) => f.fileId._id === fileId);
  if (!target) throw new NotFoundError("User file not found in workspace.");

  const prompt = buildHintPrompt(target.content, selectedCode, userQuestion);

  const systemInstruction =
    type === "hint" ? HINT_SYSTEM_PROMPT : EXPLAIN_SYSTEM_PROMPT;

  const aiResponse = await GeminiClient.generateText(prompt, systemInstruction);

  const saved = await AIHint.create({
    userId,
    projectId,
    taskId,
    fileId,
    type,
    selectedCode,
    aiResponse,
  });
  await saved.populate("fileId");

  await appendChatMessages(userId, projectId, taskId, [
    {
      role: "user",
      message: buildHintUserMessage(type, userQuestion),
    },
    { role: "mentor", message: aiResponse },
  ]);

  return toAIHintView(saved as unknown as AIHintDocument);
};
