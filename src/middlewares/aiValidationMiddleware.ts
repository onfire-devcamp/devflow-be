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
