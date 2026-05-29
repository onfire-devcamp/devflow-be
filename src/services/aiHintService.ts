import AIHint from "../models/aiHintModel.js";
import GeminiClient from "../utils/geminiClient.js";
import { MENTOR_SYSTEM_PROMPT } from "../constants/aiPrompts.js";
import { toAIHintView } from "../utils/mappers.js";
import type { AIHintDocument } from "../models/aiHintModel.js";
import { getUserWorkspace } from "./workspaceService.js";
import { BadRequestError, NotFoundError } from "../utils/customErrors.js";
import type { AIHintView } from "../types/aiTypes.js";

export const requestHintOrExplanation = async (
  userId: string,
  projectId: string,
  taskId: string,
  fileId: string,
  type: "hint" | "explain",
  selectedCode: string,
  userQuestion?: string,
): Promise<AIHintView> => {
  if (![userId, projectId, taskId, fileId].every((id) => id && id.length > 0)) {
    throw new BadRequestError("Invalid identifiers for hint request.");
  }

  const workspaceFiles = await getUserWorkspace(userId, projectId);
  const target = workspaceFiles.find((f) => f.fileId._id === fileId);
  if (!target) throw new NotFoundError("User file not found in workspace.");

  const prompt = `File content:\n${target.content}\n\nSelected snippet:\n${selectedCode}\n\nQuestion:\n${userQuestion ?? "Explain or hint about the selected code."}`;

  const aiResponse = await GeminiClient.generateText(
    prompt,
    MENTOR_SYSTEM_PROMPT,
  );

  const saved = await AIHint.create({
    userId,
    projectId,
    taskId,
    fileId,
    type,
    selectedCode,
    aiResponse,
  });

  return toAIHintView(saved as unknown as AIHintDocument);
};
