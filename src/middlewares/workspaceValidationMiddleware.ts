import { z } from "zod";

const objectIdSchema = z.string().trim().min(1, "Must be a non-empty string");

export const initializeWorkspaceBodySchema = z.object({
  projectId: objectIdSchema,
  taskId: objectIdSchema,
});

export const completeTaskBodySchema = z.object({
  projectId: objectIdSchema,
  taskId: objectIdSchema,
});

export const saveUserFileBodySchema = z.object({
  projectId: objectIdSchema,
  fileId: objectIdSchema,
  newContent: z.string().trim().min(1, "newContent is required"),
});
