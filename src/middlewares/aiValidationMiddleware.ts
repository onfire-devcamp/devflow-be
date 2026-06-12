import { z } from "zod";

const objectIdSchema = z.string().trim().min(1, "Must be a non-empty string");

export const chatBodySchema = z.object({
  projectId: objectIdSchema,
  taskId: objectIdSchema,
  message: z.string().trim().min(1, "message is required"),
});

export const hintBodySchema = z.object({
  projectId: objectIdSchema,
  taskId: objectIdSchema,
  fileId: objectIdSchema,
  type: z.enum(["hint", "explain"]),
  selectedCode: z.string().trim().min(1, "selectedCode is required"),
  userQuestion: z.string().trim().optional(),
});

export const evaluationBodySchema = z.object({
  projectId: objectIdSchema,
  taskId: objectIdSchema,
});

export const explainToPassBodySchema = z.object({
  projectId: objectIdSchema,
  taskId: objectIdSchema,
  mcqAnswer: z.string().trim().min(1, "mcqAnswer is required"),
  explanation: z.string().trim().min(1, "explanation is required"),
});

export const appendChatMessageBodySchema = z.object({
  projectId: objectIdSchema,
  taskId: objectIdSchema,
  sender: z.enum(["user", "ai"]),
  text: z.string().trim().min(1, "text is required"),
  isPassAction: z.boolean().optional(),
});

export const getChatHistorySchema = z.object({
  projectId: objectIdSchema,
  taskId: objectIdSchema,
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).default(4),
});
