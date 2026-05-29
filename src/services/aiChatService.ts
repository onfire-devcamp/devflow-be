import AIChat from "../models/aiChatModel.js";
import GeminiClient from "../utils/geminiClient.js";
import { MENTOR_SYSTEM_PROMPT } from "../constants/aiPrompts.js";
import { toAIChatView } from "../utils/mappers.js";
import { getTaskDetails } from "./../services/projectService.js";
import type { AIChatView } from "../types/aiTypes.js";
import type { AIChatDocument } from "../models/aiChatModel.js";
import { BadRequestError } from "../utils/customErrors.js";

export const getChatHistory = async (
  userId: string,
  projectId: string,
  taskId: string,
): Promise<AIChatView[]> => {
  if (![userId, projectId, taskId].every((id) => id && id.length > 0)) {
    throw new BadRequestError("Invalid identifiers for chat history.");
  }

  const chats = (await AIChat.find({ userId, projectId, taskId })
    .sort({ createdAt: 1 })
    .lean()) as unknown as AIChatDocument[];

  return chats.map((c) => toAIChatView(c));
};

export const sendMessage = async (
  userId: string,
  projectId: string,
  taskId: string,
  message: string,
): Promise<AIChatView> => {
  if (!message || message.trim().length === 0)
    throw new BadRequestError("Message is empty.");

  const historyDocs = (await AIChat.find({ userId, projectId, taskId })
    .sort({ createdAt: 1 })
    .lean()) as unknown as AIChatDocument[];

  const history = historyDocs.map((h) => ({
    role: h.role,
    parts: [{ text: h.message }],
  }));

  await AIChat.create({ userId, projectId, taskId, message, role: "user" });

  const taskDetails = await getTaskDetails(taskId);
  const systemInstruction = `${MENTOR_SYSTEM_PROMPT}\n\nTask Instructions:\n${taskDetails.task.instructions ?? ""}`;

  const replyText = await GeminiClient.generateChatResponse(
    history,
    message,
    systemInstruction,
  );

  const mentorMsg = (await AIChat.create({
    userId,
    projectId,
    taskId,
    message: replyText,
    role: "mentor",
  })) as unknown as AIChatDocument;

  return toAIChatView(mentorMsg);
};
